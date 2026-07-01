export const VTU_SCHEME_2025 = {
  1: {
    cycle: "Physics",
    subjects: [
      "Engineering Mathematics – I",
      "Engineering Physics",
      "Computer-Aided Engineering Drawing (CAED)",
      "Engineering Science Course – I",
      "Programme Specific Course"
    ],
    labs: [
      "Programming Lab (C / Basics)",
      "Innovation & Design Thinking Lab"
    ],
    nonCore: [
      "Soft Skills",
      "Kannada"
    ]
  },
  2: {
    cycle: "Chemistry",
    subjects: [
      "Engineering Mathematics – II",
      "Engineering Chemistry",
      "Introduction to AI & Applications",
      "Engineering Science Course – II",
      "Programming Language Course (Python)"
    ],
    labs: [
      "Interdisciplinary Project"
    ],
    nonCore: [
      "Communication Skills",
      "Indian Constitution & Ethics"
    ]
  },
  3: {
    cycle: "CSE Core",
    subjects: [
      "Probability, Distributions & Statistics",
      "Object-Oriented Programming (Java)",
      "Digital Design & Computer Organization",
      "Operating Systems",
      "Data Structures & Applications"
    ],
    labs: [
      "Data Structures Lab",
      "Project Management (Git)",
      "Community / Social Project"
    ],
    nonCore: []
  },
  4: {
    cycle: "CSE Core",
    subjects: [
      "Discrete Mathematics & Graph Theory",
      "Microcontrollers",
      "Computer Networks",
      "Design & Analysis of Algorithms"
    ],
    labs: [
      "Algorithms Lab",
      "Ability Enhancement Lab (Web / UI/UX)"
    ],
    nonCore: [
      "Biology for Computer Engineers",
      "Environmental Project"
    ]
  },
  5: {
    cycle: "CSE Advanced",
    subjects: [
      "Software Engineering & Project Management",
      "Database Management Systems (DBMS)",
      "Theory of Computation",
      "Machine Learning",
      "Professional Elective – I"
    ],
    labs: [
      "Machine Learning Lab",
      "Hackathon-Based Project",
      "Research Methodology & IPR"
    ],
    nonCore: []
  },
  6: {
    cycle: "CSE Advanced",
    subjects: [
      "Advanced Java Programming",
      "Cryptography & Network Security",
      "Advanced Computer Architecture",
      "Internet of Things (IoT)",
      "Professional Elective – II"
    ],
    labs: [
      "IoT Lab",
      "Ability Enhancement Lab",
      "Capstone Project – Phase I"
    ],
    nonCore: []
  },
  7: {
    cycle: "CSE Specialization",
    subjects: [
      "High Performance Computing",
      "Professional Elective – III",
      "Professional Elective – IV",
      "Open Elective – I"
    ],
    labs: [
      "Capstone Project – Phase II"
    ],
    nonCore: [
      "Indian Knowledge System"
    ]
  },
  8: {
    cycle: "CSE Specialization",
    subjects: [
      "Internship",
      "Professional Elective – V",
      "Open Elective – II"
    ],
    labs: [],
    nonCore: []
  }
};

export function getSubjectsForSemester(semester: number) {
  const semData = VTU_SCHEME_2025[semester as keyof typeof VTU_SCHEME_2025];
  if (!semData) return [];
  
  return [...semData.subjects, ...semData.labs, ...semData.nonCore];
}
