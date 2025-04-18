import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from '@/lib/mongodb';
import Exchange from '@/models/Exchange';
import Chat from '@/models/Chat';
import { Types } from 'mongoose';
import { ResponseType } from '@/types/chat';

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
    const { exchangeId, rating } = await request.json();
    
    if (!exchangeId) {
      return NextResponse.json(
        { success: false, message: 'Exchange ID is required' },
        { status: 400 }
      );
    }
    
    if (!rating || !['good', 'bad'].includes(rating)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be either "good" or "bad"' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the exchange
    const exchange = await Exchange.findById(exchangeId);
    
    if (!exchange) {
      return NextResponse.json(
        { success: false, message: 'Exchange not found' },
        { status: 404 }
      );
    }
    
    // Verify the exchange belongs to a chat owned by this user
    const chat = await Chat.findOne({
      _id: exchange.chatId,
      userId: new Types.ObjectId(token.id as string)
    });
    
    if (!chat) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this exchange' },
        { status: 403 }
      );
    }
    
    // Update the rating
    exchange.response = rating as ResponseType;
    await exchange.save();
    
    return NextResponse.json({ 
      success: true, 
      data: { rating: exchange.response } 
    });
    
  } catch (error: any) {
    console.error('Error updating exchange rating:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}