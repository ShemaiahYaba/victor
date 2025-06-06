
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Layers } from 'lucide-react'; // Added Layers icon for flashcards
import { useToast } from '@/hooks/use-toast';

interface NoteSummarizerProps {
  courseName: string;
  initialNotes?: string;
  onSummaryGenerated?: (summary: string) => void;
  onFlashcardsGenerated?: (flashcards: GenerateFlashcardsOutput['flashcards']) => void; // New prop
}

export const NoteSummarizer: FC<NoteSummarizerProps> = ({ 
  courseName, 
  initialNotes = '', 
  onSummaryGenerated,
  onFlashcardsGenerated 
}) => {
  const [notesToProcess, setNotesToProcess] = useState(initialNotes);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!notesToProcess.trim()) {
      toast({
        title: "Cannot Summarize",
        description: "Please provide some notes to summarize.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingSummary(true);
    setSummary('');
    try {
      const result = await summarizeNotes({ courseName, notes: notesToProcess });
      setSummary(result.summary);
      if (onSummaryGenerated) {
        onSummaryGenerated(result.summary);
      }
      toast({
        title: "Summary Generated!",
        description: "Your notes have been successfully summarized.",
      });
    } catch (error) {
      console.error("Error summarizing notes:", error);
      toast({
        title: "Summarization Failed",
        description: (error as Error).message || "Could not summarize notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!notesToProcess.trim()) {
      toast({
        title: "Cannot Generate Flashcards",
        description: "Please provide some notes to generate flashcards from.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingFlashcards(true);
    try {
      const result = await generateFlashcards({ courseName, notes: notesToProcess, numFlashcards: 5 });
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(result.flashcards);
      }
      // Parent component will show toast on successful saving of flashcards
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Flashcard Generation Failed",
        description: (error as Error).message || "Could not generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFlashcards(false);
    }
  };

  const isLoading = isLoadingSummary || isLoadingFlashcards;

  return (
    <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-accent" />
          AI Study Tools
        </CardTitle>
        <CardDescription>
          Use the content below to generate a concise summary or create helpful flashcards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter notes here..."
          value={notesToProcess}
          onChange={(e) => setNotesToProcess(e.target.value)}
          rows={8}
          disabled={isLoading}
        />
        {summary && !isLoadingSummary && (
          <div>
            <h4 className="font-semibold mb-2 font-headline">Generated Summary:</h4>
            <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSummarize} disabled={isLoading || !notesToProcess.trim()}>
          {isLoadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Summarize Notes
        </Button>
        {onFlashcardsGenerated && (
          <Button onClick={handleGenerateFlashcards} disabled={isLoading || !notesToProcess.trim()} variant="outline">
            {isLoadingFlashcards ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers className="mr-2 h-4 w-4" />}
            Generate Flashcards
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
