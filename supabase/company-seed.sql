-- ============================================================
-- PAP_J Inc. — Company identity seed
-- Run in Supabase → SQL Editor after running schema.sql
-- Update the values below to match your actual details
-- ============================================================

UPDATE profile SET
  display_name         = 'PAP_J Inc.',
  full_name            = 'Albert Prah',
  professional_title   = 'Founder & CEO, PAP_J Inc.',
  short_bio            = 'I am Albert Prah, a Ghanaian software engineer, entrepreneur and technology enthusiast. I founded PAP_J Inc. to pursue practical technology solutions, develop digital products and help businesses turn their ideas into useful digital experiences.',
  hero_headline        = 'The Future is Exciting.',
  hero_description     = 'We build software, intelligent systems and digital products designed to solve real-world problems and help businesses grow.',
  biography            = 'PAP_J Inc. is a technology company focused on developing practical digital solutions, intelligent software and digital products that help individuals, businesses and organisations solve problems, improve operations and explore new opportunities through technology.',
  professional_summary = 'We work with clients in Ghana and beyond, combining technical expertise with a deep understanding of real-world business challenges.',
  professional_journey = 'Our approach is built around continuous learning, innovation and creating technology that solves real problems. Whether building custom software for a client or developing our own digital products, we bring the same focus on quality and practical impact.',
  current_focus        = 'To build accessible, practical and innovative technology solutions that help people and businesses grow.',
  career_goals         = 'To become a trusted technology company creating useful digital products and intelligent solutions for a connected world.',
  location             = 'Sekondi-Takoradi, Ghana',
  availability_status  = 'Open to new projects'
WHERE id = (SELECT id FROM profile LIMIT 1);

-- Confirm the update
SELECT display_name, full_name, professional_title, location FROM profile;
