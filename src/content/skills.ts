/** Skills exactly as grouped on the resume. `note` adds context the resume itself gives elsewhere. */

export type SkillGroup = {
  id: string;
  label: string;
  items: { name: string; note?: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "testing",
    label: "Testing & QA",
    items: [
      { name: "Manual testing" },
      { name: "Automation testing" },
      { name: "API testing" },
      { name: "Functional testing" },
      { name: "Regression testing" },
      { name: "Smoke testing" },
      { name: "UAT" },
      { name: "Test case design" },
      { name: "Test execution" },
      { name: "Bug tracking & reporting" },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    items: [
      { name: "Selenium WebDriver", note: "learned with Java at TCS and ICT Academy" },
      { name: "Playwright", note: "JavaScript" },
    ],
  },
  {
    id: "api",
    label: "API",
    items: [{ name: "Postman" }, { name: "REST APIs" }],
  },
  {
    id: "process",
    label: "Methods",
    items: [{ name: "SDLC" }, { name: "STLC" }, { name: "Agile Scrum" }],
  },
  {
    id: "tools",
    label: "Version control",
    items: [{ name: "Git" }, { name: "GitLab" }],
  },
  {
    id: "professional",
    label: "Working with people",
    items: [
      { name: "Communication" },
      { name: "Team collaboration" },
      { name: "Analytical thinking" },
      { name: "Problem solving" },
      { name: "Project management" },
      { name: "CRM" },
    ],
  },
];

export const domains = [
  { name: "Healthcare", full: "Healthcare systems" },
  { name: "Inventory", full: "Inventory management systems" },
  { name: "HRMS", full: "Human resource management systems" },
  { name: "ERP", full: "Enterprise resource planning systems" },
  { name: "Education", full: "Education systems" },
];

/** Where she tests, from the Kiebot role. */
export const platforms = ["Web applications", "Mobile applications", "REST APIs"];

/** Flat list for structured data (`knowsAbout`) and the assistant. */
export const allSkills = skillGroups.flatMap((g) => g.items.map((i) => i.name));
