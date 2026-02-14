import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const modules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modules' }),
  schema: z.object({
    id: z.string(),
    questionNumber: z.number(),
    title: z.string(),
    question: z.string(),
    whatItTests: z.string(),
    coreExplanation: z.object({
      summary: z.string(),
      details: z.array(z.object({
        heading: z.string(),
        content: z.string(),
      })),
    }),
    keyConcepts: z.array(z.object({
      term: z.string(),
      explanation: z.string(),
    })),
    codeExamples: z.array(z.object({
      title: z.string(),
      language: z.string(),
      code: z.string(),
      description: z.string(),
    })).optional(),
    pitfalls: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    caseStudies: z.array(z.object({
      title: z.string(),
      scenario: z.string(),
      approach: z.string(),
      outcome: z.string(),
    })),
    furtherReading: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })),
  }),
});

export const collections = { modules };
