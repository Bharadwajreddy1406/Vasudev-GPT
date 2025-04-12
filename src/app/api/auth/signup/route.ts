import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, username, password, avatar } = await request.json();
    
    // Validate input
    if (!email || !username || !password || !avatar) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      email,
      username,
      password, // Will be hashed by the pre-save hook in the User model
      avatar
    });
    
    await user.save();
    
    // Return success response - user will need to login via NextAuth
    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        redirect: '/login' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}