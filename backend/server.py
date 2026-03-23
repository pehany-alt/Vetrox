from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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

# Gmail SMTP configuration
GMAIL_ADDRESS = os.environ.get('GMAIL_ADDRESS')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@vetrox.com')

# Create the main app
app = FastAPI(
    title="Vetrox PPF API",
    description="Premium Paint Protection Film - Australian Quality",
    version="1.0.0"
)

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
    company: Optional[str] = None
    enquiry_type: Optional[str] = None
    message: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    enquiry_type: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False

class ContactInfo(BaseModel):
    email: str = "admin@vetrox.com"
    phone: str = "+61 XXX XXX XXX"
    address: str = "Australia"

# Gmail SMTP Email Function
async def send_email_gmail(to_email: str, subject: str, html_content: str, reply_to: str = None):
    """Send email using Gmail SMTP"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = GMAIL_ADDRESS
        msg['To'] = to_email
        if reply_to:
            msg['Reply-To'] = reply_to
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Run SMTP in thread to keep async
        def send_smtp():
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
                server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())
        
        await asyncio.to_thread(send_smtp)
        return True
    except Exception as e:
        logger.error(f"Failed to send email via Gmail: {str(e)}")
        return False

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
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: #0a0a0a; padding: 30px; text-align: center;">
                <h1 style="color: #10b981; margin: 0; letter-spacing: 0.2em;">VETROX</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Premium Paint Protection Film</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0;">
                    New Website Enquiry
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold; width: 140px;">Name:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">{enquiry_obj.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Email:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;"><a href="mailto:{enquiry_obj.email}" style="color: #10b981;">{enquiry_obj.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Phone:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">{enquiry_obj.phone or 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Company:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">{enquiry_obj.company or 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Enquiry Type:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">{enquiry_obj.enquiry_type or 'Not specified'}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 20px; background: #fff; border-left: 4px solid #10b981;">
                    <h3 style="margin: 0 0 10px 0; color: #374151;">Message:</h3>
                    <p style="margin: 0; white-space: pre-wrap; color: #555;">{enquiry_obj.message}</p>
                </div>
                
                <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
                    Submitted on {enquiry_obj.created_at.strftime('%B %d, %Y at %I:%M %p')} AEST
                </p>
            </div>
            
            <div style="background: #0a0a0a; padding: 20px; text-align: center;">
                <p style="color: #666; margin: 0; font-size: 12px;">© 2024 Vetrox PPF Australia</p>
            </div>
        </body>
        </html>
        """
        
        subject = f"New Vetrox Enquiry: {enquiry_obj.enquiry_type or 'General'} from {enquiry_obj.name}"
        
        email_sent = await send_email_gmail(
            to_email=ADMIN_EMAIL,
            subject=subject,
            html_content=html_content,
            reply_to=enquiry_obj.email
        )
        
        if email_sent:
            logger.info(f"Email sent successfully to {ADMIN_EMAIL}")
            # Update enquiry with email status
            await db.enquiries.update_one(
                {"id": enquiry_obj.id},
                {"$set": {"email_sent": True}}
            )
            enquiry_obj.email_sent = True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
    
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
