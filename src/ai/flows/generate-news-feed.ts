'use server';

/**
 * @fileOverview Generates a live news feed for a specific district using AI.
 *
 * - generateNewsFeed - A function that creates a list of news items.
 * - GenerateNewsFeedInput - The input type for the generateNewsFeed function.
 * - GenerateNewsFeedOutput - The return type for the generateNewsFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewsFeedInputSchema = z.object({
  district: z.string().describe('The district for which to generate news.'),
  state: z.string().describe('The state where the district is located.'),
  language: z
    .string()
    .optional()
    .describe('The language for the news feed (e.g., "English", "Hindi").'),
});
export type GenerateNewsFeedInput = z.infer<
  typeof GenerateNewsFeedInputSchema
>;

const NewsItemSchema = z.object({
  headline: z.string().describe('A compelling news headline.'),
  summary: z
    .string()
    .describe('A one or two sentence summary of the news item.'),
  category: z
    .enum([
      'Infrastructure',
      'Politics',
      'Weather',
      'Health',
      'Community',
      'Business',
    ])
    .describe('The category of the news item.'),
});
export type NewsItem = z.infer<typeof NewsItemSchema>;

const GenerateNewsFeedOutputSchema = z.object({
  newsFeed: z.array(NewsItemSchema).describe('A list of 5 generated news items.'),
});
export type GenerateNewsFeedOutput = z.infer<
  typeof GenerateNewsFeedOutputSchema
>;

export async function generateNewsFeed(
  input: GenerateNewsFeedInput
): Promise<GenerateNewsFeedOutput> {
  return generateNewsFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsFeedPrompt',
  input: {schema: GenerateNewsFeedInputSchema},
  output: {schema: GenerateNewsFeedOutputSchema},
  prompt: `Generate a list of 5 realistic, engaging, and recent news headlines and short summaries for the {{district}} district in the state of {{state}}, India.

The news should be in {{language}}.

Categories can include: Infrastructure, Politics, Weather, Health, Community, Business.

Return the response as a JSON object with a "newsFeed" array.`,
});

const generateNewsFeedFlow = ai.defineFlow(
  {
    name: 'generateNewsFeedFlow',
    inputSchema: GenerateNewsFeedInputSchema,
    outputSchema: GenerateNewsFeedOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
