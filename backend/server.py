from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@vetrox.com.au')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    service_type: Optional[str] = None
    message: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    service_type: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False

class ContactInfo(BaseModel):
    email: str = "admin@vetrox.com.au"
    phone: str = "+61 XXX XXX XXX"
    address: str = "Australia"

# Routes
@api_router.get("/")
async def root():
    return {"message": "Vetrox PPF API", "status": "running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

@api_router.post("/enquiry", response_model=Enquiry)
async def submit_enquiry(input: EnquiryCreate):
    """Submit an enquiry and send email notification to admin"""
    
    # Create enquiry object
    enquiry_dict = input.model_dump()
    enquiry_obj = Enquiry(**enquiry_dict)
    
    # Prepare document for MongoDB
    doc = enquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    # Save to database
    await db.enquiries.insert_one(doc)
    
    # Send email to admin
    email_sent = False
    try:
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                    New Enquiry from Vetrox PPF Website
                </h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
                    <p><strong>Name:</strong> {enquiry_obj.name}</p>
                    <p><strong>Email:</strong> {enquiry_obj.email}</p>
                    <p><strong>Phone:</strong> {enquiry_obj.phone or 'Not provided'}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #374151;">Vehicle Information</h3>
                    <p><strong>Make:</strong> {enquiry_obj.vehicle_make or 'Not provided'}</p>
                    <p><strong>Model:</strong> {enquiry_obj.vehicle_model or 'Not provided'}</p>
                    <p><strong>Service Type:</strong> {enquiry_obj.service_type or 'Not specified'}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #374151;">Message</h3>
                    <p style="white-space: pre-wrap;">{enquiry_obj.message}</p>
                </div>
                
                <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                    This enquiry was submitted on {enquiry_obj.created_at.strftime('%B %d, %Y at %I:%M %p')}
                </p>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"New Vetrox PPF Enquiry from {enquiry_obj.name}",
            "html": html_content,
            "reply_to": enquiry_obj.email
        }
        
        # Send email asynchronously
        email_result = await asyncio.to_thread(resend.Emails.send, params)
        email_sent = True
        logger.info(f"Email sent successfully to {ADMIN_EMAIL}, ID: {email_result.get('id')}")
        
        # Update enquiry with email status
        await db.enquiries.update_one(
            {"id": enquiry_obj.id},
            {"$set": {"email_sent": True}}
        )
        enquiry_obj.email_sent = True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        # Don't fail the request if email fails, just log it
    
    return enquiry_obj

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries():
    """Get all enquiries (admin endpoint)"""
    enquiries = await db.enquiries.find({}, {"_id": 0}).to_list(1000)
    
    for enquiry in enquiries:
        if isinstance(enquiry.get('created_at'), str):
            enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
    return enquiries

@api_router.get("/contact-info", response_model=ContactInfo)
async def get_contact_info():
    """Get contact information"""
    return ContactInfo()

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
