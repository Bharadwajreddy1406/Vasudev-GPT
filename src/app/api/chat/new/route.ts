import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createChat, handleUserMessage, generateChatName } from '@/lib/chat-utils';
import type { ChatMessage } from '@/lib/openai-utils';
import { callOpenAI } from '@/lib/openai-utils';
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
    const { message } = await request.json();
    
    // Create a new empty chat (we'll add messages later)
    const chat = await createChat({
      userId: token.id as string,
      name: 'New Divine Conversation', // Default name until first message
    });
    
    // If there's a message, we should process it
    if (message && message.trim()) {
      // Create message array for OpenAI
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
      
      // Call OpenAI
      const aiResponse = await callOpenAI(messages, "chat");
      
      // Save the exchange
      await handleUserMessage({
        userId: token.id as string,
        chatId: chat._id.toString(),
        message,
        aiResponse: aiResponse || "Response from Krishna"
      });
      
      // Generate a meaningful name for the chat
      const generatedName = await generateChatName(message);
      
      // Update the chat name
      const Chat = (await import('@/models/Chat')).default;
      await Chat.findByIdAndUpdate(chat._id, { name: generatedName });
      
      // Update the chat with the name
      chat.name = generatedName;
    }
    
    return NextResponse.json({ 
      success: true, 
      chatId: chat._id.toString(),
      chat: {
        _id: chat._id,
        name: chat.name,
        icon: chat.icon,
        lastModified: chat.lastModified
      }
    });
    
  } catch (error: any) {
    console.error('Error creating new chat:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}