-- ============================================================
-- PAP_J Inc. — Seed data extracted from old HTML portfolio
-- Run in Supabase → SQL Editor after master-setup.sql
-- ============================================================

-- ── Profile ──────────────────────────────────────────────────

UPDATE profile SET
  full_name            = 'Albert Prah',
  display_name         = 'PAP_J Inc.',
  professional_title   = 'Founder & CEO, PAP_J Inc.',
  short_bio            = 'I am a passionate Software Developer specialising in Python, Django, and Artificial Intelligence. With expertise in backend development using Spring Boot and PostgreSQL, I also have experience in full-stack development. My skills extend to graphic design, making me a well-rounded technology professional. I founded PAP_J Inc. to build practical digital solutions for businesses and individuals.',
  hero_headline        = 'The Future is Exciting.',
  hero_description     = 'We build software, intelligent systems and digital products designed to solve real-world problems and help businesses grow.',
  biography            = 'I am Albert Prah, a Ghanaian software engineer, entrepreneur and technology enthusiast. I founded PAP_J Inc. to pursue practical technology solutions, develop digital products and help businesses turn their ideas into useful digital experiences. My approach is built around continuous learning, innovation and creating technology that solves real problems.',
  professional_journey = 'I began my journey at Fijai Senior High School (2019–2022) before pursuing a Bachelor of Technology in Software Engineering at Takoradi Technical University (2022–2026). Alongside my studies I worked as a Software Developer Intern at Essikado Hospital in Sekondi, gaining hands-on experience in database management, backend development and hospital management systems. I later served as Technical Lead at Brown Roofing and Construction while simultaneously growing my freelance software development practice — building and deploying web applications using Python (Django), Spring Boot, PostgreSQL and AI-related projects for clients.',
  professional_summary = 'Full Stack Developer and Python Programmer with experience in web development, AI, automation, and graphic design. Currently studying Software Engineering at Takoradi Technical University.',
  current_focus        = 'To build accessible, practical and innovative technology solutions that help people and businesses grow through PAP_J Inc.',
  career_goals         = 'To become a trusted technology company creating useful digital products and intelligent solutions for businesses in Ghana and beyond.',
  location             = 'Sekondi-Takoradi, Ghana',
  email                = 'albertprahpkjnr@gmail.com',
  phone                = '+233537370435',
  availability_status  = 'Open to new projects'
WHERE id = (SELECT id FROM profile LIMIT 1);

-- ── Skills ───────────────────────────────────────────────────

INSERT INTO skills (name, category, proficiency, sort_order, featured) VALUES
  -- Design skills
  ('Photoshop',          'Design',      'Expert',        1,  true),
  ('Figma',              'Design',      'Expert',        2,  true),
  ('Adobe XD',           'Design',      'Intermediate',  3,  false),
  ('Adobe Illustrator',  'Design',      'Intermediate',  4,  false),
  -- Development skills
  ('HTML',               'Frontend',    'Advanced',      5,  false),
  ('CSS',                'Frontend',    'Advanced',      6,  false),
  ('JavaScript',         'Frontend',    'Intermediate',  7,  true),
  ('Python',             'Backend',     'Expert',        8,  true),
  ('Django',             'Backend',     'Expert',        9,  true),
  ('Java',               'Backend',     'Intermediate',  10, false),
  ('Spring Boot',        'Backend',     'Intermediate',  11, true),
  ('PostgreSQL',         'Database',    'Advanced',      12, true),
  ('Artificial Intelligence', 'AI',     'Intermediate',  13, true),
  ('Graphic Design',     'Design',      'Expert',        14, true),
  ('Full Stack Development', 'General', 'Advanced',      15, true)
ON CONFLICT DO NOTHING;

-- ── Experience ───────────────────────────────────────────────

INSERT INTO experiences (
  job_title, organization, employment_type, location,
  start_date, end_date, is_current,
  description, responsibilities, achievements, technologies,
  sort_order
) VALUES
(
  'Software Developer Intern',
  'Essikado Hospital',
  'Internship',
  'Sekondi, Ghana',
  '2022-01-01', '2024-01-01', false,
  'Assisted in software development and troubleshooting tasks within the hospital IT department.',
  ARRAY[
    'Assisted in software development and troubleshooting tasks within the hospital IT department',
    'Gained hands-on experience with database management and backend development',
    'Provided technical support for hospital management systems and digital record-keeping',
    'Developed problem-solving skills by analysing and resolving system issues'
  ],
  ARRAY[
    'Improved hospital digital record-keeping system reliability',
    'Rated 4.90/5 for performance'
  ],
  ARRAY['Python', 'PostgreSQL', 'Database Management'],
  1
),
(
  'Technical Lead',
  'Brown Roofing and Construction',
  'Full-time',
  'Ghana',
  '2025-01-01', NULL, true,
  'Established a modern roofing and construction business, managing digital presence and operations.',
  ARRAY[
    'Established a modern roofing and construction business offering innovative roofing solutions',
    'Developed the company digital presence and managed business operations',
    'Provided consultation and training on roofing installation and material selection',
    'Led a team in executing high-quality roofing projects for residential and commercial clients'
  ],
  ARRAY[
    'Successfully launched company digital presence',
    'Led multiple residential and commercial roofing projects'
  ],
  ARRAY['Web Development', 'Business Management'],
  2
),
(
  'Freelance Software Developer',
  'Self-Employed',
  'Freelance',
  'Remote',
  '2022-01-01', NULL, true,
  'Building and deploying web applications and AI solutions for clients locally and internationally.',
  ARRAY[
    'Built and deployed web applications using Python (Django), Spring Boot, and PostgreSQL',
    'Worked on AI-related projects and automation solutions',
    'Designed and developed full-stack solutions for various clients',
    'Maintained and improved existing software systems for businesses'
  ],
  ARRAY[
    'Delivered projects including a corporate website for a musical band',
    'Built a travel and tour website',
    'Developed a company admin dashboard',
    'Created an IT company portfolio'
  ],
  ARRAY['Python', 'Django', 'Spring Boot', 'PostgreSQL', 'JavaScript', 'HTML', 'CSS', 'AI'],
  3
)
ON CONFLICT DO NOTHING;

-- ── Education ────────────────────────────────────────────────

INSERT INTO education (
  institution, degree, program,
  start_date, end_date, is_current,
  description, featured, sort_order
) VALUES
(
  'Takoradi Technical University',
  'Bachelor of Technology',
  'Software Engineering',
  '2022-09-01', '2026-07-01', true,
  'Pursuing a Bachelor of Technology in Software Engineering. GPA: 4.3/5.',
  true, 1
),
(
  'Fijai Senior High School',
  'Senior High School Certificate',
  'General Science',
  '2019-09-01', '2022-07-01', false,
  'Completed Senior High School education. GPA: 4.5/5.',
  false, 2
)
ON CONFLICT DO NOTHING;

-- ── Projects (from portfolio section) ────────────────────────

INSERT INTO projects (
  title, slug, category, short_description,
  live_url, published, featured, sort_order
) VALUES
(
  'Corporate Website for a Musical Band',
  'nothing-late-band',
  'Web Development',
  'A full corporate website built for a musical band, showcasing their music, events and booking information.',
  'https://nothinglateband.netlify.app/',
  true, true, 1
),
(
  'Personal Portfolio Website',
  'personal-portfolio',
  'Web Development',
  'A personal portfolio website showcasing skills, projects and professional experience.',
  NULL,
  true, false, 2
),
(
  'Company Admin Dashboard',
  'company-admin-dashboard',
  'Web Application',
  'A full-featured admin dashboard built for a company to manage operations and data.',
  NULL,
  true, true, 3
),
(
  'IT Company Portfolio',
  'it-company-portfolio',
  'Web Development',
  'A professional portfolio website for an IT company, highlighting their services and case studies.',
  NULL,
  true, false, 4
),
(
  'Travel and Tour Website',
  'travel-tour-website',
  'Web Development',
  'A visually appealing travel and tour website designed to attract and convert visitors into bookings.',
  NULL,
  true, true, 5
),
(
  'Travel Services Design (Figma)',
  'travel-services-figma-design',
  'UI/UX Design',
  'A comprehensive Figma design for a travel services platform, covering user flows and visual design.',
  NULL,
  true, false, 6
)
ON CONFLICT (slug) DO NOTHING;

-- ── Services (from pricing section) ──────────────────────────

INSERT INTO services (
  name, short_description, full_description,
  starting_price, currency, is_active,
  features, sort_order
) VALUES
(
  'Static Website',
  'A professionally designed static website — fast, responsive and ready to launch.',
  'Perfect for personal portfolios, landing pages and simple business websites. Built with modern HTML, CSS and JavaScript with full responsive design.',
  100, 'USD', true,
  ARRAY[
    'Single or multi-page layout',
    'Responsive design for all devices',
    'Design customisation',
    'Content upload',
    'Up to 2 plugins or integrations',
    '3-day delivery',
    'Unlimited revisions'
  ],
  1
),
(
  'Standard Web Application',
  'A dynamic, database-driven web application with backend functionality and admin panel.',
  'Ideal for businesses that need more than a static site — includes user authentication, database integration, and an admin dashboard.',
  250, 'USD', true,
  ARRAY[
    'Multi-page dynamic application',
    'Backend with Python (Django) or Spring Boot',
    'Database design and integration',
    'Admin dashboard',
    'Responsive design',
    'Up to 8 integrations',
    '5-day delivery',
    'Unlimited revisions'
  ],
  2
),
(
  'Premium Full Stack Solution',
  'A complete, production-ready full stack application with AI features, custom APIs and advanced functionality.',
  'For businesses that need a complete digital solution — from UI design in Figma to a fully deployed, scalable application with AI and automation capabilities.',
  500, 'USD', true,
  ARRAY[
    'Full stack web application',
    'AI and automation integration',
    'Custom REST API development',
    'Database design and optimisation',
    'UI/UX design in Figma or Adobe XD',
    'Deployment and hosting setup',
    'Unlimited plugins and integrations',
    '7-day delivery',
    'Unlimited revisions',
    'Post-launch support'
  ],
  3
)
ON CONFLICT DO NOTHING;

-- ── Social links ─────────────────────────────────────────────

INSERT INTO social_links (platform, url, is_active, sort_order) VALUES
  ('Email',     'mailto:albertprahpkjnr@gmail.com',                    true, 1),
  ('LinkedIn',  'https://www.linkedin.com/in/albert-prah-8aba37339/',  true, 2),
  ('Instagram', 'https://www.instagram.com/worlrichpap_J',             true, 3)
ON CONFLICT DO NOTHING;

-- ── Reload schema cache ──────────────────────────────────────
NOTIFY pgrst, 'reload schema';

-- ── Confirm ──────────────────────────────────────────────────
SELECT
  (SELECT full_name FROM profile LIMIT 1)     AS name,
  (SELECT COUNT(*) FROM skills)               AS skills,
  (SELECT COUNT(*) FROM experiences)          AS experience,
  (SELECT COUNT(*) FROM education)            AS education,
  (SELECT COUNT(*) FROM projects)             AS projects,
  (SELECT COUNT(*) FROM services)             AS services,
  (SELECT COUNT(*) FROM social_links)         AS social_links;
