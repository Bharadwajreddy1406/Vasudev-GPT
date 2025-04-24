import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handleUserMessage } from '@/lib/chat-utils';
import { callOpenAI } from '@/lib/openai-utils';
import type { ChatMessage } from '@/lib/openai-utils';
import { KRISHNA_SYSTEM_PROMPT } from '@/lib/krishna-prompt';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key" 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get request data
    const { message, chatId, useStructuredResponse } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Step 1: Create the message array for OpenAI
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: KRISHNA_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: message,
      },
    ];
    
    // Step 2: Define schema for structured output if requested
    const schema = useStructuredResponse ? {
      type: "object",
      properties: {
        message: { type: "string" },
        tone: { type: "string" },
        wisdomLevel: { type: "string" },
      },
      required: ["message"],
    } : undefined;
    
    // Step 3: Call OpenAI
    const aiResponse = await callOpenAI(messages, "chat", schema);
    
    // Step 4: Save conversation in database
    const result = await handleUserMessage({
      userId: token.id as string,
      chatId,
      message,
      aiResponse: useStructuredResponse ? aiResponse : aiResponse || "Response from Krishna"
    });
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      aiResponse
    });
    
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}