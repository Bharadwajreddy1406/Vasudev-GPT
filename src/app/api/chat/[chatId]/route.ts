import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { callOpenAI } from '@/lib/openai-utils';
import type { ChatMessage } from '@/lib/openai-utils';
import { getChatExchanges } from '@/lib/chat-utils';
import type { Types } from 'mongoose';
import { KRISHNA_SYSTEM_PROMPT } from '@/lib/krishna-prompt';

export async function GET(request: Request, context : any) {
  const { chatId } = context.params;
  try {
    // Verify authentication
    const token = await getToken({ 
      req: request as NextRequest, 
      secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key" 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Access the chatId safely
    if (!chatId) {
      return NextResponse.json(
        { success: false, message: 'Chat ID is required' },
        { status: 400 }
      );
    }
    
    // Get messages for the specified chat
    const exchanges = await getChatExchanges(chatId);
    
    // Format the exchanges for client
    const formattedExchanges = exchanges.map(exchange => ({
      id: (exchange._id as Types.ObjectId).toString(),
      messages: [
        {
          id: `user_${exchange._id}`,
          content: exchange.userMessage,
          type: 'user'
        },
        {
          id: `ai_${exchange._id}`,
          content: exchange.aiResponse,
          type: 'ai'
        }
      ],
      timestamp: exchange.createdAt,
      isFavorite: exchange.isFavorite
    }));
    
    return NextResponse.json({ 
      success: true, 
      exchanges: formattedExchanges
    });
    
  } catch (error: any) {
    console.error('Error getting chat messages:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context : any) {
  const { chatId } = context.params;
  try {
    // Verify authentication
    const token = await getToken({ 
      req: request as NextRequest, 
      secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key" 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Access the chatId safely
    if (!chatId) {
      return NextResponse.json(
        { success: false, message: 'Chat ID is required' },
        { status: 400 }
      );
    }
    
    // Get request data
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get recent exchanges to build conversation context
    const recentExchanges = await getChatExchanges(chatId, 3); // Get last 3 exchanges for context
    
    // Build the conversation history for OpenAI
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: KRISHNA_SYSTEM_PROMPT,
      }
    ];
    
    // Add recent exchanges to conversation context (from oldest to newest)
    recentExchanges.reverse().forEach(exchange => {
      messages.push({ role: "user", content: exchange.userMessage });
      messages.push({ role: "assistant", content: exchange.aiResponse });
    });
    
    // Add the current message
    messages.push({ role: "user", content: message });
    
    // Call OpenAI with conversation history
    const aiResponse = await callOpenAI(messages, "chat");
    
    // Save the exchange to the database
    const { handleUserMessage } = await import('@/lib/chat-utils');
    const result = await handleUserMessage({
      userId: token.id as string,
      chatId,
      message,
      aiResponse: aiResponse || "Response from Krishna"
    });
    
    return NextResponse.json({ 
      success: true, 
      exchange: {
        id: result.exchange._id.toString(),
        userMessage: message,
        aiResponse
      }
    });
    
  } catch (error: any) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}