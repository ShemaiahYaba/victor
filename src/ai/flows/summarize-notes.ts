
// Summarizes notes for a specific course using AI.
//
// - summarizeNotes - A function that handles the note summarization process.
// - SummarizeNotesInput - The input type for the summarizeNotes function.
// - SummarizeNotesOutput - The return type for the summarizeNotes function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  courseName: z.string().describe('The name of the course.'),
  notes: z.string().describe('The notes to be summarized.'),
});

export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized notes.'),
});

export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const summarizeNotesPrompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are an AI assistant helping students summarize their notes.

  Summarize the following notes for the course '{{courseName}}'.

  Notes: {{{notes}}}`,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotesPrompt(input);
    if (!output || typeof output.summary !== 'string' || output.summary.trim() === '') {
      console.error("AI did not return a valid summary. Output:", output);
      throw new Error("Failed to generate a valid summary from the AI. The response was empty or malformed.");
    }
    return output;
  }
);

