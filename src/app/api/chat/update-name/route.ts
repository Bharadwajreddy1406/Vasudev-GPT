import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function PATCH(request: NextRequest) {
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
    const { chatId, newName } = await request.json();
    
    if (!chatId || !newName || !newName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Chat ID and new name are required' },
        { status: 400 }
      );
    }
    
    // Import Chat model and update the name
    const Chat = (await import('@/models/Chat')).default;
    
    // Find the chat and verify ownership
    const chat = await Chat.findOne({ 
      _id: chatId,
      userId: token.id
    });
    
    if (!chat) {
      return NextResponse.json(
        { success: false, message: 'Chat not found or access denied' },
        { status: 404 }
      );
    }
    
    // Update the chat name
    chat.name = newName.trim();
    await chat.save();
    
    return NextResponse.json({ 
      success: true, 
      chatId,
      newName: chat.name
    });
    
  } catch (error: any) {
    console.error('Error updating chat name:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}