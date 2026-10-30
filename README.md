# Albert Portofolio

Build: Albert Prah — Full-Stack Personal Portfolio, Career CMS & Digital Marketplace

1. PROJECT OVERVIEW

Build a production-quality full-stack personal portfolio and professional platform for Albert Prah, a Ghanaian Software Engineer based in Sekondi–Essikado, Ghana.

This must NOT be a simple static portfolio.

Build it as a complete full-stack application with:

Public professional portfolio

Secure admin dashboard/CMS

Project management system

Certificate management

Education management

Experience management

Skills management

Achievements management

Personal information management

CV/resume generator

Consultation booking system

Digital/source-code marketplace

Secure digital downloads after payment

Payment integration architecture

Contact/inquiry management

Analytics/dashboard

Responsive design

SEO support

Dark/light theme

Content that can be changed completely from the admin dashboard

The application should be designed so Albert can manage his professional identity and business without modifying source code.



2. CORE REQUIREMENT

The most important principle is:

Almost all public-facing content must come from the database and be editable from the admin dashboard.

Do NOT hardcode Albert’s:

Bio

Skills

Education

Experience

Projects

Certificates

Achievements

Services

Social links

Contact information

CV information

Store products

into frontend components.

The admin dashboard must control these.



3. TECHNOLOGY

Use a modern production-ready stack compatible with Lovable.

Preferred:

Frontend

React

TypeScript

Tailwind CSS

shadcn/ui

Responsive design

Backend / Database

Use Lovable’s supported backend/database architecture, preferably Supabase if appropriate.

Use:

PostgreSQL

Supabase Auth

Supabase Storage

Row Level Security

Database migrations

Server-side functions where required

Use secure server-side logic for sensitive operations.

Payments

Design the payment system around Paystack, using environment variables for:

Secret key

Public key

Webhook secret

Never expose secret keys in frontend code.

If direct Paystack integration cannot be fully configured automatically, build the complete integration architecture and clearly isolate the configuration required in environment variables.



4. BRAND

Name:

Albert Prah

Professional title:

Software Engineer

Location:

Sekondi–Essikado, Ghana

Education:

Bachelor’s Degree in Software Engineering — Takoradi Technical University — 2026

Previous education:

Fijai Senior High School — 2019–2022 — WASSCE

NAV-WEST JHS — 2017–2019

The design should feel:

Professional

Modern

Premium

Developer-focused

Clean

Minimal

Trustworthy

Suitable for international remote-job applications

Suitable for clients

Suitable for recruiters

Do not make it look like a generic template.



5. PUBLIC WEBSITE

Create these major sections/routes.

Home

Hero section:

Albert Prah

Software Engineer building practical digital solutions.

Include:

Short introduction

Profile image

View Projects button

Download CV button

Book a Consultation button

Contact button

Include subtle modern animations.

Do not overuse animations.



6. ABOUT PAGE

Display:

Profile photo

Biography

Professional journey

Current focus

Career goals

Location

Social links

The content must be editable from Admin.



7. EDUCATION PAGE

Display education chronologically.

Initial records:

NAV-WEST

JHS
2017–2019

Fijai Senior High School

2019–2022
WASSCE

Takoradi Technical University

Bachelor’s Degree in Software Engineering
Completed in 2026

Each education record should support:

Institution

Program

Degree

Start date

End date

Description

Certificate

Institution logo

Featured status



8. EXPERIENCE PAGE

Create a professional experience timeline.

Each experience should support:

Organization

Job title

Employment type

Location

Start date

End date

Current position

Description

Responsibilities

Achievements

Technologies

Logo

Admin must be able to create, edit, reorder and delete experiences.



9. SKILLS PAGE

Create categorized skills.

Categories:

Programming Languages

Frontend

Backend

Databases

Cloud & Deployment

DevOps

AI

Tools

Other

Each skill:

Name

Category

Proficiency level

Years of experience

Icon

Display order

Featured status

The proficiency level should NOT create unrealistic percentage claims unless manually entered by the admin.



10. PROJECTS SYSTEM

Create a complete project CMS.

Public project page:

/projects

Allow visitors to:

Browse projects

Search projects

Filter by category

Filter by technology

Sort projects

View featured projects

Categories:

Full Stack

Backend

Frontend

Mobile

AI

APIs

Business Systems

Other

Project cards should show:

Thumbnail

Title

Short description

Technologies

Category

Featured badge

View Project



11. PROJECT DETAIL PAGE

Each project gets its own page.

Display:

Project title

Hero image

Gallery

Video/demo

Description

Problem

Solution

Features

Technologies

Architecture

Challenges

Results

Lessons learned

GitHub URL

Live demo URL

Documentation URL

Allow multiple:

Images

Screenshots

Videos

Admin can upload all media.

Project fields:

Title

Slug

Short description

Full description

Problem

Solution

Features

Challenges

Results

Technologies

Category

GitHub URL

Live URL

Documentation URL

Thumbnail

Gallery

Videos

Featured

Published

Publication date

Sort order



12. CERTIFICATE MANAGEMENT

Create a Certificates page.

Visitors can browse certificates.

Certificate fields:

Certificate title

Issuing organization

Issue date

Expiry date

Credential ID

Credential URL

Description

Certificate image

Certificate PDF

Category

Featured

Sort order

Allow admin to upload certificate images and PDFs.

Public visitors can:

View certificate

Open credential URL

View certificate document where appropriate



13. ACHIEVEMENTS

Create an achievements section.

Fields:

Title

Organization

Date

Description

Image

Link

Category

Examples can include hackathons, awards and other professional achievements.

Do not invent achievements.

Only display information entered by the admin.



14. SERVICES

Create a services CMS.

Potential categories:

Web Development

Full-Stack Development

Backend Development

API Development

Mobile Development

AI Integration

Database Development

Deployment

IT Consulting

Software Consulting

Each service:

Name

Short description

Full description

Icon

Starting price (optional)

Features

Active/inactive



15. CV GENERATOR

This is a major feature.

Create a CV system that uses the same database information used throughout the portfolio.

The admin enters information once.

The CV generator should pull:

Personal information

Professional summary

Education

Experience

Skills

Projects

Certifications

Achievements

Services if appropriate

Create professional CV templates.

Initial templates:

ATS Professional

Modern Professional

Minimal

The admin should be able to:

Select template

Preview CV

Generate PDF

Download PDF

Set default CV

Edit CV-specific summary

Control which projects appear

Control which skills appear

Control which experiences appear

The CV must be properly formatted for professional job applications.

Make the ATS template especially clean:

No excessive graphics

No unnecessary columns

Clear headings

Standard typography

Machine-readable structure



16. PUBLIC CV

Create:

/cv

Visitors can:

View Albert’s CV

Download CV as PDF

The CV download should always use the latest published/default CV.



17. CONSULTATION BOOKING SYSTEM

Create:

/consultation

Visitors can request a consultation.

Fields:

Full name

Email

WhatsApp/phone

Consultation type

Project/business name

Description

Preferred date

Preferred time

Additional notes

Consultation types should come from the Services system where possible.

Booking statuses:

Pending

Confirmed

Rescheduled

Completed

Cancelled

Admin dashboard must allow:

View booking

Confirm

Reschedule

Cancel

Complete

Add notes

Prevent obvious double-booking.

Create a configurable availability system so Albert can set:

Available days

Working hours

Time slots

Blackout dates



18. DIGITAL SOURCE CODE MARKETPLACE

Create:

/store

This is a digital product marketplace where Albert can sell source code.

Products can be:

Full-stack applications

Backend projects

Frontend projects

Mobile applications

APIs

Templates

Starter projects

Each product should have:

Product name

Slug

Short description

Full description

Price

Currency

Thumbnail

Gallery

Demo URL

GitHub URL if public

Technologies

Features

Requirements

Documentation

Version

License type

Downloadable ZIP/source file

Published status

Featured status



19. STORE PRODUCT PAGE

Display:

Product image

Title

Description

Technologies

Features

Demo

Screenshots

What’s included

Requirements

Version

License

Price

Buy Now

Do not expose the actual source-code ZIP publicly.



20. SOURCE CODE PURCHASE FLOW

Implement:

Product

→ Checkout

→ Customer enters details

→ Paystack payment

→ Payment verification

→ Order creation

→ Download permission

→ Secure download

The frontend must NOT determine whether payment succeeded.

The backend/server-side function must verify payment.

Only after successful verification should the order be marked:

PAID

Then create a secure download entitlement.



21. DIGITAL DOWNLOAD SECURITY

Never expose source-code files through public URLs.

Use private storage.

Implement secure download URLs/tokens.

The download process should:

Authenticate or identify customer

Verify order

Verify payment status

Verify product entitlement

Generate temporary signed URL

Allow download

Do not place source code inside the public assets directory.



22. ORDERS

Create order management.

Order fields:

Order ID

Customer name

Email

Phone

Product

Amount

Currency

Payment reference

Payment status

Order status

Created date

Download count

Last download date

Statuses:

Pending

Paid

Failed

Refunded

Cancelled

Admin can view orders.



23. LICENSE SYSTEM

Every source-code product should have a license type.

Examples:

Personal Use

Commercial Use

Single Project

Multiple Projects

Allow the admin to define license terms per product.

Display the license clearly before purchase.

Do not provide legal claims beyond what is configured by the admin.



24. ADMIN DASHBOARD

Create:

/admin

Secure authentication required.

Admin dashboard overview:

Total projects

Published projects

Certificates

CV downloads

Consultation requests

Store products

Orders

Revenue

Visitors if analytics are implemented

Use charts where useful.



25. ADMIN SIDEBAR

Sections:

Dashboard

Profile

Personal Information

Social Links

Professional Summary

Career

Education

Experience

Skills

Certifications

Achievements

Portfolio

Projects

Categories

Technologies

Services

Services

Availability

CV

CV Builder

Templates

Published CV

Consultations

Bookings

Availability

Store

Products

Orders

Customers

Licenses

Content

Blog/posts if enabled later

Settings

Site settings

SEO

Payment settings

Storage settings



26. PERSONAL INFORMATION CMS

Admin must be able to edit:

Full name

Display name

Professional title

Biography

Profile image

Location

Email

Phone

WhatsApp

LinkedIn

GitHub

Website

Other social accounts

Availability

Professional summary

Hero headline

Hero description

Changes should automatically update the public website.



27. MEDIA LIBRARY

Create a media library in Admin.

Allow upload and management of:

Profile photos

Project images

Screenshots

Certificate images

Certificate PDFs

Videos/thumbnails

Other portfolio assets

Show:

File name

File type

Size

Upload date

URL/reference

Delete option

Use secure storage policies.



28. SEO

Every important public page should support:

Page title

Meta description

Open Graph image

Canonical URL

Slug

Project pages should automatically generate SEO metadata from project information.

Certificate pages can also have metadata.

Store products should have SEO-friendly metadata.

Create sitemap and robots configuration where supported.



29. CONTACT SYSTEM

Create a contact form:

Name

Email

Phone

Subject

Message

Store submissions in the database.

Admin can:

View messages

Mark as read

Mark as replied

Archive

Protect the form from spam using appropriate rate limiting/validation.



30. ANALYTICS

Create basic internal analytics.

Track where appropriate:

Portfolio page views

Project views

CV downloads

Store product views

Purchases

Consultation requests

Do not collect unnecessary personal information.

Admin dashboard should show useful aggregated metrics.



31. DATABASE DESIGN

Create a normalized PostgreSQL schema.

At minimum consider tables:

profiles

social_links

education

experiences

skills

skill_categories

certifications

achievements

projects

project_images

project_videos

technologies

project_technologies

services

consultation_bookings

availability

cv_templates

cv_settings

store_products

product_images

product_files

licenses

orders

order_items

download_entitlements

contact_messages

media

site_settings

analytics_events

Use foreign keys and appropriate indexes.

Do not duplicate the same information unnecessarily.



32. SECURITY

Security is extremely important.

Implement:

Secure authentication

Admin-only authorization

Row Level Security

Input validation

Server-side payment verification

Private file storage

Signed download URLs

Rate limiting where appropriate

Secure environment variables

No secret keys in frontend

Protection against unauthorized admin access

Protection against unauthorized source-code downloads

The public website should only expose published/public content.

Draft projects and private admin information must never be publicly accessible.



33. RESPONSIVE DESIGN

The site must work beautifully on:

Mobile

Tablet

Laptop

Desktop

Mobile-first design.

The admin dashboard should also be responsive.



34. DESIGN SYSTEM

Use a premium developer portfolio aesthetic.

Design characteristics:

Clean typography

Strong hierarchy

Plenty of whitespace

Modern cards

Subtle gradients

Subtle shadows

Smooth hover states

Professional icons

Dark/light mode

Accessible contrast

Minimal but meaningful animations

Avoid:

Excessive glassmorphism

Excessive animations

Huge text everywhere

Generic template appearance

Too many colors

Fake statistics

Fake testimonials

Fake clients

Use placeholder content only where absolutely necessary and clearly mark it as editable.



35. INITIAL REAL DATA

Use these confirmed details:

Name:
Albert Prah

Location:
Sekondi–Essikado, Ghana

Education:

NAV-WEST
JHS
2017–2019

Fijai Senior High School
2019–2022
WASSCE

Takoradi Technical University
Bachelor’s Degree in Software Engineering
Completed 2026

Known professional/technical areas include:

Java

Spring Boot

Python

Django

JavaScript

TypeScript

React

Node.js

Express

PostgreSQL

MongoDB

Docker

REST APIs

AI integration

Cloud deployment

Git/GitHub

Only display skills that are actually confirmed by the admin data.

Known project examples may include:

PaceFast AI

InventoryAI

Subscription platform

Product Catalog

Restaurant ordering system

Other projects added through the Admin Dashboard

Do not invent project details.



36. ADMIN-FIRST CONTENT STRATEGY

The application should launch with enough real information to demonstrate the design, but all content must be editable.

If information is missing:

Leave it blank

Hide the section when appropriate

Provide an admin input for it

Never fabricate:

Employment

Clients

Revenue

Awards

Testimonials

Certifications

Job titles

Project statistics



37. FUTURE EXTENSIBILITY

Structure the application so future features can be added without rebuilding the entire system.

Potential future features:

Blog

Newsletter

YouTube integration

Social media links

Email notifications

WhatsApp notifications

Customer accounts

Product reviews

Coupons

Discount codes

Affiliate system

Multiple CV versions

Job application tracker

Resume tailoring

AI-assisted CV generation

AI project description generator

Consultation payments

Invoice generation

Client portal

Do not implement all future features now unless they are required for the MVP.

Build the architecture cleanly enough to support them later.



38. MVP PRIORITY

Build in this order:

Phase 1

Public portfolio

Admin authentication

Personal information CMS

Education

Experience

Skills

Certifications

Achievements

Phase 2

Project CMS

Media uploads

Project browsing

Project detail pages

Phase 3

CV generator

CV PDF generation

Public CV

Phase 4

Services

Consultation booking

Availability management

Phase 5

Source-code marketplace

Products

Paystack

Orders

Secure downloads

Licenses

Phase 6

Analytics

SEO

Performance

Security hardening

Final responsive polish



39. IMPORTANT IMPLEMENTATION RULE

Do not simply generate mock UI screens.

Build the actual application architecture.

Every important button should either:

perform a real action,

navigate to a real page,

submit real data,

or clearly show that a configuration step is required.

Do not create fake payment success screens.

Do not create fake database data as if it were real.

Do not expose private files.

Do not expose admin routes publicly.



40. FINAL USER EXPERIENCE

A recruiter should be able to visit the website and quickly understand:

Who Albert is → What he builds → What technologies he uses → What he has achieved → How to contact/hire him → Download his CV.

A potential client should be able to:

Browse projects → Understand Albert’s capabilities → Book a consultation.

A customer should be able to:

Browse source code → View demo → Purchase → Pay → Receive secure download.

Albert should be able to:

Log into Admin → Change his information → Add projects → Upload certificates → Update experience → Generate a new CV → Manage consultations → Upload products → Manage orders.

The final result should feel like a professional personal website combined with a lightweight CMS, career management platform, consultation system and digital-product store.

Build the UI, database schema, authentication, storage structure, server-side logic, routes, validation, RLS policies and reusable components required for this architecture.

Prioritize correctness, security, maintainability and scalability over unnecessary visual effects.



AI SYSTEM — ADMIN AI + CUSTOMER SUPPORT AI

Add two separate AI systems to the application.

⸻

1. ADMIN AI — “ALBERT AI”

Create an AI assistant inside the Admin Dashboard.

Purpose:

Allow Albert to provide rough/unstructured information and have AI transform it into structured, professional portfolio data.

The AI should NOT simply be a chatbot.

It must be able to understand the intent of information and map it to the correct database entity.

⸻

ADMIN AI INTERFACE

Create an Admin AI page:

/admin/ai

Interface:

Large input area

Placeholder:

“Tell Albert AI what you want to add or update…”

Example:

“I completed an attachment at Essikado Hospital where I provided IT support, helped staff troubleshoot computers and assisted with network issues.”

Buttons:

* Analyze

* Clear

⸻

AI INFORMATION CLASSIFICATION

The AI should determine whether the information relates to:

* Personal information

* Professional summary

* Education

* Experience

* Skills

* Certification

* Achievement

* Project

* Service

* Social links

* Career goal

* Other

If the AI cannot confidently determine the destination, ask the admin to select the destination.

⸻

AI STRUCTURED OUTPUT

For example, if the admin enters:

“I built an inventory system using Django, React and PostgreSQL. It helps businesses manage stock and uses AI to forecast future inventory requirements.”

AI should produce a structured draft:

Entity:

PROJECT

Title:

InventoryAI

Short Description:

AI-powered inventory management system…

Technologies:

Django

React

PostgreSQL

Features:

* Inventory management

* Stock tracking

* AI forecasting

Long Description:

…

⸻

REVIEW BEFORE SAVE

IMPORTANT:

AI MUST NEVER automatically overwrite existing profile information.

Every AI-generated database modification must first appear as a review screen.

Display:

AI Generated Draft

Field | Current Value | AI Suggestion

Allow:

* Accept

* Edit

* Reject

* Regenerate

Only save to the database after the admin explicitly clicks:

“Approve & Save”

⸻

AI PROJECT BUILDER

Allow the admin to describe a project naturally.

Example:

“I built a restaurant ordering system using React Native, Node.js and MongoDB…”

AI generates:

* Project title

* Slug

* Short description

* Full description

* Problem

* Solution

* Features

* Technologies

* Challenges

* Results

* Suggested project category

Do not invent technical features.

If information is missing, leave the field blank or mark it as needing input.

⸻

AI EXPERIENCE BUILDER

Allow rough experience descriptions.

AI should generate a structured experience draft:

* Organization

* Role

* Employment type

* Location

* Start date

* End date

* Description

* Responsibilities

* Achievements

* Technologies

Dates and factual information must never be fabricated.

⸻

AI EDUCATION BUILDER

Allow rough education information.

AI can structure:

* Institution

* Program

* Degree

* Start date

* End date

* Description

⸻

AI CERTIFICATE ASSISTANT

Allow the admin to upload a certificate image or PDF.

Use AI/OCR where supported to extract:

* Certificate name

* Issuing organization

* Recipient name

* Date

* Credential ID

* Credential URL if visible

Display extracted information for review.

Never automatically save extracted information without approval.

⸻

AI BIO WRITER

Allow the admin to provide rough notes.

Example:

“I am a software engineering graduate interested in backend development, AI and building businesses.”

AI can generate:

* Professional bio

* Short bio

* Portfolio bio

* LinkedIn-style bio

* Recruiter-focused summary

Provide multiple versions.

The admin chooses which version to save.

⸻

AI CV ASSISTANT

Allow the admin to provide a target job role.

Example:

“Junior Backend Developer”

AI can analyze Albert’s existing database information and suggest:

* Professional summary

* Relevant skills

* Relevant projects

* Relevant experience ordering

* CV wording improvements

IMPORTANT:

AI must only use information that exists in the database.

Never invent:

* Jobs

* Degrees

* Certifications

* Skills

* Years of experience

* Companies

* Achievements

The admin must approve all changes.

⸻

AI CONTENT ASSISTANT

Allow AI to create drafts for:

* LinkedIn posts

* Project announcements

* Portfolio articles

* YouTube descriptions

* Social captions

* Project case studies

The admin must manually approve and publish content.

⸻

2. PUBLIC CUSTOMER SUPPORT AI

Create a public AI assistant.

UI:

Floating chat button:

“Ask Albert AI”

The assistant should answer questions about:

* Albert

* Skills

* Education

* Experience

* Projects

* Services

* Certifications

* Consultation

* Source-code store

* Public contact information

The AI should use the application’s public database information as its knowledge source.

⸻

CUSTOMER AI KNOWLEDGE

The AI must only use published/public information.

It must NEVER access:

* Admin-only information

* Private notes

* Payment secrets

* Customer private data

* Source-code files

* Admin credentials

* Private files

* Unpublished projects

* Internal analytics

* Private financial information

⸻

CUSTOMER AI EXAMPLES

Visitor:

“What technologies does Albert use?”

AI:

Answer using Albert’s published skills.

Visitor:

“Can I book a consultation?”

AI:

Explain the consultation process and provide a booking link/button.

Visitor:

“Does Albert sell source code?”

AI:

Explain the source-code store and provide a link.

Visitor:

“Tell me about PaceFast AI.”

AI:

Use the published PaceFast AI project data.

⸻

CUSTOMER SUPPORT FALLBACK

If the AI does not know the answer:

“I don’t have enough information to answer that accurately. You can contact Albert directly or book a consultation.”

Provide:

* Contact button

* Consultation button

The AI must never fabricate information.

⸻

HUMAN HANDOFF

Allow customers to transition from AI support to:

* Contact form

* WhatsApp

* Consultation booking

Optionally store:

* Conversation ID

* Customer name/email if voluntarily provided

* Conversation timestamp

* Handoff reason

Do not store unnecessary personal information.

⸻

AI SECURITY

Use secure server-side AI calls.

Never expose AI API keys in frontend code.

Store API keys in environment variables/secrets.

Apply appropriate:

* Rate limiting

* Input validation

* Abuse prevention

* Request limits

Prevent prompt injection from allowing public users to access private database information.

⸻

AI DATABASE ACCESS

Do NOT give the AI unrestricted database access.

Create controlled server-side functions/tools.

Admin AI may access authorized admin data.

Customer AI may access only published public data.

Separate these permissions strictly.

⸻

AI CHANGE LOG

Create an AI activity log.

Store:

* AI action

* User/admin

* Entity affected

* Previous value

* Suggested value

* Approval status

* Timestamp

Statuses:

* Generated

* Approved

* Rejected

* Edited

This allows Albert to see what AI has suggested or changed.

⸻

ADMIN AI DASHBOARD WIDGET

On the Admin Dashboard show:

“AI Assistant”

Quick actions:

* Add Project with AI

* Add Experience with AI

* Add Certificate with AI

* Improve Bio

* Generate CV Summary

* Create Content

⸻

AI UX REQUIREMENTS

The AI interface should clearly distinguish:

AI suggestion

from

Saved information.

Use labels such as:

“AI Draft”

“Pending Approval”

“Saved”

Never make the admin think AI-generated content is already stored when it has not been approved.

⸻

AI ARCHITECTURE

Use server-side functions/API routes for AI requests.

Create reusable AI service functions such as:

* parsePortfolioInformation()

* generateProjectDraft()

* generateExperienceDraft()

* generateBio()

* generateCVSummary()

* extractCertificateData()

* generateContentDraft()

* customerSupportAnswer()

Keep the AI layer modular so the AI provider/model can be changed later.

Do not tightly couple the entire application to one AI provider.

⸻

FINAL AI PRINCIPLE

The AI should behave as:

“Albert’s professional assistant”

not:

“Albert’s autonomous administrator.”

It should help Albert work faster while keeping Albert in control of all factual information and important changes.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://albert-pro-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dfcee848-26c9-41e6-a065-2b2e85cd8367).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
