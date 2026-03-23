# Vetrox PPF Website - PRD

## Original Problem Statement
Rebuild Vetrox PPF website (vetrox.com.au) with enquiry form that sends email to admin@vetrox.com.au. Australian paint protection film company website.

## User Requirements
1. Font similar to original (Orbitron - tech/automotive feel)
2. "10 Year Warranty" in a styled box
3. Red Mercedes Benz photo for 'Coloured Series'
4. Uploaded satin matte car photo for 'Pro Satin Matte'
5. TOP-TPU colour chart from PDF for 'Colours' page (200+ colours)
6. Australian spelling throughout (colour, armour, authorised)
7. "We accept resellers" message on website
8. Updated enquiry form with reseller option
9. White car image for 'Gloss Series'
10. Email integration with Resend API

## Architecture
- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Email**: Resend API

## Core Pages
1. **Home** - Hero section, technology features, products preview, colours, resellers CTA, partners
2. **Products** - Gloss Series, Pro Satin Matte, Coloured Series
3. **Colours** - TOP-TPU colour gallery with 200+ colours and product codes
4. **About** - Company story, stats, reseller info
5. **Contact** - Enquiry form with email notification

## What's Been Implemented (23 March 2026)
- [x] Full website rebuild with Australian branding
- [x] Orbitron font for tech/automotive aesthetic
- [x] "10 Year Warranty" badge in styled box
- [x] Correct product images (white car, satin matte upload, red Benz)
- [x] TOP-TPU colour chart (200+ colours with codes)
- [x] Australian spelling (colour, armour, authorised)
- [x] Reseller sections on homepage, about, and contact pages
- [x] Enquiry form with quote/reseller options
- [x] Resend API integration configured
- [x] Mobile responsive design
- [x] All navigation and pages working

## Email Configuration
- **API Key**: Configured in backend/.env
- **Sender**: onboarding@resend.dev (Resend testing)
- **Recipient**: admin@vetrox.com.au

### Note on Email Delivery
Resend in testing mode can only send to verified emails. To send to admin@vetrox.com.au:
1. Go to resend.com/domains
2. Add and verify vetrox.com.au domain
3. Update SENDER_EMAIL to use verified domain

## API Endpoints
- `GET /api/` - Health check
- `GET /api/health` - Status
- `POST /api/enquiry` - Submit enquiry (sends email)
- `GET /api/enquiries` - List all enquiries
- `GET /api/contact-info` - Contact information

## Backlog (P1)
- [ ] Domain verification for email delivery
- [ ] Google Maps integration for location
- [ ] Customer testimonials section
- [ ] Image gallery/portfolio of installed vehicles

## Next Tasks
1. Verify domain in Resend dashboard for production email delivery
2. Add more vehicle gallery images
3. SEO optimization (meta tags, structured data)
