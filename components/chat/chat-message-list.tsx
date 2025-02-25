"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage } from "@/lib/types/chat"
import { ChatMessageItem } from "./chat-message-item"
import { TypingIndicator } from "./typing-indicator"

interface ChatMessageListProps {
  messages: ChatMessage[]
  isTyping?: boolean
  departmentType: string
}

export function ChatMessageList({ messages, isTyping, departmentType }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<string>("")

  useEffect(() => {
    // Check if we have a new message
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.id !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage?.id || ""
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  // Separate effect for typing indicator
  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isTyping])

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatMessageItem 
              message={message} 
              departmentType={departmentType}
            />
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} className="h-px" aria-hidden="true" />
    </div>
  )
}