'use server';

/**
 * @fileOverview This file defines a Genkit flow for classifying citizen reports.
 *
 * - classifyCitizenReport - A function that classifies citizen reports based on text, voice, or image input.
 * - ClassifyCitizenReportInput - The input type for the classifyCitizenReport function.
 * - ClassifyCitizenReportOutput - The return type for the classifyCitizenReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyCitizenReportInputSchema = z.object({
  text: z.string().optional().describe('The text of the citizen report.'),
  voiceDataUri: z.string().optional().describe(
    'The voice recording of the citizen report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // per design guidelines
  ),
  imageDataUri: z.string().optional().describe(
    'The image of the citizen report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // per design guidelines
  ),
});
export type ClassifyCitizenReportInput = z.infer<typeof ClassifyCitizenReportInputSchema>;

const ClassifyCitizenReportOutputSchema = z.object({
  category: z.string().describe('The classified category of the citizen report.'),
  confidence: z.number().describe('The confidence score of the classification (0-1).'),
  summary: z.string().describe('A short summary of the citizen report.'),
});
export type ClassifyCitizenReportOutput = z.infer<typeof ClassifyCitizenReportOutputSchema>;

export async function classifyCitizenReport(input: ClassifyCitizenReportInput): Promise<ClassifyCitizenReportOutput> {
  return classifyCitizenReportFlow(input);
}

const classifyCitizenReportPrompt = ai.definePrompt({
  name: 'classifyCitizenReportPrompt',
  input: {schema: ClassifyCitizenReportInputSchema},
  output: {schema: ClassifyCitizenReportOutputSchema},
  prompt: `You are an AI assistant that classifies citizen reports into categories.

  Analyze the following report and classify it into a single category.
  Also provide a confidence score (0-1) for your classification.
  Write a short summary of the report.

  Here is the citizen report:

  {{#if text}}
  Text: {{{text}}}
  {{/if}}

  {{#if voiceDataUri}}
  Voice: {{media url=voiceDataUri}}
  {{/if}}

  {{#if imageDataUri}}
  Image: {{media url=imageDataUri}}
  {{/if}}

  Return the category, confidence score, and summary in JSON format.
  `,
});

const classifyCitizenReportFlow = ai.defineFlow(
  {
    name: 'classifyCitizenReportFlow',
    inputSchema: ClassifyCitizenReportInputSchema,
    outputSchema: ClassifyCitizenReportOutputSchema,
  },
  async input => {
    const {output} = await classifyCitizenReportPrompt(input);
    return output!;
  }
);
