"use client"

import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

interface UseFileUploadToastResult {
  showUploadingToast: (fileName: string) => void
  showSuccessToast: (fileName: string) => void
  showErrorToast: (fileName: string, error: string) => void
  isUploading: boolean
}

export function useFileUploadToast(): UseFileUploadToastResult {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const showUploadingToast = (fileName: string) => {
    setIsUploading(true)
    toast({
      title: "Uploading file",
      description: `${fileName} is being uploaded...`,
      duration: 3000,
    })
  }

  const showSuccessToast = (fileName: string) => {
    setIsUploading(false)
    toast({
      title: "File uploaded",
      description: `${fileName} has been successfully uploaded.`,
      duration: 3000,
    })
  }

  const showErrorToast = (fileName: string, error: string) => {
    setIsUploading(false)
    toast({
      title: "Upload failed",
      description: `Failed to upload ${fileName}. Error: ${error}`,
      variant: "destructive",
      duration: 5000,
    })
  }

  return {
    showUploadingToast,
    showSuccessToast,
    showErrorToast,
    isUploading,
  }
}

