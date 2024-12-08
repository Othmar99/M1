"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessageList } from "@/components/chat/chat-message-list"
import { ChatMessage } from "@/lib/types/chat"
import { Department } from "@/lib/stores/department-store"
import { defaultAgents } from "@/lib/types/agent"
import { responseGenerator } from "@/lib/ai/response-generator"
import { useChatHistoryStore } from "@/lib/stores/chat-history-store"
import { nanoid } from "nanoid"

interface MeetingChatRoomProps {
  selectedDepartments: Department[]
}

export function MeetingChatRoom({ selectedDepartments }: MeetingChatRoomProps) {
  const meetingId = useRef(nanoid()).current
  const [typingDepartments, setTypingDepartments] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const welcomeMessagesSent = useRef(new Set<string>())
  
  const { 
    getMeetingHistory, 
    addToMeetingHistory 
  } = useChatHistoryStore()

  const messages = getMeetingHistory(meetingId)

  useEffect(() => {
    const sendWelcomeMessages = async () => {
      for (const dept of selectedDepartments) {
        if (!welcomeMessagesSent.current.has(dept.id)) {
          welcomeMessagesSent.current.add(dept.id)
          const agent = defaultAgents[dept.type]
          
          // Random delay between 500ms and 1500ms
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
          
          const welcomeMessage: ChatMessage = {
            id: nanoid(),
            type: 'text',
            content: `Hi! I'm ${agent.name} from ${dept.name}. I'm here to help with the collaboration!`,
            sender: 'agent',
            timestamp: new Date().toISOString(),
            departmentId: dept.id
          }
          
          addToMeetingHistory(meetingId, welcomeMessage)
        }
      }
    }

    if (selectedDepartments.length > 0) {
      sendWelcomeMessages()
    }
  }, [selectedDepartments, meetingId, addToMeetingHistory])

  const handleSendMessage = async (content: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    
    // Add user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      type: 'text',
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    }
    
    addToMeetingHistory(meetingId, userMessage)

    try {
      // Get responses from departments
      for (const dept of selectedDepartments) {
        setTypingDepartments(prev => new Set(prev).add(dept.id))
        
        // Random typing delay between 1-2 seconds
        await new Promise(resolve => 
          setTimeout(resolve, 1000 + Math.random() * 1000)
        )

        const response = await responseGenerator.generateResponse({
          message: content,
          agent: defaultAgents[dept.type],
          department: dept,
          conversationHistory: messages
        })

        if (response) {
          const message: ChatMessage = {
            id: nanoid(),
            type: 'text',
            content: response,
            sender: 'agent',
            timestamp: new Date().toISOString(),
            departmentId: dept.id
          }

          addToMeetingHistory(meetingId, message)
        }
        
        setTypingDepartments(prev => {
          const next = new Set(prev)
          next.delete(dept.id)
          return next
        })

        // Small delay between responses if there are multiple
        if (selectedDepartments.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } finally {
      setIsProcessing(false)
      setTypingDepartments(new Set())
    }
  }

  return (
    <Card className="col-span-full h-[600px] flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Meeting Chat Room</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-[calc(100%-5rem)] overflow-hidden">
        <div className="flex-1 overflow-y-auto mb-4">
          <ChatMessageList
            messages={messages}
            isTyping={typingDepartments.size > 0}
            departmentType={
              typingDepartments.size === 1 
                ? selectedDepartments.find(d => typingDepartments.has(d.id))?.type 
                : undefined
            }
          />
        </div>
        <div className="flex-none">
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={isProcessing}
            placeholder="Type your message to the team..."
          />
        </div>
      </CardContent>
    </Card>
  )
}