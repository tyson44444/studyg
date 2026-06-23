'use server';
/**
 * @fileOverview This flow converts a given career report text into an audible WAV audio format using Text-to-Speech (TTS).
 *
 * - readCareerReportAloud - A function that handles the conversion of text to speech.
 * - ReadCareerReportAloudInput - The input type for the readCareerReportAloud function.
 * - ReadCareerReportAloudOutput - The return type for the readCareerReportAloud function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { Buffer } from 'buffer';

const ReadCareerReportAloudInputSchema = z.string().describe('The career report text to be read aloud.');
export type ReadCareerReportAloudInput = z.infer<typeof ReadCareerReportAloudInputSchema>;

const ReadCareerReportAloudOutputSchema = z.object({
  media: z.string().describe('The career report audio as a data URI (audio/wav).'),
});
export type ReadCareerReportAloudOutput = z.infer<typeof ReadCareerReportAloudOutputSchema>;

/**
 * Converts PCM audio data to WAV format.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  // Use standard require for wav to handle commonjs resolution in turbopack
  const wav = require('wav');
  
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d: any) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function readCareerReportAloud(input: ReadCareerReportAloudInput): Promise<ReadCareerReportAloudOutput> {
  return readCareerReportAloudFlow(input);
}

const readCareerReportAloudFlow = ai.defineFlow(
  {
    name: 'readCareerReportAloudFlow',
    inputSchema: ReadCareerReportAloudInputSchema,
    outputSchema: ReadCareerReportAloudOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
