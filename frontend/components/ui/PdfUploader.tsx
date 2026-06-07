"use client"

import * as React from "react"
import { UploadCloud, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfUploaderProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function PdfUploader({ onFileSelect, className }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        onFileSelect(file)
      } else {
        alert("Please upload a PDF file.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        onFileSelect(file)
      } else {
        alert("Please upload a PDF file.")
      }
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      <input 
        type="file" 
        accept="application/pdf" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />
      
      {!selectedFile ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            isDragging 
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
              : "border-input/50 bg-secondary/10 hover:bg-secondary/30 hover:border-input"
          )}
        >
          <div className="w-14 h-14 rounded-full bg-secondary/80 flex items-center justify-center text-primary mb-4 shadow-sm">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Click or drag PDF to upload</h3>
          <p className="text-xs text-foreground/50 text-center max-w-xs">
            Support for a single PDF. Max file size: 10MB.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-4 flex items-center justify-between border-2 border-secondary/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground truncate max-w-[200px] md:max-w-[400px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-foreground/50">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
              </p>
            </div>
          </div>
          <button 
            onClick={handleRemove}
            className="p-2 rounded-full text-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
