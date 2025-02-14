"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

export function FileUpload() {
  return (
    <SessionProvider>
      <FileUploadComponent />
    </SessionProvider>
  );
}

function FileUploadComponent() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const validTypes = [".csv", ".xlsx", ".json", ".xls"];
      return validTypes.some((type) => file.name.toLowerCase().endsWith(type));
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload CSV, Excel, or JSON files only.",
        variant: "destructive",
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const content = await file.text();

        const response = await fetch("/api/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
      }

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });

      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Drop your files here or click to upload
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports CSV, Excel, and JSON files
          </p>
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.json,.xls"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="mx-auto">
              Select Files
            </Button>
          </label>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={uploadFiles} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      )}
    </div>
  );
}
