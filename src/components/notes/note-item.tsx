
import type { FC } from 'react';
import type { Note } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onViewSummary?: (note:Note) => void;
  isSummarized?: boolean;
}

export const NoteItem: FC<NoteItemProps> = ({ note, onEdit, onDelete, onViewSummary, isSummarized }) => {
  return (
    <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center justify-between">
          {note.title}
          {isSummarized && onViewSummary && (
            <Button variant="ghost" size="sm" onClick={() => onViewSummary(note)} title="View Summary">
              <FileText className="h-4 w-4 text-primary" />
            </Button>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Last updated: {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 whitespace-pre-wrap">{note.content}</p>
         {note.summary && !onViewSummary && ( // Show summary snippet if not handled by onViewSummary
          <div className="mt-2 p-2 bg-muted rounded">
            <h5 className="text-xs font-semibold text-muted-foreground">Summary:</h5>
            <p className="text-xs text-muted-foreground line-clamp-2">{note.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
          <Pencil className="mr-1 h-3 w-3" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
          <Trash2 className="mr-1 h-3 w-3" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};


    