'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

// Import our enhanced components
import DivineBackground from '@/components/krishna-ui/DivineBackground';
import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import KrishnaAnimation from '@/components/krishna-ui/KrishnaAnimation';
import ChatSidebar from '@/components/krishna-ui/ChatSidebar';
import ChatMessage from '@/components/krishna-ui/ChatMessage';
import ChatInput from '@/components/krishna-ui/ChatInput';
import Navbar from '@/components/krishna-ui/Navbar';

// Message type definition
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
}

// Chat history interface
interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  icon?: string; // Added icon field for unique icons
}

// Sample dummy conversations for existing chats
const SAMPLE_CONVERSATIONS: Record<string, Message[]> = {
  '1': [
    { id: '11', content: "How do I find inner peace in a chaotic world?", type: 'user' },
    { id: '12', content: "Inner peace comes not from controlling your surroundings, but from mastering your reactions to them. Like a lotus flower that grows in muddy water yet remains unstained, you too can rise above chaos through mindfulness and detachment.", type: 'ai' },
    { id: '13', content: "That's beautiful. How do I practice this detachment?", type: 'user' },
    { id: '14', content: "Begin by observing your thoughts without judgment. When emotions arise, acknowledge them but don't identify with them. Remember - you are not your thoughts, but the awareness behind them. Practice daily meditation, even if just for a few minutes, to create inner stillness.", type: 'ai' }
  ],
  '2': [
    { id: '21', content: "Can you explain what karma yoga means?", type: 'user' },
    { id: '22', content: "Karma Yoga is the path of selfless action. It teaches that you have the right to perform your duties, but not to the fruits of your actions. Work without attachment to results, dedicating your efforts to the divine.", type: 'ai' },
    { id: '23', content: "So it's about doing work without expecting rewards?", type: 'user' },
    { id: '24', content: "Precisely. When you act without selfish motives, your work becomes worship. The secret lies in your intention - are you working for personal gain, or as an offering? This mental shift transforms ordinary actions into spiritual practice.", type: 'ai' }
  ],
  '3': [
    { id: '31', content: "I find it hard to focus during meditation. Any advice?", type: 'user' },
    { id: '32', content: "The restless mind is natural, especially for beginners. Don't fight your thoughts - that creates more disturbance. Instead, gently return your attention to your breath each time it wanders. Consistency matters more than duration.", type: 'ai' },
    { id: '33', content: "Should I use guided meditations or music?", type: 'user' },
    { id: '34', content: "Begin with whatever makes practice easier. Guided meditations can provide structure, while soft music may help settle the mind. Eventually, try moving toward silent meditation, where the subtler realms of consciousness become accessible.", type: 'ai' }
  ]
};

// Example AI responses to simulate Krishna's divine wisdom
const divineResponses = [
  "Remember, you are not this body, you are spirit soul. The body is temporary, but the soul is eternal.",
  "The mind is restless and difficult to control, but it can be conquered through regular practice and detachment.",
  "Whatever happened, happened for the good. Whatever is happening, is happening for the good. Whatever will happen, will also happen for the good.",
  "You have the right to work, but never to the fruit of the work. You should never engage in action for the sake of reward.",
  "Perform your obligatory duty, because action is indeed better than inaction.",
  "Change is the law of the universe. You can be a millionaire or a pauper in an instant.",
  "The soul can never be cut into pieces by any weapon, nor can it be burned by fire, nor moistened by water, nor withered by the wind.",
  "In the unreal there is no being, and in the real there is no non-being.",
  "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place."
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showKrishnaAnimation, setShowKrishnaAnimation] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();

  // Get chatId from URL params
  const chatIdFromURL = params?.chatId as string;

  // Initialize with sample chat history
  useEffect(() => {
    // Create some sample chats with icons
    const sampleChats: Chat[] = [
      {
        id: '1',
        title: 'My spiritual journey',
        lastMessage: 'How do I find inner peace?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        icon: 'lotus'
      },
      {
        id: '2',
        title: 'Bhagavad Gita questions',
        lastMessage: 'Tell me about karma yoga',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        icon: 'book'
      },
      {
        id: '3', 
        title: 'Daily meditation',
        lastMessage: 'How to improve focus during meditation',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        icon: 'sun'
      }
    ];
    
    setChats(sampleChats);
    
    // If there's a chatId in URL, activate that chat
    if (chatIdFromURL && chatIdFromURL !== 'new') {
      setActiveChat(chatIdFromURL);
      
      // Load sample conversation for this chat
      if (SAMPLE_CONVERSATIONS[chatIdFromURL]) {
        setMessages(SAMPLE_CONVERSATIONS[chatIdFromURL]);
        setShowKrishnaAnimation(false);
      }
    } else {
      // Otherwise set first chat as active if no specific route
      setActiveChat('1');
    }
  }, [chatIdFromURL]);

  // Handle user's initial thought from welcome page
  useEffect(() => {
    const userThought = sessionStorage.getItem('userThought');
    
    if (userThought) {
      // Add the user's initial thought
      const initialUserMessage = {
        id: Date.now().toString(),
        content: userThought,
        type: 'user' as const
      };
      
      setMessages([initialUserMessage]);
      setShowKrishnaAnimation(false);
      
      // Clear session storage to avoid repeating the message on refresh
      sessionStorage.removeItem('userThought');
      
      // Simulate AI response with loading
      setLoading(true);
      setTimeout(() => {
        // Random divine response from Krishna
        const initialResponse = {
          id: (Date.now() + 1).toString(),
          content: divineResponses[Math.floor(Math.random() * divineResponses.length)],
          type: 'ai' as const
        };
        
        setMessages(prevMessages => [...prevMessages, initialResponse]);
        setLoading(false);
      }, 2000);
    }
  }, []);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      type: 'user' as const
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Hide Krishna animation if showing
    if (showKrishnaAnimation) {
      setShowKrishnaAnimation(false);
    }
    
    // Simulate AI response with loading
    setLoading(true);
    setTimeout(() => {
      // Random divine response from Krishna
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: divineResponses[Math.floor(Math.random() * divineResponses.length)],
        type: 'ai' as const
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setLoading(false);
      
      // Update the active chat with the latest message
      if (activeChat) {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === activeChat 
            ? { ...chat, lastMessage: content, timestamp: new Date() } 
            : chat
        ));
      }
    }, 2000);
  };
  
  // Handle creating a new chat
  const handleNewChat = () => {
    // Create a new chat
    const newChat = {
      id: Date.now().toString(),
      title: "New Divine Conversation",
      lastMessage: "Begin your conversation...",
      timestamp: new Date(),
      icon: getRandomIcon() // Assign a random icon
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setMessages([]);
    setShowKrishnaAnimation(true);
    
    // Update URL without full refresh
    router.push(`/chat/${newChat.id}`);
  };
  
  // Get a random icon for new chats
  const getRandomIcon = () => {
    const icons = ['lotus', 'star', 'book', 'feather', 'sun', 'moon', 'sparkles', 'heart', 'flame', 'tree'];
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  // Handle selecting a chat
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    
    // Load conversation for this chat if available
    if (SAMPLE_CONVERSATIONS[chatId]) {
      setMessages(SAMPLE_CONVERSATIONS[chatId]);
      setShowKrishnaAnimation(false);
    } else {
      // For new chats that don't have sample conversations
      setMessages([]);
      setShowKrishnaAnimation(true);
    }
  };
  
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-900 flex">
      {/* Divine background layers */}
      <DivineBackground isChat={true} />
      <ParticleBackground intensity={0.5} />
      
      {/* Navbar positioned outside the flex layout for proper fixed positioning */}
      <Navbar />
      
      {/* Chat layout with sidebar and main content */}
      <div className="relative flex w-full h-full z-10 pt-16">
        {/* Chat sidebar */}
        <ChatSidebar 
          chats={chats}
          activeChat={activeChat} 
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Chat content area with increased padding to account for navbar */}
          <div className="flex-1 flex flex-col overflow-hidden pt-8">
            {/* Show welcome message instead of KrishnaAnimation when there are no messages */}
            {showKrishnaAnimation && messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center relative">
                  {/* Divine glow effect behind text */}
                  <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
                  <div className="absolute inset-0 bg-amber-600/5 blur-xl rounded-full animate-pulse" 
                       style={{animationDuration: '4s'}} />
                  
                  <h2 className="font-cinzel text-3xl text-amber-400 mb-6 relative">
                    Begin Your Divine Conversation
                  </h2>
                  <p className="text-amber-200/80 max-w-md mx-auto relative">
                    Ask a question below to start your spiritual journey
                  </p>
                  
                  {/* Animated aura pulses */}
                  <div className="absolute -inset-20 pointer-events-none">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 -ml-16 -mt-16 bg-amber-500/20 rounded-full animate-ping" 
                           style={{animationDuration: '3s'}} />
                      <div className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 bg-amber-400/20 rounded-full animate-ping" 
                           style={{animationDuration: '2.5s'}} />
                      <div className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 bg-amber-300/20 rounded-full animate-ping" 
                           style={{animationDuration: '2s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages container */}
            <div className={`flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-4 space-y-4 ${showKrishnaAnimation && messages.length === 0 ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id}
                    type={message.type}
                    content={message.content}
                    isLatest={message.type === 'ai' && index === messages.length - 1}
                  />
                ))}
                
                {/* Loading indicator when AI is "typing" */}
                {loading && (
                  <motion.div
                    className="mb-4 max-w-[80%] mr-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col space-y-2 p-4 rounded-xl bg-maroon/30 border border-amber-600/50 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-xs text-amber-300/70 font-cinzel">Krishna is contemplating...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input area */}
            <div className="px-4 md:px-8 lg:px-16 py-4 border-t border-amber-500/20 bg-slate-900/40 backdrop-blur-sm">
              <ChatInput 
                onSend={handleSendMessage} 
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}