
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import type { Note } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  courseId: string;
  note?: Note;
  onSave: (noteData: Pick<Note, 'title' | 'content' | 'courseId'> & { id?: string }) => Promise<void>;
  isSaving?: boolean;
}

export const NoteEditor: FC<NoteEditorProps> = ({ courseId, note, onSave, isSaving }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Cannot Save Note",
        description: "Title and content cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    await onSave({ id: note?.id, courseId, title, content });
    if (!note?.id) { // Reset form if it's a new note
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-lg shadow-primary/10 bg-card">
      <Input
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-headline text-lg"
        disabled={isSaving}
      />
      <Textarea
        placeholder="Start typing your notes here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="text-base"
        disabled={isSaving}
      />
      <Button onClick={handleSave} disabled={isSaving || !title.trim() || !content.trim()}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {note ? 'Save Changes' : 'Save Note'}
      </Button>
    </div>
  );
};


    