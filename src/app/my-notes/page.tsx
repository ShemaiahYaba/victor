
'use client';
import { useState, useEffect } from 'react';
import type { Note, Course, Document as CourseDocument } from '@/types';
import { MOCK_NOTES, MOCK_COURSES, MOCK_USER_PROFILE, MOCK_DOCUMENTS } from '@/lib/mock-data';
import type { GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-flow';

import { Button } from '@/components/ui/button';
import { NotebookText, BrainCircuit, FileText, FileText as DocumentIcon, Lightbulb, PlusCircle } from 'lucide-react';
import { NoteEditor } from '@/components/notes/note-editor';
import { NoteItem } from '@/components/notes/note-item';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MyNotesPage() {
  const { toast } = useToast();

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); 
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [isCourseSelectModalOpen, setIsCourseSelectModalOpen] = useState(false); // For AI Tools
  const [isCourseSelectForNewNoteModalOpen, setIsCourseSelectForNewNoteModalOpen] = useState(false); // For New Note
  const [selectedCourseIdForNewNote, setSelectedCourseIdForNewNote] = useState<string | null>(null);

  const [isDocSelectModalOpen, setIsDocSelectModalOpen] = useState(false);
  const [selectedCourseForSummary, setSelectedCourseForSummary] = useState<Course | null>(null);
  const [docsForSummary, setDocsForSummary] = useState<CourseDocument[]>([]);
  const [summarizationContext, setSummarizationContext] = useState<{ title: string; content: string; courseName: string; courseId: string } | null>(null);

  const [isSummarizerOpen, setIsSummarizerOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);


  useEffect(() => {
    setAllNotes(MOCK_NOTES); 
    setCourses(MOCK_COURSES);
  }, []);

  const refreshNotes = () => {
    setAllNotes([...MOCK_NOTES]);
  };

  const getCourseNameById = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course?.name || "Unknown Course";
  };

  const handleOpenCreateNewNoteFlow = () => {
    if (courses.length === 0) {
      toast({ title: "No Courses Available", description: "You need to have courses to create a note.", variant: "destructive" });
      return;
    }
    setSelectedCourseIdForNewNote(null);
    setEditingNote(null);
    setIsCourseSelectForNewNoteModalOpen(true);
  };

  const handleCourseSelectedForNewNote = (course: Course) => {
    setSelectedCourseIdForNewNote(course.id);
    setIsCourseSelectForNewNoteModalOpen(false);
    setEditingNote(null); // Important: ensure we are in "create" mode
    setIsNoteEditorOpen(true);
  };

  const handleSaveNote = async (noteData: Pick<Note, 'title' | 'content' | 'courseId'> & { id?: string }) => {
    setIsSavingNote(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    if (noteData.id) { // Editing existing note
      const noteIndex = MOCK_NOTES.findIndex(n => n.id === noteData.id);
      if (noteIndex > -1) {
        MOCK_NOTES[noteIndex] = { ...MOCK_NOTES[noteIndex], ...noteData, updatedAt: new Date().toISOString() };
      }
      toast({ title: "Note Updated!", description: `"${noteData.title}" has been updated.` });
    } else { // Creating a new note
      const newNote: Note = {
        id: `note-${Date.now()}`,
        courseId: noteData.courseId, // courseId is now part of noteData from NoteEditor
        title: noteData.title,
        content: noteData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_NOTES.unshift(newNote);
      toast({ title: "Note Created!", description: `"${newNote.title}" for ${getCourseNameById(newNote.courseId)} has been added.` });
      setSelectedCourseIdForNewNote(null); // Reset after successful creation
    }
    refreshNotes();
    setIsNoteEditorOpen(false);
    setEditingNote(null);
    setIsSavingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    const noteIndex = MOCK_NOTES.findIndex(n => n.id === noteId);
    if (noteIndex > -1) {
      MOCK_NOTES.splice(noteIndex, 1);
    }
    refreshNotes();
    toast({ title: "Note Deleted", variant: "destructive" });
  };
  
  const handleOpenNoteEditorForEdit = (note: Note) => { // Renamed for clarity
    setEditingNote(note);
    setSelectedCourseIdForNewNote(null); // Ensure not in new note mode
    setIsNoteEditorOpen(true);
  };

  const handleOpenSummarizerFlow = () => {
    if (courses.length === 0) {
      toast({ title: "No Courses", description: "Please add a course first to use AI study tools.", variant: "destructive" });
      return;
    }
    setIsCourseSelectModalOpen(true); // This is for AI tools
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
        summary: `Flashcard generated from "${summarizationContext.title}"`,
      };
      MOCK_NOTES.unshift(newNote);
    });

    refreshNotes(); 

    toast({
      title: "Flashcards Created!",
      description: `${flashcards.length} flashcards for "${selectedCourseForSummary.name}" have been added.`,
    });
    
    setIsSummarizerOpen(false);
    setSummarizationContext(null);
    setSelectedCourseForSummary(null);
    setDocsForSummary([]);
  };


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" />
          My Notes
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleOpenCreateNewNoteFlow}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Note
          </Button>
          <Button 
            variant="outline" 
            onClick={handleOpenSummarizerFlow}
          >
            <BrainCircuit className="mr-2 h-4 w-4" /> AI Study Tools
          </Button>
        </div>
      </header>

      {allNotes.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => {
            const courseNotes = allNotes.filter(note => note.courseId === course.id);
            if (courseNotes.length === 0) return null;
            return (
              <Card key={course.id} className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseNotes.map(note => (
                    <NoteItem 
                      key={note.id} 
                      note={note} 
                      onEdit={() => handleOpenNoteEditorForEdit(note)} 
                      onDelete={() => handleDeleteNote(note.id)}
                      onViewSummary={note.summary && !note.id.startsWith('flashcard-') ? () => { setCurrentSummary(note.summary!); setIsSummaryModalOpen(true); } : undefined}
                      isSummarized={!!note.summary && !note.id.startsWith('flashcard-')}
                    />
                  ))}
                </CardContent>
              </Card>
            );
          })}
           {allNotes.filter(note => !courses.find(c => c.id === note.courseId)).length > 0 && (
             <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 mt-4">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Notes from Uncategorized Courses</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allNotes.filter(note => !courses.find(c => c.id === note.courseId)).map(note => (
                     <NoteItem 
                      key={note.id} 
                      note={note} 
                      onEdit={() => handleOpenNoteEditorForEdit(note)} 
                      onDelete={() => handleDeleteNote(note.id)}
                      onViewSummary={note.summary && !note.id.startsWith('flashcard-') ? () => { setCurrentSummary(note.summary!); setIsSummaryModalOpen(true); } : undefined}
                      isSummarized={!!note.summary && !note.id.startsWith('flashcard-')}
                    />
                  ))}
                </CardContent>
             </Card>
           )}
        </div>
      ) : (
        <div className="text-center py-10">
          <NotebookText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Notes Yet</h2>
          <p className="mt-1 text-muted-foreground">
            Start taking notes by clicking "Create New Note", or generate flashcards using AI Study Tools.
          </p>
        </div>
      )}

      {/* Note Editor Dialog */}
      <Dialog open={isNoteEditorOpen} onOpenChange={setIsNoteEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </DialogTitle>
            <DialogDescription>
              {editingNote 
                ? `Modify your note "${editingNote.title}" for course: ${getCourseNameById(editingNote.courseId)}.` 
                : (selectedCourseIdForNewNote ? `Create a new quick note for course: ${getCourseNameById(selectedCourseIdForNewNote)}.` : 'Select a course to create a new note.')
              }
            </DialogDescription>
          </DialogHeader>
          {/* Render NoteEditor only if a course context is available (either editing or new note with selected course) */}
          {(editingNote || selectedCourseIdForNewNote) && (
            <NoteEditor 
              courseId={editingNote ? editingNote.courseId : selectedCourseIdForNewNote!} 
              note={editingNote || undefined} 
              onSave={handleSaveNote}
              isSaving={isSavingNote} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Course Selection Modal for New Note */}
      <Dialog open={isCourseSelectForNewNoteModalOpen} onOpenChange={setIsCourseSelectForNewNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Select Course for New Note</DialogTitle>
            <DialogDescription>Choose a course to associate with your new note.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2 pr-3">
              {courses.map(course => (
                <Button
                  key={course.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleCourseSelectedForNewNote(course)}
                >
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.code}</p>
                  </div>
                </Button>
              ))}
               {courses.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No courses available. Please add a course first.</p>}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCourseSelectForNewNoteModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Selection Modal for AI Tools */}
      <Dialog open={isCourseSelectModalOpen} onOpenChange={setIsCourseSelectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Select Course for AI Tools</DialogTitle>
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
               {courses.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No courses available.</p>}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCourseSelectModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Selection Modal for AI Tools */}
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
              {docsForSummary.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No lecture notes with content found for this course.</p>}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsDocSelectModalOpen(false); setSelectedCourseForSummary(null); setDocsForSummary([]); }}>Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Study Tools (Summarizer/Flashcard Generator) Dialog */}
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
      
      {/* Summary Display Dialog */}
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

