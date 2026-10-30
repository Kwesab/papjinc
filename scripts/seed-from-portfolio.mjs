/**
 * Seed script — populates Albert's Supabase database from his original portfolio.
 * Run with:  node scripts/seed-from-portfolio.mjs
 */

const SUPABASE_URL = "https://gfxsqywvjxcrmxfdsqfg.supabase.co";
const SUPABASE_KEY = "sb_publishable_ns_rafzJxgFqbU_X4ojwEQ_-r2lHjQR";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Prefer": "resolution=merge-duplicates",
};

async function upsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, "Prefer": "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌  ${table}:`, text);
  } else {
    console.log(`✅  ${table} — ${rows.length} row(s)`);
  }
}

async function patch(table, match, data) {
  const params = new URLSearchParams(match).toString();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: "PATCH",
    headers: { ...headers, "Prefer": "return=minimal" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌  PATCH ${table}:`, text);
  } else {
    console.log(`✅  PATCH ${table}`);
  }
}

async function run() {
  console.log("Seeding Albert Prah portfolio data…\n");

  // ── Profile ────────────────────────────────────────────────────────
  // Try to update the existing profile row first (there should be exactly one)
  await patch("profile", {}, {
    full_name: "Albert Prah",
    display_name: "PAP_J",
    professional_title: "Full Stack Developer & Python Programmer",
    short_bio: "A passionate Software Developer specialising in Python, Django, and Artificial Intelligence. With expertise in backend development using Spring Boot and PostgreSQL, I also have experience in full-stack development. My skills extend to graphic design, making me a well-rounded tech professional.",
    hero_headline: "Building practical digital solutions.",
    hero_description: "I specialise in Python, Django, Spring Boot and AI-assisted systems. From backend APIs to polished UIs and graphic design — I ship end-to-end.",
    location: "Sekondi–Essikado, Ghana",
    email: "albertprahpkjnr@gmail.com",
    phone: "+233537370435",
    availability_status: "Available for freelance",
    professional_summary: "Full Stack Developer and Python Programmer based in Sekondi–Essikado, Ghana. Specialising in Python/Django, Spring Boot, PostgreSQL and AI tooling. Experienced in graphic design (Photoshop, Figma, Adobe XD, Illustrator). Available for freelance and contract work.",
    biography: "Albert Prah (PAP_J) is a Software Developer and Graphic Designer based in Sekondi–Essikado, Ghana. He is pursuing a Bachelor of Technology in Software Engineering at Takoradi Technical University (2022–2026) while working as a Technical Lead at Brown Roofing and Construction and taking on freelance software projects.\n\nHe started his career with an internship at Essikado Hospital where he gained hands-on experience in backend development and database management. His technical toolkit spans Python, Django, Spring Boot, PostgreSQL, HTML, CSS and JavaScript, complemented by strong graphic design skills in Photoshop, Figma, Adobe XD and Illustrator.",
    current_focus: "Building web applications with Python/Django and Spring Boot, exploring AI-assisted development, and leading technology initiatives at Brown Roofing and Construction.",
    career_goals: "To grow into a senior software engineering role, contribute to impactful AI-driven products, and build scalable systems that solve real-world problems in Ghana and beyond.",
  });

  // ── Education ──────────────────────────────────────────────────────
  await upsert("education", [
    {
      institution: "Takoradi Technical University",
      degree: "Bachelor of Technology",
      program: "Software Engineering",
      start_date: "2022-09-01",
      end_date: "2026-07-01",
      is_current: true,
      description: "Studying software engineering with a focus on web development, databases and AI. Current GPA: 4.3/5.",
      featured: true,
      sort_order: 1,
    },
    {
      institution: "Fijai Senior High School",
      degree: "Senior High School Certificate",
      program: "General Science",
      start_date: "2019-09-01",
      end_date: "2022-07-01",
      is_current: false,
      description: "Completed senior high school with a grade of 4.5/5.",
      featured: false,
      sort_order: 2,
    },
  ]);

  // ── Experience ─────────────────────────────────────────────────────
  await upsert("experiences", [
    {
      job_title: "Technical Lead",
      organization: "Brown Roofing and Construction",
      location: "Ghana",
      employment_type: "Full-time",
      start_date: "2025-01-01",
      end_date: null,
      is_current: true,
      description: "Leading technology and digital initiatives at a modern roofing and construction company.",
      responsibilities: [
        "Established the company's digital presence and managed business operations",
        "Provided consultation and training on roofing installation and material selection",
        "Led a team in executing high-quality roofing projects for residential and commercial clients",
        "Developed and maintained internal management systems",
      ],
      achievements: [
        "Successfully launched the company's digital platform",
        "Streamlined operations through technology adoption",
      ],
      technologies: ["Web Development", "Project Management", "Business Systems"],
      sort_order: 1,
    },
    {
      job_title: "Freelance Software Developer",
      organization: "Self-Employed",
      location: "Remote",
      employment_type: "Freelance",
      start_date: "2022-01-01",
      end_date: null,
      is_current: true,
      description: "Building and deploying web applications and AI solutions for various clients.",
      responsibilities: [
        "Built and deployed web applications using Python (Django), Spring Boot and PostgreSQL",
        "Worked on AI-related projects and automation solutions",
        "Designed and developed full-stack solutions for various clients",
        "Maintained and improved existing software systems for businesses",
      ],
      achievements: [
        "Delivered 6+ client projects across web, backend and design",
        "Built a corporate website for nothinglateband.com",
      ],
      technologies: ["Python", "Django", "Spring Boot", "PostgreSQL", "JavaScript", "Figma"],
      sort_order: 2,
    },
    {
      job_title: "Software Developer Intern",
      organization: "Essikado Hospital",
      location: "Sekondi, Ghana",
      employment_type: "Internship",
      start_date: "2022-09-01",
      end_date: "2024-07-01",
      is_current: false,
      description: "Assisted in software development and IT support within the hospital's department.",
      responsibilities: [
        "Assisted in software development and troubleshooting tasks within the hospital's IT department",
        "Gained hands-on experience with database management and backend development",
        "Provided technical support for hospital management systems and digital record-keeping",
        "Developed problem-solving skills by analysing and resolving system issues",
      ],
      achievements: [
        "Improved hospital digital record system reliability",
        "Rated 4.9/5 by the department supervisor",
      ],
      technologies: ["Python", "PostgreSQL", "Database Management", "Backend Development"],
      sort_order: 3,
    },
  ]);

  // ── Skills ─────────────────────────────────────────────────────────
  await upsert("skills", [
    // Design
    { name: "Photoshop", category: "Design", proficiency: "Expert", years_experience: 3, featured: true, sort_order: 1 },
    { name: "Figma", category: "Design", proficiency: "Advanced", years_experience: 2, featured: true, sort_order: 2 },
    { name: "Adobe XD", category: "Design", proficiency: "Intermediate", years_experience: 1, sort_order: 3 },
    { name: "Adobe Illustrator", category: "Design", proficiency: "Proficient", years_experience: 2, sort_order: 4 },
    { name: "UI/UX Design", category: "Design", proficiency: "Advanced", years_experience: 2, featured: true, sort_order: 5 },
    // Development
    { name: "Python", category: "Development", proficiency: "Expert", years_experience: 3, featured: true, sort_order: 6 },
    { name: "Django", category: "Development", proficiency: "Advanced", years_experience: 2, featured: true, sort_order: 7 },
    { name: "Spring Boot", category: "Development", proficiency: "Proficient", years_experience: 1, featured: true, sort_order: 8 },
    { name: "PostgreSQL", category: "Development", proficiency: "Advanced", years_experience: 2, sort_order: 9 },
    { name: "JavaScript", category: "Development", proficiency: "Proficient", years_experience: 2, sort_order: 10 },
    { name: "HTML", category: "Development", proficiency: "Advanced", years_experience: 3, sort_order: 11 },
    { name: "CSS", category: "Development", proficiency: "Advanced", years_experience: 3, sort_order: 12 },
    { name: "Java", category: "Development", proficiency: "Proficient", years_experience: 1, sort_order: 13 },
    // AI & Data
    { name: "Artificial Intelligence", category: "AI & Data", proficiency: "Intermediate", years_experience: 1, featured: true, sort_order: 14 },
    { name: "Machine Learning", category: "AI & Data", proficiency: "Beginner", years_experience: 1, sort_order: 15 },
  ]);

  // ── Projects ───────────────────────────────────────────────────────
  await upsert("projects", [
    {
      title: "nothinglateband.com",
      slug: "nothinglateband",
      category: "Web Development",
      short_description: "A corporate website for a musical band, featuring discography, events and booking.",
      full_description: "Designed and developed a professional corporate website for a musical band. The site showcases their music, upcoming events, band members and provides a booking/contact system.",
      technologies: ["HTML", "CSS", "JavaScript", "Django"],
      features: ["Responsive design", "Event listings", "Music showcase", "Contact and booking form"],
      published: true,
      featured: true,
      sort_order: 1,
    },
    {
      title: "Personal Portfolio",
      slug: "personal-portfolio",
      category: "Web Development",
      short_description: "My personal portfolio website showcasing projects, skills and experience.",
      full_description: "Built my personal portfolio from scratch to showcase my work, skills and experience to potential clients and employers.",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Responsive layout", "Project showcase", "Resume section", "Contact form"],
      published: true,
      featured: true,
      sort_order: 2,
    },
    {
      title: "Company Admin Dashboard",
      slug: "company-admin-dashboard",
      category: "Web Development",
      short_description: "A full-featured admin dashboard for company management and operations.",
      full_description: "Developed a comprehensive admin dashboard for internal company use, enabling management of operations, reports and data visualisation.",
      technologies: ["Python", "Django", "PostgreSQL", "JavaScript"],
      features: ["Data visualisation", "User management", "Reporting", "Responsive UI"],
      published: true,
      featured: false,
      sort_order: 3,
    },
    {
      title: "IT Company Portfolio",
      slug: "it-company-portfolio",
      category: "Web Development",
      short_description: "A professional portfolio website for an IT organisation.",
      full_description: "Designed and developed a clean, professional portfolio site for an IT company to showcase their services and team.",
      technologies: ["HTML", "CSS", "JavaScript", "Figma"],
      features: ["Service showcase", "Team section", "Contact form", "Responsive design"],
      published: true,
      featured: false,
      sort_order: 4,
    },
    {
      title: "Travel and Tour Website",
      slug: "travel-tour-website",
      category: "Web Development",
      short_description: "A travel and tour booking website with destination listings and enquiry forms.",
      full_description: "Built a fully responsive travel and tour website for a travel agency, featuring destination listings, tour packages and an enquiry system.",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Destination listings", "Tour packages", "Enquiry forms", "Gallery"],
      published: true,
      featured: false,
      sort_order: 5,
    },
    {
      title: "Travel Services UI Design",
      slug: "travel-services-ui-design",
      category: "UI/UX Design",
      short_description: "A Figma UI/UX design for a travel services platform.",
      full_description: "Created a comprehensive UI/UX design for a travel services platform in Figma, covering user flows, wireframes and high-fidelity mockups.",
      technologies: ["Figma", "Adobe XD", "UI/UX Design"],
      features: ["User flow diagrams", "Wireframes", "High-fidelity mockups", "Design system"],
      published: true,
      featured: true,
      sort_order: 6,
    },
  ]);

  // ── Services / Pricing ─────────────────────────────────────────────
  await upsert("services", [
    {
      name: "Static Portfolio Website",
      short_description: "A clean, responsive static portfolio website built with Elementor — perfect for showcasing your work and personal brand.",
      starting_price: 100,
      currency: "USD",
      is_active: true,
      features: [
        "Single page with Elementor",
        "Design customisation",
        "Responsive design",
        "Content upload",
        "2 plugins/extensions",
        "3 days delivery",
        "Unlimited revisions",
      ],
      sort_order: 1,
    },
    {
      name: "Standard Portfolio Website",
      short_description: "A multi-page portfolio with Figma design integration, more plugins and extended support.",
      starting_price: 250,
      currency: "USD",
      is_active: true,
      features: [
        "Multi-page Elementor build",
        "Figma design included",
        "Design maintenance",
        "Content upload",
        "Design with Adobe XD",
        "8 plugins/extensions",
        "5 days delivery",
        "Unlimited revisions",
      ],
      sort_order: 2,
    },
    {
      name: "Premium Portfolio Website",
      short_description: "The full package — custom premium build with advanced design, maximum plugins and priority delivery.",
      starting_price: 500,
      currency: "USD",
      is_active: true,
      features: [
        "Multi-page Elementor premium build",
        "Full Figma design system",
        "Design maintenance included",
        "Full content upload",
        "Adobe XD prototyping",
        "8+ plugins/extensions",
        "7 days delivery",
        "Unlimited revisions",
        "Priority support",
      ],
      sort_order: 3,
    },
  ]);

  // ── Social Links ───────────────────────────────────────────────────
  await upsert("social_links", [
    {
      platform: "Email",
      url: "mailto:albertprahpkjnr@gmail.com",
      is_active: true,
      sort_order: 1,
    },
    {
      platform: "Phone",
      url: "tel:+233537370435",
      is_active: true,
      sort_order: 2,
    },
  ]);

  console.log("\n🎉  Seed complete! Refresh http://localhost:8080 to see your data.\n");
  console.log("Next steps:");
  console.log("  1. Upload a profile photo from Admin → Profile");
  console.log("  2. Add project screenshots from Admin → Projects");
  console.log("  3. Add your GitHub, LinkedIn, Twitter links from Admin → Social links");
  console.log("  4. Set your availability from Admin → Resources → Availability");
}

run().catch((e) => { console.error(e); process.exit(1); });
