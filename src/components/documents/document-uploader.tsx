
'use client';
import type { FC } from 'react';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  courseId: string;
  onUpload: (file: File, courseId: string) => Promise<boolean>; // Returns true on success
  uploaderTitle?: string;
}

export const DocumentUploader: FC<DocumentUploaderProps> = ({ courseId, onUpload, uploaderTitle }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    const success = await onUpload(selectedFile, courseId);
    setIsUploading(false);
    if (success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-lg shadow-primary/10 bg-card">
      <h3 className="font-headline text-lg">{uploaderTitle || "Upload Document"}</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="flex-grow"
          disabled={isUploading}
        />
        <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
          Upload
        </Button>
      </div>
      {selectedFile && !isUploading && (
        <p className="text-sm text-muted-foreground flex items-center">
          <FileCheck className="mr-2 h-4 w-4 text-green-500" /> Ready to upload: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
};


    