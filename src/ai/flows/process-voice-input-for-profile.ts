'use server';
/**
 * @fileOverview This file implements a Genkit flow for processing voice input
 * to transcribe speech into text, enabling users to describe their skills
 * and interests for career analysis without typing.
 *
 * - processVoiceInputForProfile - A function that handles the speech-to-text transcription process.
 * - AudioInput - The input type for the processVoiceInputForProfile function.
 * - TranscriptionOutput - The return type for the processVoiceInputForProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AudioInput = z.infer<typeof AudioInputSchema>;

const TranscriptionOutputSchema = z.object({
  transcribedText: z.string().describe('The transcribed text from the audio input.'),
});
export type TranscriptionOutput = z.infer<typeof TranscriptionOutputSchema>;

export async function processVoiceInputForProfile(
  input: AudioInput
): Promise<TranscriptionOutput> {
  return processVoiceInputForProfileFlow(input);
}

const processVoiceInputForProfileFlow = ai.defineFlow(
  {
    name: 'processVoiceInputForProfileFlow',
    inputSchema: AudioInputSchema,
    outputSchema: TranscriptionOutputSchema,
  },
  async input => {
    const {text} = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        {text: 'Transcribe the following audio into text:'},
        {media: {url: input.audioDataUri}},
      ],
    });

    if (!text) {
      throw new Error('Failed to transcribe audio: No text output from model.');
    }

    return { transcribedText: text };
  }
);
