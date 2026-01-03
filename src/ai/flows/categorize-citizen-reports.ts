'use server';

/**
 * @fileOverview A flow that categorizes citizen reports using AI.
 *
 * - categorizeCitizenReport - A function that categorizes a citizen report.
 * - CategorizeCitizenReportInput - The input type for the categorizeCitizenReport function.
 * - CategorizeCitizenReportOutput - The return type for the categorizeCitizenReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CitizenReportCategorySchema = z.enum([
  'Roads & Infrastructure',
  'Public Safety',
  'Water & Sanitation',
  'Healthcare',
  'Education',
  'Environment',
  'Other',
]);

const CategorizeCitizenReportInputSchema = z.object({
  reportText: z.string().describe('The text content of the citizen report.'),
});
export type CategorizeCitizenReportInput = z.infer<typeof CategorizeCitizenReportInputSchema>;

const CategorizeCitizenReportOutputSchema = z.object({
  category: CitizenReportCategorySchema.describe('The category of the citizen report.'),
  explanation: z.string().describe('The explanation of why the report was categorized as such.')
});
export type CategorizeCitizenReportOutput = z.infer<typeof CategorizeCitizenReportOutputSchema>;

export async function categorizeCitizenReport(
  input: CategorizeCitizenReportInput
): Promise<CategorizeCitizenReportOutput> {
  return categorizeCitizenReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeCitizenReportPrompt',
  input: {schema: CategorizeCitizenReportInputSchema},
  output: {schema: CategorizeCitizenReportOutputSchema},
  prompt: `You are an AI assistant that categorizes citizen reports into predefined categories.

  The categories are:
  - Roads & Infrastructure
  - Public Safety
  - Water & Sanitation
  - Healthcare
  - Education
  - Environment
  - Other

  Given the following citizen report, determine the most appropriate category and explain your reasoning. Make sure that the category and explanation are included in the output.

  Citizen Report: {{{reportText}}}`,
});

const categorizeCitizenReportFlow = ai.defineFlow(
  {
    name: 'categorizeCitizenReportFlow',
    inputSchema: CategorizeCitizenReportInputSchema,
    outputSchema: CategorizeCitizenReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
