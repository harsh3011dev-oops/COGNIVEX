"use client"

import * as React from "react"
import { Send, Sparkles, Paperclip, FileText, X, Loader2 } from "lucide-react"
import { askAI } from "@/lib/api"

export function MessageBubble({ message, isAi }: { message: string, isAi: boolean }) {
  return (
    <div className={`flex gap-3 mb-6 ${isAi ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAi ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
        {isAi ? <Sparkles size={14} /> : <span className="text-xs font-bold">ST</span>}
      </div>
      <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed sm:max-w-[80%] sm:p-4 ${isAi ? 'bg-card text-foreground/90 rounded-tl-none shadow-sm border-none' : 'bg-primary text-primary-foreground rounded-tr-none shadow-sm'}`}>
        {isAi ? (
          <div className="whitespace-pre-wrap">{message}</div>
        ) : (
          message
        )}
      </div>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary">
        <Sparkles size={14} className="animate-pulse" />
      </div>
      <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-card text-foreground/60 rounded-tl-none shadow-sm border-none">
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          <span className="animate-pulse">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
}

export function PromptChips({ onSelect, disabled }: { onSelect: (text: string) => void, disabled?: boolean }) {
  const prompts = ["Explain Concept", "Give Practice", "Test Me", "Show Example"]
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {prompts.map(prompt => (
        <button 
          key={prompt}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="min-h-11 rounded-full border-none bg-secondary/30 px-4 py-2.5 text-xs font-semibold text-foreground/70 transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

export function ChatBox({ 
  initialTopic = "", 
  initialSubject = "", 
  initialQuery = "" 
}: { 
  initialTopic?: string; 
  initialSubject?: string; 
  initialQuery?: string; 
}) {
  const [messages, setMessages] = React.useState([
    { text: "Hello! I'm your Cognivex AI Mentor. I know your learning profile and I'm here to give you personalized guidance. What shall we explore today?", isAi: true }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const chatEndRef = React.useRef<HTMLDivElement>(null)
  const initialTriggered = React.useRef(false)

  // Trigger query automatically if passed via URL parameters
  React.useEffect(() => {
    if (initialTriggered.current) return;

    if (initialQuery && initialQuery.trim()) {
      initialTriggered.current = true;
      sendInitialQuery(initialQuery);
    } else if (initialTopic && initialTopic.trim()) {
      initialTriggered.current = true;
      const computedPrompt = `Can you explain the core concepts of "${initialTopic}" under "${initialSubject}" and give me some exam weightage or placement interview tips for this topic?`;
      sendInitialQuery(computedPrompt);
    }
  }, [initialQuery, initialTopic, initialSubject]);

  // Auto-scroll to bottom when messages change or loading state changes
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendInitialQuery = async (queryText: string) => {
    setMessages(prev => [...prev, { text: queryText, isAi: false }]);
    setIsLoading(true);
    try {
      const data = await askAI(queryText);
      if (data.success) {
        setMessages(prev => [...prev, { text: data.response, isAi: true }]);
      } else {
        setMessages(prev => [...prev, { 
          text: data.response || "I'm having trouble connecting right now. Please try again in a moment.", 
          isAi: true 
        }]);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setMessages(prev => [...prev, { 
        text: "⚠️ Something went wrong while connecting to the AI. Please check your internet connection and try again.", 
        isAi: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return

    const userQuery = input.trim()
    const msgContext = attachedFile ? `[Attached: ${attachedFile.name}]\n` : ""
    const fullMessage = msgContext + userQuery

    // Add user message
    setMessages(prev => [...prev, { text: fullMessage, isAi: false }])
    setInput("")
    setAttachedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""

    // Call AI API
    setIsLoading(true)
    try {
      const data = await askAI(userQuery)

      if (data.success) {
        setMessages(prev => [...prev, { text: data.response, isAi: true }])
      } else {
        // Server returned an error with a fallback message
        setMessages(prev => [...prev, { 
          text: data.response || "I'm having trouble connecting right now. Please try again in a moment.", 
          isAi: true 
        }])
      }
    } catch (error) {
      console.error('AI request failed:', error)
      setMessages(prev => [...prev, { 
        text: "⚠️ Something went wrong while connecting to the AI. Please check your internet connection and try again.", 
        isAi: true 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].type === "application/pdf") {
         setAttachedFile(e.target.files[0])
      } else {
         alert("Please attach a PDF file.")
      }
    }
  }

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
        setAttachedFile(file)
      } else {
        alert("Please drop a PDF file.")
      }
    }
  }

  return (
    <div 
      className={`relative flex h-[calc(100dvh-7.5rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border-none shadow-inner drop-shadow-sm transition-colors duration-300 sm:h-[calc(100dvh-140px)] sm:rounded-3xl ${isDragging ? 'bg-primary/5 ring-4 ring-primary/20' : 'bg-secondary/10'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay visually showing drop zone */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <FileText size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Drop PDF to Attach</h3>
          <p className="text-foreground/60 mt-2">Chat with your study material</p>
        </div>
      )}

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8">
        <div className="mb-6 mt-2 text-center sm:mb-10 sm:mt-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/50 bg-card shadow-md sm:mb-4 sm:h-16 sm:w-16">
            <span className="text-xl sm:text-2xl">🎓</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Welcome back, Scholar</h2>
          <p className="text-xs font-medium text-foreground/50 sm:text-sm">I&apos;m here to support your learning journey.</p>
        </div>
        
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg.text} isAi={msg.isAi} />
        ))}

        {isLoading && <ThinkingIndicator />}

        {/* Invisible scroll anchor */}
        <div ref={chatEndRef} />
      </div>
      
      <div className="z-10 border-t-0 bg-card p-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] sm:p-5">
        <PromptChips onSelect={(text) => setInput(text)} disabled={isLoading} />
        
        {attachedFile && (
          <div className="flex items-center gap-2 mb-3 bg-secondary/40 border border-secondary/80 rounded-lg p-2 max-w-sm animate-in fade-in slide-in-from-bottom-2">
            <FileText size={16} className="text-primary" />
            <span className="text-xs font-semibold text-foreground truncate flex-1">{attachedFile.name}</span>
            <button 
              onClick={() => { setAttachedFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
              className="p-1 rounded-full text-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="relative flex items-center bg-secondary/30 rounded-full border-none shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1">
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-secondary hover:text-primary"
            title="Attach PDF"
          >
            <Paperclip size={18} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to explain a concept or attach a PDF..."
            disabled={isLoading}
            className="h-11 min-w-0 flex-1 border-none bg-transparent px-2 text-sm font-medium text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !attachedFile) || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
