"use client"

import OpenAI from 'openai'
import { AgentPersonality } from '@/lib/types/agent'
import { Department } from '@/lib/stores/department-store'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export class OpenAIService {
  private async generateSystemPrompt(agent: AgentPersonality, department: Department) {
    return `You are ${agent.name}, an AI assistant specializing in ${department.name}.

Role: ${agent.role}
Expertise: ${agent.expertise.join(", ")}
Personality Traits: ${agent.traits.join(", ")}
Communication Style: ${agent.communicationStyle}

Department Focus: ${department.description}

Guidelines:
1. Always stay in character and maintain your personality traits
2. Provide specific, actionable insights related to your expertise
3. Be collaborative and reference other departments when relevant
4. Keep responses concise but informative
5. Use your communication style consistently
6. Acknowledge and build upon previous conversation context
7. Only respond when directly addressed or when your expertise is relevant

Remember: You are part of an AI department team. Collaborate with other departments when appropriate but focus on your area of expertise.`
  }

  public async generateResponse(
    message: string,
    agent: AgentPersonality,
    department: Department,
    conversationHistory: { role: 'user' | 'assistant'; content: string; name?: string }[]
  ) {
    const systemPrompt = await this.generateSystemPrompt(agent, department)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 150,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })

      return completion.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      return null
    }
  }
}

export const openAIService = new OpenAIService()