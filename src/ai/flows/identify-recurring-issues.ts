'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze citizen reports and news data from Firestore
 * to identify recurring issues and generate a summary with AI. It exports the `identifyRecurringIssues` function,
 * the `IdentifyRecurringIssuesInput` type, and the `IdentifyRecurringIssuesOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeReports } from '@/services/firestore-data-analyzer';

const IdentifyRecurringIssuesInputSchema = z.object({
  district: z.string().describe('The district to analyze.'),
  reportData: z.string().optional(),
});
export type IdentifyRecurringIssuesInput = z.infer<typeof IdentifyRecurringIssuesInputSchema>;

const IdentifyRecurringIssuesOutputSchema = z.object({
  summary: z.string().describe('A summary of the recurring issues in the district.'),
});
export type IdentifyRecurringIssuesOutput = z.infer<typeof IdentifyRecurringIssuesOutputSchema>;

export async function identifyRecurringIssues(
  input: Omit<IdentifyRecurringIssuesInput, 'reportData'>
): Promise<IdentifyRecurringIssuesOutput> {
  return identifyRecurringIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyRecurringIssuesPrompt',
  input: {schema: IdentifyRecurringIssuesInputSchema},
  output: {schema: IdentifyRecurringIssuesOutputSchema},
  prompt: `You are a civic data analyst tasked with identifying recurring issues in a given district.
  Analyze the provided citizen reports and news data to identify the most pressing and frequent problems.
  Generate a concise summary of these recurring issues, highlighting their potential impact on the community of the {{district}} district.

  Data: {{{reportData}}}

  Summary: `,
});

const identifyRecurringIssuesFlow = ai.defineFlow(
  {
    name: 'identifyRecurringIssuesFlow',
    inputSchema: IdentifyRecurringIssuesInputSchema,
    outputSchema: IdentifyRecurringIssuesOutputSchema,
  },
  async input => {
    const reportData = await analyzeReports(input.district);
    const {output} = await prompt({...input, reportData});
    return output!;
  }
);
