export type SamplePaper = {
  id: string;
  title: string;
  authors: string[];
  topic: string;
  year: number;
  journal: string;
  abstract: string;
  keywords: string[];
  readingTime: string;
};

// Fictional records for layout preview only; these are not search results.
export const samplePapers: SamplePaper[] = [
  {
    id: "sample-climate-forecasting",
    title: "Interpretable Machine Learning for Regional Climate Forecasting",
    authors: ["Maya Chen", "Oliver Grant", "Sofia Alvarez"],
    topic: "Climate science",
    year: 2024,
    journal: "Sample Journal of Climate Systems",
    abstract:
      "This sample abstract explores how interpretable machine-learning methods might support regional climate forecasting. It describes a fictional framework for examining model behavior across different geographic and seasonal conditions.",
    keywords: ["Climate", "Machine learning", "Forecasting"],
    readingTime: "12 min read",
  },
  {
    id: "sample-health-equity",
    title: "Mapping Access to Preventive Care in Growing Urban Communities",
    authors: ["Nia Okafor", "Daniel Brooks"],
    topic: "Public health",
    year: 2023,
    journal: "Sample Review of Community Health",
    abstract:
      "This fictional study outline considers how travel time, neighborhood resources, and service availability can be represented when studying access to preventive care in rapidly changing urban communities.",
    keywords: ["Public health", "Urban studies", "Access"],
    readingTime: "9 min read",
  },
  {
    id: "sample-language-models",
    title: "Evaluating Language Models for Evidence-Based Literature Review",
    authors: ["Amira Patel", "Jonas Weber", "Lena Fischer"],
    topic: "Artificial intelligence",
    year: 2025,
    journal: "Sample Proceedings in Responsible AI",
    abstract:
      "A fictional evaluation framework for studying how language models identify, organize, and summarize claims in a curated research corpus, with emphasis on traceability and researcher review.",
    keywords: ["Language models", "Research methods", "AI"],
    readingTime: "15 min read",
  },
  {
    id: "sample-biodiversity",
    title: "Community-Led Monitoring for Biodiversity in Restored Wetlands",
    authors: ["Elena Rossi", "Marcus Lee"],
    topic: "Ecology",
    year: 2022,
    journal: "Sample Journal of Ecological Practice",
    abstract:
      "This sample paper describes a fictional community-led monitoring approach for documenting species observations and habitat changes in restored wetland environments.",
    keywords: ["Biodiversity", "Wetlands", "Community science"],
    readingTime: "8 min read",
  },
  {
    id: "sample-learning-analytics",
    title: "Student-Centered Learning Analytics in Hybrid Classrooms",
    authors: ["Grace Kim", "Rafael Mendes"],
    topic: "Education",
    year: 2024,
    journal: "Sample Review of Digital Learning",
    abstract:
      "A fictional discussion of learning analytics designed around student agency, transparent data practices, and actionable feedback in hybrid university courses.",
    keywords: ["Education", "Learning analytics", "Higher education"],
    readingTime: "11 min read",
  },
  {
    id: "sample-energy-storage",
    title: "A Comparative Framework for Long-Duration Energy Storage",
    authors: ["Theo Martin", "Aisha Rahman", "Peter Novak"],
    topic: "Energy systems",
    year: 2021,
    journal: "Sample Energy Research Letters",
    abstract:
      "This fictional framework sketches comparison criteria for long-duration energy storage technologies, including deployment context, lifecycle considerations, and grid flexibility.",
    keywords: ["Energy", "Storage", "Sustainability"],
    readingTime: "10 min read",
  },
];
