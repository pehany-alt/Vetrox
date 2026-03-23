# Vetrox PPF Website - PRD

## Original Problem Statement
Rebuild Vetrox PPF website (vetrox.com.au) with enquiry form that sends email to admin@vetrox.com. Australian paint protection film company website.

## User Requirements (Updated 23 March 2026)
1. ✅ Font similar to original (Orbitron - tech/automotive feel)
2. ✅ "10 Year Warranty" in a styled box
3. ✅ Image swaps:
   - Gloss Series: White Rolls-Royce (original colored series image)
   - Pro Satin Matte: User's uploaded grey satin car
   - Coloured Series: Red car (original pro satin matte image)
4. ✅ TOP-TPU colour chart from PDF for 'Colours' page (200+ colours)
5. ✅ Australian spelling throughout (colour, armour, authorised)
6. ✅ "We accept resellers" message on website
7. ✅ Gmail SMTP for email delivery (from rashaysharbour@gmail.com to admin@vetrox.com)
8. ✅ Updated enquiry form:
   - Fields: Name, Email, Phone, Company, Enquiry Type (dropdown), Message
   - Dropdown options: General Enquiry, Product Information, Request a Quote, Find an Installer, Become a Reseller, Warranty Claim
   - Removed radio buttons
9. ✅ Hero section padding fixed - "Premium Paint Protection Film" visible below navbar
10. ✅ SEO optimization for: PPF, car wrap, matte car, Australia, best quality, warranty, reseller

## Architecture
- **Frontend**: React.js with Tailwind CSS, react-helmet for SEO
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Email**: Gmail SMTP

## Core Pages
1. **Home** - Hero section, technology features, products preview, colours, resellers CTA, partners
2. **Products** - Gloss Series, Pro Satin Matte, Coloured Series (with swapped images)
3. **Colours** - TOP-TPU colour gallery with 200+ colours and product codes
4. **About** - Company story, stats, reseller info
5. **Contact** - Updated enquiry form with dropdown

## What's Been Implemented (23 March 2026)
- [x] Full website with Australian branding
- [x] Orbitron font for tech/automotive aesthetic
- [x] "10 Year Warranty" badge in styled box
- [x] Correct product images (swapped as requested)
- [x] TOP-TPU colour chart (200+ colours with codes)
- [x] Australian spelling (colour, armour, authorised)
- [x] Reseller sections on homepage, about, and contact pages
- [x] Gmail SMTP email integration - WORKING
- [x] Updated enquiry form with dropdown (6 options)
- [x] Hero section padding fixed
- [x] SEO meta tags added with react-helmet
- [x] Mobile responsive design
- [x] All navigation and pages working

## Email Configuration
- **From**: rashaysharbour@gmail.com (via Gmail SMTP)
- **To**: admin@vetrox.com
- **Status**: ✅ WORKING (tested successfully)

## API Endpoints
- `GET /api/` - Health check
- `GET /api/health` - Status
- `POST /api/enquiry` - Submit enquiry (sends email via Gmail)
- `GET /api/enquiries` - List all enquiries
- `GET /api/contact-info` - Contact information

## SEO Keywords Targeted
- PPF Australia
- Paint protection film
- Car wrap
- Matte car
- Wrap car
- Best PPF film
- PPF reseller
- 10 year warranty PPF
- Car wrap Australia

## Backlog (P1)
- [ ] Google Maps integration for location
- [ ] Customer testimonials section
- [ ] Image gallery/portfolio of installed vehicles
- [ ] Blog section for SEO content

## Next Tasks
1. Add more vehicle gallery images
2. Create testimonials section
3. Add structured data (JSON-LD) for better SEO
