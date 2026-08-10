import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    minutes: z.number().int().positive(),
    topic: z.string(),
    icon: z.enum(["code", "ai", "data", "leadership", "megaphone", "globe", "other"]),
    cover: z.object({ src: z.string(), alt: z.string() }).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
