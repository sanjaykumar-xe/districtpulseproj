'use server';

/**
 * @fileOverview A flow that answers civic questions via voice.
 *
 * - answerCivicQueriesViaVoice - A function that handles the answering of civic questions via voice.
 * - AnswerCivicQueriesViaVoiceInput - The input type for the answerCivicQueriesViaVoice function.
 * - AnswerCivicQueriesViaVoiceOutput - The return type for the answerCivicQueriesViaVoice function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

const AnswerCivicQueriesViaVoiceInputSchema = z.object({
  question: z
    .string()
    .describe('The question asked by the user in text format.'),
  language: z.string().optional().describe('The language for the answer (e.g., "English", "Hindi").'),
});
export type AnswerCivicQueriesViaVoiceInput = z.infer<typeof AnswerCivicQueriesViaVoiceInputSchema>;

const AnswerCivicQueriesViaVoiceOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  audio: z.string().describe('The audio of the answer.'),
});
export type AnswerCivicQueriesViaVoiceOutput = z.infer<typeof AnswerCivicQueriesViaVoiceOutputSchema>;

export async function answerCivicQueriesViaVoice(input: AnswerCivicQueriesViaVoiceInput): Promise<AnswerCivicQueriesViaVoiceOutput> {
  return answerCivicQueriesViaVoiceFlow(input);
}

const answerCivicQueriesViaVoicePrompt = ai.definePrompt({
  name: 'answerCivicQueriesViaVoicePrompt',
  input: {schema: AnswerCivicQueriesViaVoiceInputSchema},
  prompt: `You are a civic information chatbot for Indian districts. Answer the following question concisely in {{language}}.

Question: {{{question}}}`,
});

const answerCivicQueriesViaVoiceFlow = ai.defineFlow(
  {
    name: 'answerCivicQueriesViaVoiceFlow',
    inputSchema: AnswerCivicQueriesViaVoiceInputSchema,
    outputSchema: AnswerCivicQueriesViaVoiceOutputSchema,
  },
  async input => {
    const {text} = await answerCivicQueriesViaVoicePrompt(input);

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {answer: text, audio: audio};
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
