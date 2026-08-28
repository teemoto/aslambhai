import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const articleTopics = ["Frontend", "AI", "Ad Tech", "Leadership", "TIL", "WTF"] as const;

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    minutes: z.number().int().positive(),
    topic: z.string(),
    icon: z.enum(["code", "ai", "data", "leadership", "megaphone", "globe", "til", "wtf", "other"]),
    cover: z.object({ src: z.string(), alt: z.string() }).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }).superRefine(({ minutes, topic }, context) => {
    if (topic === "TIL" && minutes > 5) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["minutes"], message: "TIL articles must be five minutes or less." });
    }
  }),
});

export const collections = { articles };
