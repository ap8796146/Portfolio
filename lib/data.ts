// All portfolio content lives here, taken from the resume.
// Edit this file to update the site; no component changes needed.

export const profile = {
  name: "Aryan Pathak",
  firstName: "Aryan",
  title: "React Developer",
  roles: [
    "React Developer",
    "Frontend Engineer",
    "TypeScript Enthusiast",
    "Full-Stack Builder",
  ],
  location: "Chandigarh, India",
  email: "ap8796146@gmail.com",
  // TODO: add your real profile URLs. Empty links are hidden automatically.
  linkedin: "",
  github: "",
  resumeUrl: "/Aryan-Pathak-Resume.pdf",
  summary:
    "Frontend Developer with 1+ year of hands-on experience building responsive, production-ready web applications using ReactJS, TypeScript, and JavaScript. Skilled in reusable component design, REST API integration, state management with React Hooks, and frontend performance optimization.",
  currently:
    "Software Associate at Ditstek Innovations, delivering client-facing modules in an agile, Git-based team.",
};

export const stats = [
  { value: "1+", label: "Years building with React" },
  { value: "3", label: "Featured projects" },
  { value: "2", label: "Roles at DITS" },
];

export type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    items: ["ReactJS", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Responsive Design"],
  },
  {
    title: "React Ecosystem",
    items: ["React Hooks", "Context API", "React Router", "Redux Toolkit", "Axios", "REST APIs"],
  },
  {
    title: "UI & Styling",
    items: ["Tailwind CSS", "Material UI", "Ant Design", "Bootstrap"],
  },
  {
    title: "Backend & Database",
    items: ["Node.js", "Express.js", "MySQL", "SQL"],
  },
  {
    title: "Tools & Workflow",
    items: ["Git", "GitHub", "Docker", "Vite", "Webpack", "npm", "Postman", "Jira", "Trello", "Agile/Scrum"],
  },
  {
    title: "Other Languages",
    items: ["Python", "C++"],
  },
];

export type Job = {
  role: string;
  company: string;
  type?: string;
  period: string;
  location: string;
  points: string[];
};

export const experience: Job[] = [
  {
    role: "Software Associate — ReactJS",
    company: "Ditstek Innovations Pvt. Ltd. (DITS)",
    type: "Full-Time",
    period: "May 2026 – Present",
    location: "Chandigarh, India",
    points: [
      "Develop and maintain responsive client web applications using ReactJS, TypeScript, and JavaScript, delivering modules to production.",
      "Built reusable components (forms, data tables, modals, filters) shared across projects, reducing development time for new screens.",
      "Integrated REST APIs with Axios, handling loading, error, and empty states for reliable data-driven pages.",
      "Improved page performance using lazy loading, code splitting, and memoization (React.memo, useMemo, useCallback).",
      "Converted PHP modules to ReactJS and implemented Dynamic Labels and Forms.",
    ],
  },
  {
    role: "Associate ReactJS Intern",
    company: "Ditstek Innovations Pvt. Ltd. (DITS)",
    period: "Aug 2025 – Apr 2026",
    location: "Chandigarh, India",
    points: [
      "Completed a 3-month intensive training in HTML, CSS, JavaScript, TypeScript, and ReactJS, with Jira-based project management.",
      "Converted Figma/design mockups into pixel-accurate, responsive React pages for desktop and mobile.",
      "Developed dynamic UI components with React Hooks and contributed across the full frontend lifecycle, from development to deployment.",
    ],
  },
];

export type Project = {
  name: string;
  kind: string;
  period: string;
  stack: string[];
  points: string[];
  // TODO: add repo / demo URLs. Empty links are hidden automatically.
  github: string;
  demo: string;
};

export const projects: Project[] = [
  {
    name: "E-Commerce Web Application",
    kind: "Frontend Project",
    period: "Jul 2025 – Aug 2025",
    stack: ["React.js", "JavaScript", "Context API", "REST API"],
    points: [
      "Responsive storefront with product listing, search, category filtering, cart, and checkout.",
      "Product data fetched from REST APIs with loading and error handling.",
      "Cart and app state managed with Hooks + Context API, persisted in localStorage.",
      "UI structured as reusable components for easy maintenance and extension.",
    ],
    github: "",
    demo: "",
  },
  {
    name: "Employee Management System",
    kind: "Full Stack Project",
    period: "Sep 2025 – Oct 2025",
    stack: ["React.js", "Node.js", "Express", "MySQL"],
    points: [
      "Full-stack app managing employee records, departments, roles, and contacts with full CRUD.",
      "Search, filtering, pagination, and form validation for fast record management.",
      "REST APIs designed in Node.js/Express, connected to the React frontend and MySQL.",
    ],
    github: "",
    demo: "",
  },
  {
    name: "House Price Prediction",
    kind: "Machine Learning Project",
    period: "Jun 2025 – Jul 2025",
    stack: ["Python", "TensorFlow", "OpenCV", "Flask"],
    points: [
      "ML model predicting Bangalore property prices from area, BHK, bathrooms, and location.",
      "Served through a Flask REST API for real-time predictions.",
    ],
    github: "",
    demo: "",
  },
];

export const education = [
  {
    school: "Shoolini University",
    degree: "B.Tech in Computer Science Engineering",
    period: "Jun 2021 – May 2025",
    location: "Solan, Himachal Pradesh",
  },
  {
    school: "D.A.V. Public Senior Secondary School",
    degree: "Class XII",
    period: "Apr 2020 – Mar 2021",
    location: "Alampur, Himachal Pradesh",
  },
];

export const certifications = [
  { name: "Claude Platform 101", issuer: "Anthropic" },
  { name: "Design Thinking Certificate", issuer: "IBM" },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
