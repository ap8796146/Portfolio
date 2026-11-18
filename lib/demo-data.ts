// Deterministic sample data for the /playground demos (no real people).

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: "Active" | "On Leave" | "Remote";
  joined: string; // YYYY-MM-DD
  salary: number; // INR / year
};

export const DEPARTMENTS = ["Engineering", "Design", "Product", "QA", "HR", "Sales"] as const;

const FIRST = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Ananya", "Vihaan", "Isha", "Arjun", "Saanvi", "Kunal", "Priya", "Dev", "Nisha", "Aditya", "Riya", "Karan", "Tara", "Yash", "Pooja"];
const LAST = ["Sharma", "Verma", "Gupta", "Mehta", "Kapoor", "Singh", "Rao", "Iyer", "Joshi", "Nair", "Malhotra", "Chopra"];
const ROLES: Record<(typeof DEPARTMENTS)[number], string[]> = {
  Engineering: ["React Developer", "Backend Engineer", "Full-Stack Developer", "DevOps Engineer"],
  Design: ["UI Designer", "UX Researcher"],
  Product: ["Product Manager", "Business Analyst"],
  QA: ["QA Engineer", "Automation Tester"],
  HR: ["HR Executive", "Talent Partner"],
  Sales: ["Account Executive", "Sales Manager"],
};
const CITIES = ["Chandigarh", "Mohali", "Bengaluru", "Pune", "Delhi", "Hyderabad", "Remote"];
const STATUSES: Employee["status"][] = ["Active", "Active", "Active", "Remote", "On Leave"];

export const EMPLOYEES: Employee[] = Array.from({ length: 46 }, (_, i) => {
  const first = FIRST[(i * 7) % FIRST.length];
  const last = LAST[(i * 5 + 3) % LAST.length];
  const department = DEPARTMENTS[(i * 3) % DEPARTMENTS.length];
  const roles = ROLES[department];
  const month = ((i * 5) % 12) + 1;
  const day = ((i * 11) % 27) + 1;
  return {
    id: `EMP-${String(1001 + i)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${i}@example.com`.toLowerCase(),
    role: roles[i % roles.length],
    department,
    location: CITIES[(i * 2) % CITIES.length],
    status: STATUSES[i % STATUSES.length],
    joined: `${2019 + (i % 7)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    salary: 400000 + ((i * 137) % 30) * 50000,
  };
});
