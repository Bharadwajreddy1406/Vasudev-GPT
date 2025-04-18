import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
    
    // Get the message to generate a name for
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }
    
    // In a real application, this would be a call to an AI service
    // For simplicity, we're implementing a basic naming logic here
    const chatName = await generateChatName(message);
    
    return NextResponse.json({ 
      success: true, 
      name: chatName 
    });
    
  } catch (error: any) {
    console.error('Error generating chat name:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Generate a chat name from the user's message
 * This is a simplified version - in production, use an actual AI service
 */
async function generateChatName(message: string): Promise<string> {
  // Sample system prompt that would be sent to an AI service:
  // const systemPrompt = `Given the following message: "${message}", generate a short, catchy chat name (max 4 words) and return only that text.`;

  // Extract first 2-4 words for the chat name
  const words = message.split(' ');
  const nameWords = words.slice(0, Math.min(4, words.length));
  let name = nameWords.join(' ');
  
  // Add ellipsis if truncated and capitalize first letter
  if (words.length > 4) name += '...';
  name = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Limit to max 30 characters
  return name.length > 30 ? name.substring(0, 27) + '...' : name;
}