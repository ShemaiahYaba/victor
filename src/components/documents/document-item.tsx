
import type { FC } from 'react';
import type { Document } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileArchive, Download, Trash2, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentItemProps {
  document: Document;
  onDelete: (documentId: string) => void;
  isAdmin?: boolean;
}

export const DocumentItem: FC<DocumentItemProps> = ({ document, onDelete, isAdmin }) => {
  const getFileIcon = (fileType: string) => {
    return <FileArchive className="h-5 w-5 text-primary mr-3 shrink-0" />;
  };

  const canDelete = isAdmin || !document.isLectureNote;

  return (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md hover:bg-secondary/60 transition-colors">
      <div className="flex items-center overflow-hidden">
        {getFileIcon(document.fileType)}
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <a 
              href={document.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium hover:underline truncate"
              title={document.name}
            >
              {document.name}
            </a>
            {document.isLectureNote && (
              <Badge variant="outline" className="text-xs border-accent text-accent shrink-0">
                Lecture Note
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {document.fileType.toUpperCase()} - Uploaded {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 ml-2">
        <Button variant="outline" size="icon" asChild title="Download">
          <a href={document.url} download={document.name}>
            <Download className="h-4 w-4" />
          </a>
        </Button>
        {canDelete && (
          <Button variant="destructive" size="icon" onClick={() => onDelete(document.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {!canDelete && document.isLectureNote && (
           <Button variant="outline" size="icon" disabled title="Only admins can delete lecture notes">
            <Trash2 className="h-4 w-4 opacity-50" />
          </Button>
        )}
      </div>
    </div>
  );
};
