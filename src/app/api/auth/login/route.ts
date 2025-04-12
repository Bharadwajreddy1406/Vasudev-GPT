import { NextRequest, NextResponse } from 'next/server';
import { signIn } from "next-auth/react";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // This route is now just for handling custom login forms
    // The actual authentication is handled by NextAuth
    return NextResponse.json({
      success: true,
      message: 'Use the NextAuth signin endpoint for authentication'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}