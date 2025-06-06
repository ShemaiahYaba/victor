
'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import type { Course, Note, Document as CourseDocument, Quiz, QuizAttempt, AnsweredQuestion } from '@/types';
import { MOCK_COURSES, MOCK_NOTES, MOCK_DOCUMENTS, MOCK_QUIZZES, MOCK_USER_PROFILE, MOCK_QUIZ_ATTEMPTS } from '@/lib/mock-data';
import { shuffleArray } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, NotebookText, FileArchive, ListChecks, PlusCircle, BrainCircuit, ClipboardCheck, User, FileText as DocumentIcon } from 'lucide-react';
import Link from 'next/link';

import { NoteEditor } from '@/components/notes/note-editor';
import { NoteItem } from '@/components/notes/note-item';
import { NoteSummarizer } from '@/components/notes/note-summarizer';
import { DocumentUploader } from '@/components/documents/document-uploader';
import { DocumentItem } from '@/components/documents/document-item';
import { QuizCard } from '@/components/quizzes/quiz-card';
import { QuizView } from '@/components/quizzes/quiz-view';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [lectureNotes, setLectureNotes] = useState<CourseDocument[]>([]);
  const [courseQuizzes, setCourseQuizzes] = useState<Quiz[]>([]);
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [summarizingNote, setSummarizingNote] = useState<Note | null>(null);
  const [isSummarizerOpen, setIsSummarizerOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const foundCourse = MOCK_COURSES.find(c => c.id === courseId);
    setCourse(foundCourse || null);
    if (foundCourse) {
      setNotes(MOCK_NOTES.filter(n => n.courseId === courseId));
      const courseDocs = MOCK_DOCUMENTS.filter(d => d.courseId === courseId);
      setLectureNotes(courseDocs.filter(d => d.isLectureNote));
      setDocuments(courseDocs); 
      setCourseQuizzes(MOCK_QUIZZES.filter(q => q.courseId === courseId));
    }
    setIsAdmin(MOCK_USER_PROFILE.isAdmin || false);
  }, [courseId]);

  const handleSaveNote = async (noteData: Pick<Note, 'title' | 'content' | 'courseId'> & { id?: string }) => {
    setIsSavingNote(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (noteData.id) {
      setNotes(prevNotes => prevNotes.map(n => n.id === noteData.id ? { ...n, ...noteData, updatedAt: new Date().toISOString() } : n));
      MOCK_NOTES[MOCK_NOTES.findIndex(n => n.id === noteData.id)] = notes.find(n => n.id === noteData.id)!; 
      toast({ title: "Note Updated!", description: `"${noteData.title}" has been updated.` });
    } else {
      const newNote: Note = { ...noteData, id: `note-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setNotes(prevNotes => [newNote, ...prevNotes]);
      MOCK_NOTES.unshift(newNote); 
      toast({ title: "Note Saved!", description: `"${newNote.title}" has been created.` });
    }
    setIsNoteEditorOpen(false);
    setEditingNote(null);
    setIsSavingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    const noteIndex = MOCK_NOTES.findIndex(n => n.id === noteId);
    if (noteIndex > -1) MOCK_NOTES.splice(noteIndex, 1); 
    toast({ title: "Note Deleted", variant: "destructive" });
  };
  
  const handleOpenNoteEditor = (note?: Note) => {
    setEditingNote(note || null);
    setIsNoteEditorOpen(true);
  };

  const handleOpenSummarizer = (note: Note) => {
    setSummarizingNote(note);
    setIsSummarizerOpen(true);
  };

  const handleSummaryGenerated = (summary: string, noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? {...n, summary} : n));
    const noteToUpdate = MOCK_NOTES.find(n => n.id === noteId);
    if (noteToUpdate) noteToUpdate.summary = summary; 

    setIsSummarizerOpen(false);
    setSummarizingNote(null);
    setCurrentSummary(summary);
    setIsSummaryModalOpen(true);
  };

  const handleUploadDocument = async (file: File, cId: string, options?: { isLectureNote?: boolean }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newDocument: CourseDocument = {
      id: `doc-${Date.now()}`,
      courseId: cId,
      name: file.name,
      url: URL.createObjectURL(file), 
      fileType: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      uploadedAt: new Date().toISOString(),
      isLectureNote: !!options?.isLectureNote,
    };
    setDocuments(prevDocs => [newDocument, ...prevDocs]);
    MOCK_DOCUMENTS.unshift(newDocument); 
    if(newDocument.isLectureNote){
      setLectureNotes(prevLecNotes => [newDocument, ...prevLecNotes]);
    }
    toast({ title: "Document Uploaded!", description: `"${newDocument.name}" has been uploaded.` });
    return true;
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prevDocs => prevDocs.filter(d => d.id !== documentId));
    setLectureNotes(prevLecNotes => prevLecNotes.filter(d => d.id !== documentId));
    const docIndex = MOCK_DOCUMENTS.findIndex(d => d.id === documentId);
    if (docIndex > -1) MOCK_DOCUMENTS.splice(docIndex, 1); 
    toast({ title: "Document Deleted", variant: "destructive" });
  };

  const handleStartQuiz = (quizId: string) => {
    const quizToStart = courseQuizzes.find(q => q.id === quizId);
    if (quizToStart) {
      const shuffledQuiz = {
        ...quizToStart,
        questions: shuffleArray(quizToStart.questions)
      };
      setActiveQuiz(shuffledQuiz);
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number, completedQuiz: Quiz, answeredQuestions: AnsweredQuestion[]) => {
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: completedQuiz.id,
      courseId: completedQuiz.courseId,
      quizTitle: completedQuiz.title,
      attemptedAt: new Date().toISOString(),
      score,
      totalQuestions,
      questions: answeredQuestions,
    };
    MOCK_QUIZ_ATTEMPTS.unshift(newAttempt); 

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} on "${completedQuiz.title}". View details in Quiz History.`,
    });
    // setActiveQuiz(null); // Optionally close quiz view
  };


  if (!course) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back to courses
          </Link>
        </Button>
      </div>
    );
  }
  
  if (activeQuiz) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setActiveQuiz(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course Details
        </Button>
        <QuizView quiz={activeQuiz} onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>
        {isAdmin && (
          <Button variant="outline" size="sm">
            Edit Course
          </Button>
        )}
      </div>

      <header className="p-6 md:p-8 rounded-lg shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary" className="bg-primary-foreground/90 hover:bg-primary-foreground/80 text-primary font-medium">{course.code}</Badge>
              <Badge variant="secondary" className="bg-primary-foreground/90 hover:bg-primary-foreground/80 text-primary font-medium">{course.credits} Credits</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{course.name}</h1>
            <div className="flex items-center text-base md:text-lg mb-3">
              <User className="mr-2 h-5 w-5 opacity-90" />
              <span>Instructor: {course.instructor}</span>
            </div>
            <p className="text-sm md:text-base opacity-90">{course.description}</p>
          </div>
          <div className="hidden md:flex bg-primary/80 p-4 rounded-lg items-center justify-center h-32 w-32 md:h-36 md:w-36 shrink-0">
            <DocumentIcon className="h-20 w-20 md:h-24 md:w-24 text-primary-foreground/80" strokeWidth={1.5} />
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        <Tabs defaultValue="lecture-notes" className="w-full max-w-4xl">
          <TabsList className="mb-6">
            <TabsTrigger value="lecture-notes" className="font-headline text-base"><FileArchive className="mr-2 h-5 w-5"/>Lecture Notes</TabsTrigger>
            <TabsTrigger value="quick-notes" className="font-headline text-base"><NotebookText className="mr-2 h-5 w-5"/>Quick Notes</TabsTrigger>
            <TabsTrigger value="quizzes" className="font-headline text-base"><ListChecks className="mr-2 h-5 w-5"/>Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="lecture-notes" className="space-y-6">
            <h2 className="text-2xl font-semibold font-headline">Lecture Notes</h2>
            <p className="text-muted-foreground -mt-4">Access and manage course lecture materials</p>
            {isAdmin && (
              <div className="p-4 border border-dashed rounded-lg bg-secondary/20 shadow-lg shadow-primary/10">
                <h3 className="text-xl font-semibold font-headline mb-3 text-primary">Admin: Upload Lecture Note</h3>
                <DocumentUploader 
                  uploaderTitle="Upload Lecture Note File"
                  courseId={course.id} 
                  onUpload={(file, cId) => handleUploadDocument(file, cId, { isLectureNote: true })}
                />
              </div>
            )}
            
            {lectureNotes.length > 0 ? (
              <div className="space-y-3 mt-6">
                {lectureNotes.map(doc => (
                  <DocumentItem key={doc.id} document={doc} onDelete={handleDeleteDocument} isAdmin={isAdmin} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">No lecture notes uploaded for this course yet.</p>
            )}
          </TabsContent>

          <TabsContent value="quick-notes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-headline">Quick Notes</h2>
              <Button onClick={() => handleOpenNoteEditor()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Note
              </Button>
            </div>
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(note => (
                  <NoteItem 
                    key={note.id} 
                    note={note} 
                    onEdit={() => handleOpenNoteEditor(note)} 
                    onDelete={handleDeleteNote}
                    onViewSummary={note.summary ? () => { setCurrentSummary(note.summary!); setIsSummaryModalOpen(true); } : undefined}
                    isSummarized={!!note.summary}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No quick notes yet for this course.</p>
            )}
            <Button 
                variant="outline" 
                onClick={() => {
                  const targetNote = notes.find(n => n.content.length > 50) || (notes.length > 0 ? notes[0] : null); 
                  if (targetNote) handleOpenSummarizer(targetNote);
                  else toast({title: "No notes available", description: "Please add a note first to summarize.", variant: "destructive"});
                }}
                disabled={notes.length === 0}
                className="mt-4"
              >
                <BrainCircuit className="mr-2 h-4 w-4" /> AI Summarize a Note
              </Button>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold font-headline">Quizzes & Assessments</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/quiz-history">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> View Full Quiz History
                </Link>
              </Button>
            </div>
            {courseQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseQuizzes.map(quiz => (
                  <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={handleStartQuiz} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No quizzes available for this course yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isNoteEditorOpen} onOpenChange={setIsNoteEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
            <DialogDescription>
              {editingNote ? `Modify your note "${editingNote.title}".` : 'Create a new quick note for this course.'}
            </DialogDescription>
          </DialogHeader>
          <NoteEditor 
            courseId={course.id} 
            note={editingNote || undefined} 
            onSave={handleSaveNote}
            isSaving={isSavingNote} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSummarizerOpen} onOpenChange={setIsSummarizerOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">AI Note Summarizer</DialogTitle>
             <DialogDescription>
              Generate a summary for: {summarizingNote?.title || "selected quick notes"}.
            </DialogDescription>
          </DialogHeader>
          {summarizingNote && (
            <NoteSummarizer 
              courseName={course.name} 
              initialNotes={summarizingNote.content}
              onSummaryGenerated={(summary) => handleSummaryGenerated(summary, summarizingNote.id)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Note Summary</DialogTitle>
          </DialogHeader>
          {currentSummary && (
            <div className="py-4 whitespace-pre-wrap text-sm">
              {currentSummary}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsSummaryModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
