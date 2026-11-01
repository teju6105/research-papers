import { z } from "zod";

const doiSchema = z
  .string()
  .regex(/^10\.\d{4,9}\/\S+$/i, "DOI must use the 10.xxxx/identifier format.")
  .nullable()
  .optional();

const urlSchema = z.string().url().nullable().optional();

export const researchPaperInputSchema = z.object({
  paperId: z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9._:-]+$/),
  title: z.string().trim().min(3).max(500),
  authors: z.array(z.string().trim().min(1).max(150)).min(1).max(50),
  abstract: z.string().trim().min(10).max(30000),
  keywords: z.array(z.string().trim().min(1).max(100)).max(100),
  researchCategory: z.string().trim().min(2).max(120),
  publicationYear: z.number().int().min(1800).max(2200),
  journalOrConference: z.string().trim().min(2).max(300),
  doi: doiSchema,
  externalPaperUrl: urlSchema,
  pdfUrl: urlSchema,
  isSample: z.boolean().default(false),
});

export const researchPaperUpdateSchema = researchPaperInputSchema
  .omit({ paperId: true, isSample: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one paper field must be provided.",
  });

export type ResearchPaperInput = z.infer<typeof researchPaperInputSchema>;

export type ResearchPaperDocument = ResearchPaperInput & {
  createdAt: Date;
};
