'use server';
/**
 * @fileOverview AI flow to generate flashcards from given text content for a course.
 *
 * - generateFlashcards - Generates flashcard question/answer pairs.
 * - GenerateFlashcardsInput - Input type for the flow.
 * - GenerateFlashcardsOutput - Output type (array of flashcards).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardSchema = z.object({
  question: z.string().describe("The question for the flashcard. This should be concise and test a key concept."),
  answer: z.string().describe("The answer to the flashcard question. This should be informative and directly address the question."),
});

const GenerateFlashcardsInputSchema = z.object({
  courseName: z.string().describe("The name of the course for which to generate flashcards."),
  notes: z.string().describe("The text content from which to generate flashcards."),
  numFlashcards: z.number().min(1).max(10).default(5).describe("The number of flashcards to generate."),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe("An array of generated flashcard objects, each with a question and an answer."),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;


export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: { schema: GenerateFlashcardsInputSchema },
  output: { schema: GenerateFlashcardsOutputSchema },
  prompt: `You are an AI assistant specialized in creating educational flashcards.
Generate exactly {{numFlashcards}} flashcards from the following notes for the course titled "{{courseName}}".
Each flashcard should consist of a clear question and a concise answer. Focus on key concepts, definitions, and important facts from the notes.

Notes:
{{{notes}}}

Return the flashcards as an array of objects, where each object has a "question" field and an "answer" field.
Adhere strictly to the JSON output schema provided.

Example of a single flashcard object within the 'flashcards' array:
{
  "question": "What is the primary function of a CPU?",
  "answer": "The CPU (Central Processing Unit) is responsible for executing instructions of a computer program."
}

Generate the flashcards now.
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output || !output.flashcards || output.flashcards.length === 0) {
      throw new Error("Failed to generate flashcard content from AI.");
    }
    // Basic validation: Ensure questions and answers are not empty
    for (const fc of output.flashcards) {
      if (!fc.question || fc.question.trim() === '' || !fc.answer || fc.answer.trim() === '') {
        throw new Error("AI generated an empty question or answer for a flashcard. Please try again.");
      }
    }
    return output;
  }
);
