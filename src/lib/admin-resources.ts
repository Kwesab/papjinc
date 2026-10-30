import type { TableName } from "@/lib/db";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "url"
  | "image"
  | "video"
  | "media";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  /** Hidden behind "More details" in the editor. */
  advanced?: boolean;
};

export type ResourceSpec = {
  slug: string;
  table: TableName;
  label: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  order: { column: string; ascending?: boolean }[];
  fields: FieldSpec[];
  readOnly?: boolean;
};

const sortField: FieldSpec = { name: "sort_order", label: "Sort order", type: "number", advanced: true };

export const RESOURCES: ResourceSpec[] = [
  {
    slug: "projects",
    table: "projects",
    label: "Projects",
    description: "Case studies on your projects page.",
    titleField: "title",
    subtitleField: "category",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL segment, e.g. my-project" },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "short_description", label: "Summary", type: "textarea" },
      { name: "thumbnail_url", label: "Cover image", type: "image" },
      { name: "live_url", label: "Live URL", type: "url" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "full_description", label: "Full description", type: "textarea", advanced: true },
      { name: "problem", label: "Problem", type: "textarea", advanced: true },
      { name: "solution", label: "Solution", type: "textarea", advanced: true },
      { name: "features", label: "Features", type: "array", advanced: true },
      { name: "technologies", label: "Technologies", type: "array", advanced: true },
      { name: "challenges", label: "Challenges", type: "textarea", advanced: true },
      { name: "results", label: "Results", type: "textarea", advanced: true },
      { name: "lessons_learned", label: "Lessons learned", type: "textarea", advanced: true },
      { name: "architecture", label: "Architecture", type: "textarea", advanced: true },
      { name: "github_url", label: "GitHub URL", type: "url", advanced: true },
      { name: "documentation_url", label: "Documentation", type: "media", advanced: true },
      sortField,
    ],
  },
  {
    slug: "products",
    table: "store_products",
    label: "Store products",
    description: "Source-code products for sale.",
    titleField: "name",
    subtitleField: "version",
    order: [{ column: "created_at", ascending: false }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "currency", label: "Currency", type: "text" },
      { name: "short_description", label: "Summary", type: "textarea" },
      { name: "thumbnail_url", label: "Cover image", type: "image" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "full_description", label: "Full description", type: "textarea", advanced: true },
      { name: "gallery", label: "Gallery URLs", type: "array", advanced: true },
      { name: "demo_url", label: "Demo URL", type: "url", advanced: true },
      { name: "github_url", label: "GitHub URL", type: "url", advanced: true },
      { name: "technologies", label: "Technologies", type: "array", advanced: true },
      { name: "features", label: "Features", type: "array", advanced: true },
      { name: "requirements", label: "Requirements", type: "array", advanced: true },
      { name: "documentation", label: "Documentation", type: "textarea", advanced: true },
      { name: "version", label: "Version", type: "text", advanced: true },
      { name: "license_type", label: "License type", type: "text", advanced: true },
      { name: "license_terms", label: "License terms", type: "textarea", advanced: true },
    ],
  },
  {
    slug: "services",
    table: "services",
    label: "Services",
    description: "What you offer clients.",
    titleField: "name",
    subtitleField: "short_description",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "short_description", label: "Summary", type: "textarea" },
      { name: "starting_price", label: "Starting price", type: "number" },
      { name: "currency", label: "Currency", type: "text" },
      { name: "is_active", label: "Active", type: "boolean" },
      { name: "full_description", label: "Full description", type: "textarea", advanced: true },
      { name: "features", label: "Features", type: "array", advanced: true },
      { name: "icon", label: "Icon", type: "text", advanced: true },
      sortField,
    ],
  },
  {
    slug: "experience",
    table: "experiences",
    label: "Experience",
    description: "Your work history.",
    titleField: "job_title",
    subtitleField: "organization",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "job_title", label: "Job title", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text", required: true },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Current role", type: "boolean" },
      { name: "description", label: "Summary", type: "textarea" },
      { name: "employment_type", label: "Employment type", type: "text", advanced: true },
      { name: "location", label: "Location", type: "text", advanced: true },
      { name: "responsibilities", label: "Responsibilities", type: "array", advanced: true },
      { name: "achievements", label: "Achievements", type: "array", advanced: true },
      { name: "technologies", label: "Technologies", type: "array", advanced: true },
      { name: "logo_url", label: "Logo", type: "image", advanced: true },
      sortField,
    ],
  },
  {
    slug: "education",
    table: "education",
    label: "Education",
    description: "Schools and degrees.",
    titleField: "institution",
    subtitleField: "program",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree", type: "text" },
      { name: "program", label: "Program", type: "text" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Currently studying", type: "boolean" },
      { name: "description", label: "Summary", type: "textarea", advanced: true },
      { name: "certificate_url", label: "Certificate file", type: "media", advanced: true },
      { name: "logo_url", label: "Logo", type: "image", advanced: true },
      { name: "featured", label: "Featured", type: "boolean", advanced: true },
      sortField,
    ],
  },
  {
    slug: "skills",
    table: "skills",
    label: "Skills",
    description: "Skills grouped by category.",
    titleField: "name",
    subtitleField: "category",
    order: [{ column: "category" }, { column: "sort_order" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "proficiency", label: "Proficiency", type: "text" },
      { name: "years_experience", label: "Years of experience", type: "number" },
      { name: "featured", label: "Featured", type: "boolean", advanced: true },
      { name: "icon", label: "Icon", type: "text", advanced: true },
      sortField,
    ],
  },
  {
    slug: "certifications",
    table: "certifications",
    label: "Certifications",
    description: "Certificates and credentials.",
    titleField: "title",
    subtitleField: "issuing_organization",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuing_organization", label: "Issued by", type: "text" },
      { name: "issue_date", label: "Issue date", type: "date" },
      { name: "image_url", label: "Certificate image", type: "image" },
      { name: "pdf_url", label: "Certificate file", type: "media" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "expiry_date", label: "Expiry date", type: "date", advanced: true },
      { name: "credential_id", label: "Credential ID", type: "text", advanced: true },
      { name: "credential_url", label: "Credential URL", type: "url", advanced: true },
      { name: "description", label: "Summary", type: "textarea", advanced: true },
      { name: "category", label: "Category", type: "text", advanced: true },
      sortField,
    ],
  },
  {
    slug: "achievements",
    table: "achievements",
    label: "Achievements",
    description: "Awards and recognition.",
    titleField: "title",
    subtitleField: "organization",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text" },
      { name: "date", label: "Date", type: "date" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "description", label: "Summary", type: "textarea", advanced: true },
      { name: "link", label: "Link", type: "url", advanced: true },
      { name: "category", label: "Category", type: "text", advanced: true },
      sortField,
    ],
  },
  {
    slug: "social-links",
    table: "social_links",
    label: "Social links",
    description: "Links in the header and footer.",
    titleField: "platform",
    subtitleField: "url",
    order: [{ column: "sort_order" }],
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "is_active", label: "Active", type: "boolean" },
      { name: "icon", label: "Icon", type: "text", advanced: true },
      sortField,
    ],
  },
  {
    slug: "messages",
    table: "contact_messages",
    label: "Contact messages",
    description: "Messages from your contact form.",
    titleField: "name",
    subtitleField: "subject",
    order: [{ column: "created_at", ascending: false }],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "status", label: "Status", type: "text", help: "unread / read / archived" },
      { name: "phone", label: "Phone", type: "text", advanced: true },
    ],
  },
  {
    slug: "bookings",
    table: "consultation_bookings",
    label: "Consultation bookings",
    description: "Requests for calls.",
    titleField: "full_name",
    subtitleField: "project_name",
    order: [{ column: "created_at", ascending: false }],
    fields: [
      { name: "full_name", label: "Full name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "preferred_date", label: "Preferred date", type: "date" },
      { name: "preferred_time", label: "Preferred time", type: "text" },
      { name: "status", label: "Status", type: "text", help: "pending / confirmed / completed / cancelled" },
      { name: "phone", label: "Phone", type: "text", advanced: true },
      { name: "consultation_type", label: "Type", type: "text", advanced: true },
      { name: "project_name", label: "Project", type: "text", advanced: true },
      { name: "description", label: "Description", type: "textarea", advanced: true },
      { name: "additional_notes", label: "Notes", type: "textarea", advanced: true },
      { name: "admin_notes", label: "Admin notes", type: "textarea", advanced: true },
    ],
  },
  {
    slug: "orders",
    table: "orders",
    label: "Orders",
    description: "Store orders and payments.",
    titleField: "customer_name",
    subtitleField: "customer_email",
    order: [{ column: "created_at", ascending: false }],
    readOnly: true,
    fields: [
      { name: "customer_name", label: "Customer", type: "text" },
      { name: "customer_email", label: "Email", type: "text" },
      { name: "amount", label: "Amount", type: "number" },
      { name: "currency", label: "Currency", type: "text" },
      { name: "payment_status", label: "Payment status", type: "text" },
      { name: "order_status", label: "Order status", type: "text" },
    ],
  },
];

export function getResource(slug: string) {
  return RESOURCES.find((r) => r.slug === slug);
}
