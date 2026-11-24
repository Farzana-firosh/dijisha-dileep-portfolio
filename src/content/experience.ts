/** Work history and education, from the resume. Bullets are the resume's, with grammar tidied only. */

export type Role = {
  id: string;
  title: string;
  org: string;
  place: string;
  /** Display period, as written on the resume. */
  period: string;
  /** ISO years for structured data. */
  start: string;
  end?: string;
  current?: boolean;
  points: string[];
};

export const roles: Role[] = [
  {
    id: "kiebot",
    title: "Software Tester",
    org: "Kiebot",
    place: "Bangalore, Karnataka",
    period: "2023 – Present",
    start: "2023",
    current: true,
    points: [
      "Run end-to-end manual testing of web and mobile applications.",
      "Design and maintain test cases, test plans and test reports.",
      "Find and report defects through bug-tracking tools.",
      "Carry out functional, regression and UAT testing of web and mobile applications in Agile Scrum.",
    ],
  },
  {
    id: "tcs",
    title: "Software Testing Intern",
    org: "TCS",
    place: "Trivandrum, Kerala",
    period: "2022 – 2023",
    start: "2022",
    end: "2023",
    points: [
      "Trained in the Software Development Life Cycle (SDLC) and Software Testing Life Cycle (STLC).",
      "Performed manual testing and learned automation testing with Selenium WebDriver and Java.",
      "Took part in real-time project simulations and Agile Scrum practices.",
    ],
  },
  {
    id: "ict-academy",
    title: "Software Testing Trainee",
    org: "ICT Academy",
    place: "Trivandrum, Kerala",
    period: "2022 – 2023",
    start: "2022",
    end: "2023",
    points: [
      "Completed intensive training in the SDLC and STLC.",
      "Gained hands-on experience in manual testing, test case design and defect reporting.",
      "Learned the basics of Selenium WebDriver with Java on mock projects.",
    ],
  },
  {
    id: "infosys",
    title: "System Engineer Trainee",
    org: "Infosys",
    place: "Mysore, Karnataka",
    period: "2022 · 6 months",
    start: "2022",
    end: "2022",
    points: [
      "Trained in SDLC concepts and programming fundamentals.",
      "Worked on mock development projects to understand real-time workflows.",
      "Learned the basics of Selenium and took part in Agile team activities.",
    ],
  },
  {
    id: "ems-college",
    title: "Assistant Professor, Electronics",
    org: "EMS Memorial College of Applied Science",
    place: "Iritty, Kerala",
    period: "2020 – 2022",
    start: "2020",
    end: "2022",
    points: [
      "Taught Electronics subjects and mentored students.",
      "Prepared lesson plans and conducted assessments.",
      "Evaluated student performance and contributed to academic activities.",
    ],
  },
];

export type Degree = {
  degree: string;
  field: string;
  school: string;
  university: string;
  period: string;
  grade: string;
};

export const education: Degree[] = [
  {
    degree: "M.Tech",
    field: "Signal Processing",
    school: "College of Engineering Thalassery",
    university: "KTU",
    period: "2017 – 2019",
    grade: "CGPA 8.16",
  },
  {
    degree: "B.Tech",
    field: "Electronics and Communication Engineering",
    school: "College of Engineering Thalassery",
    university: "CUSAT",
    period: "2013 – 2017",
    grade: "CGPA 7.08",
  },
];
