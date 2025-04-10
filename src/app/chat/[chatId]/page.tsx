'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatPage from '../page';

export default function ChatPageWithID() {
  // This component just redirects to the main chat component
  // The logic for handling the chat ID is already in the main chat page
  return <ChatPage />;
}