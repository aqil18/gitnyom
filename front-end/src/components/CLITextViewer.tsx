'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface CliTextViewerProps {
  fileName: string
  fileUrl: string
}

export default function CliTextViewer({ fileName, fileUrl }: CliTextViewerProps) {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = () => {
      try {
        // const response = await fetch(fileUrl)
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`)
        // }
        const text = ""
        setContent(text)
      } catch (e) {
        setError(`Failed to load ${fileName}: ${e instanceof Error ? e.message : String(e)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [fileName, fileUrl])

  return (
    <div className="font-mono text-sm">
      <div className="bg-gray-800 p-2 rounded-t-md">
        <span className="text-green-400">$</span>
        <span className="text-white ml-2">cat {fileName}</span>
      </div>
      <pre className="bg-black text-white p-4 rounded-b-md overflow-x-auto whitespace-pre-wrap">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          content
        )}
      </pre>
    </div>
  )
}

