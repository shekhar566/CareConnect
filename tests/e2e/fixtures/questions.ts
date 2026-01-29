export interface TestQuestion {
  title: string;
  content: string;
  tags: Array<
    "PEDIATRICS" | "IMMUNOLOGY" | "EMERGENCY" | "CARDIOLOGY" | "GERIATRICS"
  >;
  patientAge: number;
  gender: "MALE" | "FEMALE";
  urgency: "LOW" | "MEDIUM" | "CRITICAL";
}

export const SAMPLE_QUESTIONS: TestQuestion[] = [
  {
    title: "Persistent fever in a 4-year-old",
    content:
      "A 4-year-old child has had a low-grade fever for 5 days with mild fatigue and reduced appetite. No rash or respiratory symptoms reported so far.",
    tags: ["PEDIATRICS", "IMMUNOLOGY"],
    patientAge: 4,
    gender: "MALE",
    urgency: "MEDIUM",
  },
  {
    title: "Chest pain after physical exertion",
    content:
      "A 52-year-old patient reports chest discomfort occurring after moderate physical activity. Pain subsides with rest and has occurred multiple times over the past week.",
    tags: ["CARDIOLOGY"],
    patientAge: 52,
    gender: "FEMALE",
    urgency: "CRITICAL",
  },
  {
    title: "Sudden shortness of breath in elderly patient",
    content:
      "An 81-year-old patient experienced sudden onset shortness of breath and dizziness while at home. No known trauma reported.",
    tags: ["EMERGENCY", "GERIATRICS", "CARDIOLOGY"],
    patientAge: 81,
    gender: "MALE",
    urgency: "CRITICAL",
  },
  {
    title: "Recurrent infections in young adult",
    content:
      "A 29-year-old patient reports frequent infections over the past year, including sinus and respiratory infections, with prolonged recovery times.",
    tags: ["IMMUNOLOGY"],
    patientAge: 29,
    gender: "FEMALE",
    urgency: "LOW",
  },
  {
    title: "Confusion and weakness in elderly patient",
    content:
      "A 76-year-old patient presents with increasing confusion and generalized weakness over the last 48 hours. Family notes a sudden change from baseline behavior.",
    tags: ["GERIATRICS", "EMERGENCY"],
    patientAge: 76,
    gender: "FEMALE",
    urgency: "CRITICAL",
  },
];
