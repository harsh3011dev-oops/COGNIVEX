"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

interface QuestionCardProps {
  question: string
  options: string[]
  contextText?: string
  onSubmit: (selectedIndex: number) => void
}

export function QuestionCard({ question, options, contextText, onSubmit }: QuestionCardProps) {
  const [selected, setSelected] = React.useState<number | null>(null)

  return (
    <div className="w-full max-w-3xl mx-auto">
      {contextText && (
        <div className="mb-6 bg-orange-50/50 border border-orange-100 p-6 rounded-xl text-gray-700 text-sm leading-relaxed relative">
          <div className="absolute top-0 right-0 px-3 py-1 bg-white border-b border-l border-orange-100 text-[10px] font-bold text-orange-400 rounded-bl-lg uppercase tracking-wider">
            Critical Analysis
          </div>
          {contextText}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-8">{question}</h2>

      <div className="space-y-3 mb-8">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`w-full flex items-start p-4 rounded-xl border text-left transition-all ${
              selected === idx 
                ? "border-primary bg-orange-50 shadow-sm" 
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center mr-4 text-xs font-bold transition-colors ${
              selected === idx ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {String.fromCharCode(65 + idx)}
            </div>
            <span className={`text-sm pt-0.5 ${selected === idx ? "text-gray-900 font-medium" : "text-gray-600"}`}>
              {option}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => selected !== null && onSubmit(selected)}
          disabled={selected === null}
          className="px-8 shadow-sm"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  )
}
