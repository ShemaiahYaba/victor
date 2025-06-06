
'use client';
import { useState, useEffect } from 'react';
import type { Note, Course, Document as CourseDocument } from '@/types';
import { MOCK_COURSES, MOCK_NOTES, MOCK_DOCUMENTS } from '@/lib/mock-data';
import type { GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-flow';

import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, BrainCircuit, FileText as DocumentIcon, Lightbulb } from 'lucide-react';
import { NoteSummarizer } from '@/components/notes/note-summarizer';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CoursesPage() {
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  
  const [isCourseSelectModalOpen, setIsCourseSelectModalOpen] = useState(false);
  const [isDocSelectModalOpen, setIsDocSelectModalOpen] = useState(false);
  const [selectedCourseForSummary, setSelectedCourseForSummary] = useState<Course | null>(null);
  const [docsForSummary, setDocsForSummary] = useState<CourseDocument[]>([]);
  const [summarizationContext, setSummarizationContext] = useState<{ title: string; content: string; courseName: string, courseId: string } | null>(null);

  const [isSummarizerOpen, setIsSummarizerOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    setCourses(MOCK_COURSES);
  }, []);

  const handleOpenSummarizerFlow = () => {
    if (MOCK_COURSES.length === 0) {
      toast({ title: "No Courses", description: "Please add a course first to summarize its notes.", variant: "destructive" });
      return;
    }
    setIsCourseSelectModalOpen(true);
  };

  const handleCourseSelectedForSummary = (course: Course) => {
    setSelectedCourseForSummary(course);
    const lectureDocs = MOCK_DOCUMENTS.filter(doc => doc.courseId === course.id && doc.isLectureNote && doc.content);
    if (lectureDocs.length > 0) {
      setDocsForSummary(lectureDocs);
      setIsCourseSelectModalOpen(false);
      setIsDocSelectModalOpen(true);
    } else {
      toast({ title: "No Summarizable Notes", description: `No lecture notes with content found for ${course.name}.`, variant: "default" });
      setIsCourseSelectModalOpen(false);
    }
  };

  const handleDocumentSelectedForSummary = (doc: CourseDocument) => {
    if (doc.content && selectedCourseForSummary) {
      setSummarizationContext({ 
        title: doc.name, 
        content: doc.content, 
        courseName: selectedCourseForSummary.name,
        courseId: selectedCourseForSummary.id 
      });
      setIsDocSelectModalOpen(false);
      setIsSummarizerOpen(true);
    } else {
      toast({ title: "Error", description: "Selected document has no content or course context is missing.", variant: "destructive" });
      setIsDocSelectModalOpen(false);
    }
  };

  const handleSummaryGenerated = (summary: string) => {
    setCurrentSummary(summary);
    // setIsSummarizerOpen(false); // Keep summarizer open if user might want to generate flashcards too
    // setSummarizationContext(null); 
    setIsSummaryModalOpen(true);
  };

  const handleFlashcardsGenerated = (flashcards: GenerateFlashcardsOutput['flashcards']) => {
    if (!summarizationContext || !selectedCourseForSummary) {
      toast({ title: "Error", description: "Course context lost. Cannot save flashcards.", variant: "destructive" });
      return;
    }
    
    flashcards.forEach((fc, index) => {
      const newNote: Note = {
        id: `flashcard-${selectedCourseForSummary.id}-${Date.now()}-${index}`,
        courseId: selectedCourseForSummary.id,
        title: fc.question,
        content: fc.answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        summary: `Flashcard generated from "${summarizationContext.title}"`, // Optional: add context
      };
      MOCK_NOTES.unshift(newNote);
    });

    toast({
      title: "Flashcards Created!",
      description: `${flashcards.length} flashcards for "${selectedCourseForSummary.name}" have been added to your Quick Notes.`,
    });
    
    // Close all related dialogs
    setIsSummarizerOpen(false);
    setSummarizationContext(null);
    setSelectedCourseForSummary(null);
    setDocsForSummary([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Your Courses</h1>
        <Button
          variant="default" 
          onClick={handleOpenSummarizerFlow}
        >
          <BrainCircuit className="mr-2 h-4 w-4" /> AI Study Tools
        </Button>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">You haven't added any courses yet.</p>
          <Button asChild size="lg">
            <Link href="/courses/new"> 
              <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Course
            </Link>
          </Button>
        </div>
      )}

      <Dialog open={isCourseSelectModalOpen} onOpenChange={setIsCourseSelectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Select Course</DialogTitle>
            <DialogDescription>Choose a course to select its lecture notes for AI study tools.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2 pr-3">
              {courses.map(course => (
                <Button
                  key={course.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleCourseSelectedForSummary(course)}
                >
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.code}</p>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCourseSelectModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocSelectModalOpen} onOpenChange={setIsDocSelectModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Select Lecture Note from {selectedCourseForSummary?.name}</DialogTitle>
            <DialogDescription>Choose a lecture note to summarize or generate flashcards from.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2 pr-3">
              {docsForSummary.map(doc => (
                <Button
                  key={doc.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2 flex items-center gap-2"
                  onClick={() => handleDocumentSelectedForSummary(doc)}
                  disabled={!doc.content}
                >
                  <DocumentIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate flex-1">{doc.name}</span>
                  {!doc.content && <span className="text-xs text-red-500">(No content)</span>}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsDocSelectModalOpen(false); setSelectedCourseForSummary(null); setDocsForSummary([]); }}>Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSummarizerOpen} onOpenChange={(open) => { if(!open) setSummarizationContext(null); setIsSummarizerOpen(open);}}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">AI Study Tools</DialogTitle>
             <DialogDescription>
              Using document: {summarizationContext?.title || "selected lecture notes"} from course: {summarizationContext?.courseName}.
            </DialogDescription>
          </DialogHeader>
          <Alert className="my-4">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Friendly Reminder</AlertTitle>
            <AlertDescription>
              These AI tools are study aids for quick summaries and flashcards. 
              They are not a substitute for comprehensive study and don't guarantee exam success. Use wisely!
            </AlertDescription>
          </Alert>
          {summarizationContext && (
            <NoteSummarizer 
              courseName={summarizationContext.courseName} 
              initialNotes={summarizationContext.content}
              onSummaryGenerated={handleSummaryGenerated}
              onFlashcardsGenerated={handleFlashcardsGenerated}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Lecture Note Summary</DialogTitle>
          </DialogHeader>
          {currentSummary && (
             <ScrollArea className="max-h-[60vh] whitespace-pre-wrap">
              <div className="py-4 text-sm">
                {currentSummary}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setIsSummaryModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
