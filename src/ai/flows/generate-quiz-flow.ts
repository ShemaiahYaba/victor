
'use server';
/**
 * @fileOverview AI flow to generate a quiz for a given course.
 *
 * - generateQuiz - Generates quiz questions, options, and answers.
 * - GenerateQuizInput - Input type for the flow.
 * - GenerateQuizOutput - Output type (Quiz structure).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratedQuizQuestionOptionSchema = z.object({
  text: z.string().describe("The text for this answer option."),
});

const GeneratedQuizQuestionSchema = z.object({
  text: z.string().describe("The question text."),
  options: z.array(GeneratedQuizQuestionOptionSchema).length(4).describe("An array of 4 unique answer options."),
  correctOptionText: z.string().describe("The text of the correct option from the 'options' array. This must exactly match one of the provided option texts."),
  explanation: z.string().optional().describe("An optional brief explanation for why the answer is correct."),
});

const GenerateQuizInputSchema = z.object({
  courseName: z.string().describe("The name of the course for which to generate the quiz."),
  courseDescription: z.string().optional().describe("A brief description of the course content."),
  numQuestions: z.number().min(1).max(10).default(5).describe("The number of questions to generate for the quiz."),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe("A suitable title for the generated quiz (e.g., 'Quiz: Introduction to [Course Name]')."),
  description: z.string().optional().describe("A brief description of the quiz."),
  questions: z.array(GeneratedQuizQuestionSchema).describe("An array of generated quiz questions."),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an AI assistant specialized in creating educational quizzes.
Generate a quiz for the course titled "{{courseName}}".
{{#if courseDescription}}
Course Description: {{courseDescription}}
{{/if}}
The quiz should have exactly {{numQuestions}} multiple-choice questions. Each question must have 4 unique answer options.
For each question, provide:
1.  The question text.
2.  An array of 4 answer options, where each option is an object with a 'text' field.
3.  The text of the correct answer option. This text MUST be an exact match to one of the texts provided in the options array.
4.  An optional brief explanation for the correct answer.

The quiz title should be descriptive, like "Quiz: Fundamentals of {{courseName}}".
Adhere strictly to the JSON output schema provided.

Example of a single question object within the 'questions' array:
{
  "text": "What is the primary function of a CPU?",
  "options": [
    {"text": "Store data long-term"},
    {"text": "Execute program instructions"},
    {"text": "Display graphics on the screen"},
    {"text": "Connect to the internet"}
  ],
  "correctOptionText": "Execute program instructions",
  "explanation": "The CPU (Central Processing Unit) is the brain of the computer, responsible for executing instructions of a computer program."
}

Generate the full quiz structure now.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate quiz content from AI.");
    }
    // Validate that correctOptionText matches one of the options for each question
    for (const q of output.questions) {
      const correctOptionExists = q.options.some(opt => opt.text === q.correctOptionText);
      if (!correctOptionExists) {
        console.error(`Validation Error: Correct option text "${q.correctOptionText}" does not match any provided option for question "${q.text}". Options: ${q.options.map(o=>o.text).join(', ')}`);
        throw new Error(`AI generation error: Correct option text mismatch for question: "${q.text}". Please try regenerating.`);
      }
    }
    return output;
  }
);

