'use server';

/**
 * @fileOverview Summarizes a local news article into 3-5 bullet points and assigns a credibility score.
 *
 * - summarizeLocalNews - A function that handles the summarization and credibility assessment process.
 * - SummarizeLocalNewsInput - The input type for the summarizeLocalNews function.
 * - SummarizeLocalNewsOutput - The return type for the summarizeLocalNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLocalNewsInputSchema = z.object({
  articleUrl: z.string().describe('URL of the local news article to summarize.'),
});
export type SummarizeLocalNewsInput = z.infer<typeof SummarizeLocalNewsInputSchema>;

const SummarizeLocalNewsOutputSchema = z.object({
  summary: z.array(z.string()).describe('Summary of the article in 3-5 bullet points.'),
  credibilityScore: z.number().describe('Credibility score of the article (0-100).'),
  credibilityExplanation: z.string().describe('Explanation of the credibility score.'),
});
export type SummarizeLocalNewsOutput = z.infer<typeof SummarizeLocalNewsOutputSchema>;

export async function summarizeLocalNews(input: SummarizeLocalNewsInput): Promise<SummarizeLocalNewsOutput> {
  return summarizeLocalNewsFlow(input);
}

const summarizeLocalNewsPrompt = ai.definePrompt({
  name: 'summarizeLocalNewsPrompt',
  input: {schema: SummarizeLocalNewsInputSchema},
  output: {schema: SummarizeLocalNewsOutputSchema},
  prompt: `You are an AI assistant that summarizes local news articles and assesses their credibility.\n\n  1.  Summarize the article from the provided URL into 3-5 bullet points.
  2.  Assign a credibility score (0-100) based on the source and content. Consider factors like journalistic standards, bias, and factual reporting.
  3.  Explain the credibility score.
\n  Article URL: {{{articleUrl}}}\n\n  Summary:
  {{#each summary}}- {{this}}\n  {{/each}}
  Credibility Score: {{credibilityScore}}
  Credibility Explanation: {{credibilityExplanation}}`,
});

const summarizeLocalNewsFlow = ai.defineFlow(
  {
    name: 'summarizeLocalNewsFlow',
    inputSchema: SummarizeLocalNewsInputSchema,
    outputSchema: SummarizeLocalNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeLocalNewsPrompt(input);
    return output!;
  }
);
