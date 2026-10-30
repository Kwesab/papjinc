/**
 * PASTE THIS INTO YOUR BROWSER CONSOLE WHILE ON http://localhost:8080/admin
 * You MUST be logged in as admin first.
 *
 * F12 → Console → paste → Enter
 */
(async () => {

const SUPA_URL = "https://tdvphgxwjomsfdmhaixz.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdnBoZ3h3am9tc2ZkbWhhaXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzY0OTksImV4cCI6MjEwMzk1MjQ5OX0.OWScX11w59zUBsa4eB6JkXTC3vTNGNLQsV2jGEJzXdQ";

// ── Grab the live auth token from the current admin session ──────────────
const SESSION_KEY = Object.keys(localStorage).find(k => k.includes("auth-token") || k.includes("supabase.auth"));
let ACCESS_TOKEN = null;
if (SESSION_KEY) {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY));
    ACCESS_TOKEN = parsed?.access_token ?? parsed?.session?.access_token ?? null;
  } catch {}
}
// Fallback: scan all localStorage keys for a JWT
if (!ACCESS_TOKEN) {
  for (const k of Object.keys(localStorage)) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      if (v?.access_token?.startsWith?.("ey")) { ACCESS_TOKEN = v.access_token; break; }
      if (v?.session?.access_token?.startsWith?.("ey")) { ACCESS_TOKEN = v.session.access_token; break; }
    } catch {}
  }
}
if (!ACCESS_TOKEN) {
  console.error("❌ No admin session found. Make sure you are logged into http://localhost:8080/admin first.");
  return;
}
console.log("%c✅ Auth token found", "color:#22c55e;font-weight:bold");

const H = {
  "Content-Type": "application/json",
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ACCESS_TOKEN}`,
};

async function req(method, table, body, prefer = "resolution=ignore-duplicates,return=minimal") {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method,
    headers: { ...H, "Prefer": prefer },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  if (!r.ok) { console.error(`❌ ${method} ${table}:`, txt); return false; }
  return true;
}

async function insert(table, rows) {
  // Normalise: ensure every row has identical keys (fill missing with null)
  const allKeys = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const normalised = rows.map(r => Object.fromEntries(allKeys.map(k => [k, r[k] ?? null])));
  const ok = await req("POST", table, normalised);
  if (ok) console.log(`%c✅ ${table} — ${rows.length} row(s)`, "color:#22c55e;font-weight:bold");
}

async function patchProfile(data) {
  const r = await fetch(`${SUPA_URL}/rest/v1/profile?select=id&limit=1`, { headers: H });
  const rows = await r.json();
  if (!rows?.length) {
    // No profile row yet — create one
    const ok = await req("POST", "profile", [data]);
    if (ok) console.log("%c✅ profile created", "color:#22c55e;font-weight:bold");
    return;
  }
  const id = rows[0].id;
  const ok = await req("PATCH", `profile?id=eq.${id}`, data);
  if (ok) console.log("%c✅ profile updated", "color:#22c55e;font-weight:bold");
}

// ── 1. Profile ─────────────────────────────────────────────────────────────
await patchProfile({
  full_name: "Albert Prah",
  display_name: "PAP_J",
  professional_title: "Full Stack Developer & Python Programmer",
  short_bio: "A passionate Software Developer specializing in Python, Django, and Artificial Intelligence. With expertise in backend development using Spring Boot and PostgreSQL, I also have full-stack and graphic design experience.",
  hero_headline: "Building practical digital solutions.",
  hero_description: "I specialise in Python, Django, Spring Boot and AI-assisted systems. From backend APIs to polished UIs and graphic design — I ship end-to-end.",
  location: "Sekondi–Essikado, Ghana",
  email: "albertprahpkjnr@gmail.com",
  phone: "+233537370435",
  availability_status: "Available for freelance",
  professional_summary: "Full Stack Developer and Python Programmer based in Sekondi–Essikado, Ghana. Specialising in Python/Django, Spring Boot, PostgreSQL and AI tooling. Experienced in Photoshop, Figma, Adobe XD and Illustrator. Available for freelance work.",
  biography: "Albert Prah (PAP_J) is a Software Developer and Graphic Designer based in Sekondi–Essikado, Ghana. Pursuing a Bachelor of Technology in Software Engineering at Takoradi Technical University (2022–2026), while working as Technical Lead at Brown Roofing and Construction.\n\nHe started his career with an internship at Essikado Hospital gaining hands-on backend and database experience. His stack spans Python, Django, Spring Boot, PostgreSQL, HTML, CSS, JavaScript — complemented by Photoshop, Figma, Adobe XD and Illustrator.",
  current_focus: "Building web applications with Python/Django and Spring Boot, exploring AI-assisted development, and leading technology at Brown Roofing and Construction.",
  career_goals: "To grow into a senior software engineering role, contribute to AI-driven products, and build scalable systems that solve real-world problems in Ghana and beyond.",
});

// ── 2. Education ───────────────────────────────────────────────────────────
await insert("education", [
  { institution:"Takoradi Technical University", degree:"Bachelor of Technology", program:"Software Engineering", start_date:"2022-09-01", end_date:"2026-07-01", is_current:true,  description:"Studying software engineering with focus on web development, databases and AI. GPA: 4.3/5.", featured:true,  sort_order:1 },
  { institution:"Fijai Senior High School",       degree:"Senior High School Certificate", program:"General Science", start_date:"2019-09-01", end_date:"2022-07-01", is_current:false, description:"Completed senior high school. Grade: 4.5/5.",                                         featured:false, sort_order:2 },
]);

// ── 3. Experience ──────────────────────────────────────────────────────────
await insert("experiences", [
  {
    job_title:"Technical Lead", organization:"Brown Roofing and Construction",
    location:"Ghana", employment_type:"Full-time",
    start_date:"2025-01-01", end_date:null, is_current:true,
    description:"Leading technology and digital initiatives at a modern roofing and construction company.",
    responsibilities:["Established the company's digital presence and managed business operations","Provided consultation and training on roofing installation and material selection","Led a team executing high-quality roofing projects for residential and commercial clients","Developed and maintained internal management systems"],
    achievements:["Launched the company's digital platform","Streamlined operations through technology adoption"],
    technologies:["Web Development","Project Management","Business Systems"], sort_order:1,
  },
  {
    job_title:"Freelance Software Developer", organization:"Self-Employed",
    location:"Remote", employment_type:"Freelance",
    start_date:"2022-01-01", end_date:null, is_current:true,
    description:"Building and deploying web applications and AI solutions for various clients.",
    responsibilities:["Built web apps using Python (Django), Spring Boot and PostgreSQL","Worked on AI-related projects and automation solutions","Designed full-stack solutions for clients","Maintained and improved software systems for businesses"],
    achievements:["Delivered 6+ client projects across web, backend and design","Built nothinglateband.com corporate website"],
    technologies:["Python","Django","Spring Boot","PostgreSQL","JavaScript","Figma"], sort_order:2,
  },
  {
    job_title:"Software Developer Intern", organization:"Essikado Hospital",
    location:"Sekondi, Ghana", employment_type:"Internship",
    start_date:"2022-09-01", end_date:"2024-07-01", is_current:false,
    description:"Assisted in software development and IT support within the hospital's IT department.",
    responsibilities:["Assisted in software development and troubleshooting in the IT department","Gained hands-on experience with database management and backend development","Provided technical support for hospital management systems and digital record-keeping","Developed problem-solving skills by analysing and resolving system issues"],
    achievements:["Improved hospital digital record system reliability","Rated 4.9/5 by department supervisor"],
    technologies:["Python","PostgreSQL","Database Management","Backend Development"], sort_order:3,
  },
]);

// ── 4. Skills ──────────────────────────────────────────────────────────────
await insert("skills", [
  { name:"Photoshop",          category:"Design",      proficiency:"Expert",       years_experience:3, featured:true,  sort_order:1  },
  { name:"Figma",              category:"Design",      proficiency:"Expert",       years_experience:2, featured:true,  sort_order:2  },
  { name:"Adobe XD",           category:"Design",      proficiency:"Intermediate", years_experience:1, featured:false, sort_order:3  },
  { name:"Adobe Illustrator",  category:"Design",      proficiency:"Proficient",   years_experience:2, featured:false, sort_order:4  },
  { name:"UI/UX Design",       category:"Design",      proficiency:"Advanced",     years_experience:2, featured:true,  sort_order:5  },
  { name:"Python",             category:"Development", proficiency:"Expert",       years_experience:3, featured:true,  sort_order:6  },
  { name:"Django",             category:"Development", proficiency:"Advanced",     years_experience:2, featured:true,  sort_order:7  },
  { name:"Spring Boot",        category:"Development", proficiency:"Proficient",   years_experience:1, featured:true,  sort_order:8  },
  { name:"PostgreSQL",         category:"Development", proficiency:"Advanced",     years_experience:2, featured:false, sort_order:9  },
  { name:"JavaScript",         category:"Development", proficiency:"Proficient",   years_experience:2, featured:true,  sort_order:10 },
  { name:"HTML",               category:"Development", proficiency:"Advanced",     years_experience:3, featured:false, sort_order:11 },
  { name:"CSS",                category:"Development", proficiency:"Advanced",     years_experience:3, featured:false, sort_order:12 },
  { name:"Java",               category:"Development", proficiency:"Proficient",   years_experience:1, featured:false, sort_order:13 },
  { name:"Artificial Intelligence", category:"AI & Data", proficiency:"Intermediate", years_experience:1, featured:true, sort_order:14 },
]);

// ── 5. Projects ────────────────────────────────────────────────────────────
await insert("projects", [
  { title:"nothinglateband.com",     slug:"nothinglateband",           category:"Web Development", short_description:"A corporate website for a musical band.",                       full_description:"Designed and developed a professional corporate website — music showcase, events and booking.",                                  technologies:["HTML","CSS","JavaScript","Django"], features:["Responsive design","Event listings","Music showcase","Contact form"], live_url:"https://nothinglateband.netlify.app/", github_url:null, published:true, featured:true,  sort_order:1 },
  { title:"Personal Portfolio",      slug:"personal-portfolio-v1",     category:"Web Development", short_description:"My original personal portfolio website.",                       full_description:"Built my personal portfolio from scratch to showcase work, skills and experience.",                                              technologies:["HTML","CSS","JavaScript"],          features:["Responsive layout","Project showcase","Resume section","Contact form"],                               live_url:null, github_url:null, published:true, featured:true,  sort_order:2 },
  { title:"Company Admin Dashboard", slug:"company-admin-dashboard",   category:"Web Development", short_description:"A full-featured admin dashboard for company management.",       full_description:"Comprehensive admin dashboard for operations management, reports and data visualisation.",                                    technologies:["Python","Django","PostgreSQL","JavaScript"], features:["Data visualisation","User management","Reporting","Responsive UI"],                                live_url:null, github_url:null, published:true, featured:false, sort_order:3 },
  { title:"IT Company Portfolio",    slug:"it-company-portfolio",      category:"Web Development", short_description:"A professional portfolio website for an IT organisation.",      full_description:"Clean, professional portfolio site for an IT company showcasing services and team.",                                           technologies:["HTML","CSS","JavaScript","Figma"],  features:["Service showcase","Team section","Contact form","Responsive design"],                                live_url:null, github_url:null, published:true, featured:false, sort_order:4 },
  { title:"Travel and Tour Website", slug:"travel-tour-website",       category:"Web Development", short_description:"A travel and tour booking website with destination listings.",  full_description:"Fully responsive travel website featuring destination listings, packages and enquiry system.",                               technologies:["HTML","CSS","JavaScript"],          features:["Destination listings","Tour packages","Enquiry forms","Gallery"],                                    live_url:null, github_url:null, published:true, featured:false, sort_order:5 },
  { title:"Travel Services UI",      slug:"travel-services-ui-design", category:"UI/UX Design",   short_description:"A Figma UI/UX design for a travel services platform.",          full_description:"Comprehensive UI/UX design covering user flows, wireframes and high-fidelity mockups for a travel services platform.",       technologies:["Figma","Adobe XD"],                features:["User flows","Wireframes","High-fidelity mockups","Design system"],                                    live_url:null, github_url:null, published:true, featured:true,  sort_order:6 },
]);

// ── 6. Services ────────────────────────────────────────────────────────────
await insert("services", [
  { name:"Static Portfolio Website",   short_description:"Clean responsive static portfolio built with Elementor.",               full_description:null, starting_price:100, currency:"USD", is_active:true, features:["Single page with Elementor","Design customisation","Responsive design","Content upload","2 plugins/extensions","3 days delivery","Unlimited revisions"],                                        sort_order:1 },
  { name:"Standard Portfolio Website", short_description:"Multi-page portfolio with Figma design and extended support.",          full_description:null, starting_price:250, currency:"USD", is_active:true, features:["Multi-page Elementor build","Figma design included","Design maintenance","Content upload","Adobe XD design","8 plugins/extensions","5 days delivery","Unlimited revisions"],                    sort_order:2 },
  { name:"Premium Portfolio Website",  short_description:"Full premium build — advanced design, max plugins, priority delivery.", full_description:null, starting_price:500, currency:"USD", is_active:true, features:["Multi-page Elementor premium build","Full Figma design system","Design maintenance","Full content upload","Adobe XD prototyping","8+ plugins/extensions","7 days delivery","Unlimited revisions","Priority support"], sort_order:3 },
]);

// ── 7. Social links ────────────────────────────────────────────────────────
await insert("social_links", [
  { platform:"LinkedIn",  url:"https://www.linkedin.com/in/albert-prah-8aba37339/", is_active:true, icon:null, sort_order:1 },
  { platform:"Instagram", url:"https://www.instagram.com/worlrichpap_J",             is_active:true, icon:null, sort_order:2 },
  { platform:"Email",     url:"mailto:albertprahpkjnr@gmail.com",                    is_active:true, icon:null, sort_order:3 },
  { platform:"WhatsApp",  url:"https://wa.me/233537370435",                          is_active:true, icon:null, sort_order:4 },
]);

console.log("%c\n🎉 Done! Press Cmd+Shift+R to hard-refresh and see your data.", "color:#d97706;font-size:15px;font-weight:bold");

})();
