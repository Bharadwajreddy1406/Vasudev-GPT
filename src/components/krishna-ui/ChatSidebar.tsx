'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  MessageSquareIcon,
  StarIcon,
  BookOpenIcon, 
  FeatherIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  HeartIcon,
  FlameIcon,
  Loader2Icon,
  CheckIcon,
  XIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  icon?: string; // Optional icon identifier
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onUpdateChatName?: (chatId: string, newName: string) => void; // New prop for updating chat name
  isLoading?: boolean;
}

// Map of possible icons for chats
const CHAT_ICONS = {
  'lotus': MessageSquareIcon,
  'star': StarIcon,
  'book': BookOpenIcon,
  'feather': FeatherIcon,
  'sun': SunIcon,
  'moon': MoonIcon,
  'sparkles': SparklesIcon,
  'heart': HeartIcon,
  'flame': FlameIcon,
  'tree': MessageSquareIcon
};

export default function ChatSidebar({ chats, activeChat, onChatSelect, onNewChat, onUpdateChatName, isLoading = false }: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // Update isMobile state based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Auto-collapse on mobile, but only on first load or when transitioning to mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-focus input when editing is enabled
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingChatId]);

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editInputRef.current && !editInputRef.current.contains(event.target as Node)) {
        setEditingChatId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get appropriate icon component for a chat
  const getChatIcon = (chat: Chat) => {
    // If chat has a predefined icon, use it
    if (chat.icon && CHAT_ICONS[chat.icon as keyof typeof CHAT_ICONS]) {
      const IconComponent = CHAT_ICONS[chat.icon as keyof typeof CHAT_ICONS];
      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
    }
    
    // Otherwise assign one based on chat ID (consistent mapping)
    const iconKeys = Object.keys(CHAT_ICONS);
    const iconKey = iconKeys[parseInt(chat.id) % iconKeys.length];
    const IconComponent = CHAT_ICONS[iconKey as keyof typeof CHAT_ICONS];
    
    return <IconComponent className="h-4 w-4 flex-shrink-0" />;
  };

  // Handle chat selection with routing
  const handleChatSelect = (chatId: string) => {
    // Don't navigate if we're in edit mode
    if (editingChatId) return;
    
    router.push(`/chat/${chatId}`);
    onChatSelect(chatId);
  };

  // Handle double click to start editing
  const handleDoubleClick = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    if (isCollapsed) return; // Don't allow editing in collapsed mode
    
    setEditingChatId(chat.id);
    setEditedName(chat.title);
  };

  // Save the edited chat name
  const saveChatName = async () => {
    if (!editingChatId || !editedName.trim()) {
      setEditingChatId(null);
      return;
    }

    try {
      setIsUpdating(true);
      
      const response = await fetch('/api/chat/update-name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: editingChatId,
          newName: editedName.trim()
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the local state with the new name
        chats = chats.map(chat => 
          chat.id === editingChatId 
            ? { ...chat, title: data.newName } 
            : chat
        );
        
        toast.success('Chat name updated');
        if (onUpdateChatName) {
          onUpdateChatName(editingChatId, editedName.trim());
        }
      } else {
        toast.error(data.message || 'Failed to update chat name');
        // Revert to original name if update failed
      }
    } catch (error) {
      console.error('Error updating chat name:', error);
      toast.error('Failed to update chat name');
    } finally {
      setIsUpdating(false);
      setEditingChatId(null);
    }
  };

  // Handle keyboard input during editing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveChatName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingChatId(null);
    }
  };

  return (
    <>      {/* Toggle button for mobile */}
      {isMobile && (
        <motion.button
          className="fixed left-2 top-16 z-30 rounded-full bg-maroon/80 border border-amber-500/40 p-2 shadow-lg backdrop-blur-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
        >
          {isCollapsed ? <ChevronRightIcon className="text-amber-400 h-4 w-4" /> : <ChevronLeftIcon className="text-amber-400 h-4 w-4" />}
        </motion.button>
      )}        <motion.div
        className={`bg-slate-900/60 mt-1 backdrop-blur-md border-r border-amber-500/20 h-full flex flex-col z-20 overflow-hidden fixed md:relative`}
        initial={{ width: isMobile ? 0 : 280 }}
        animate={{ 
          width: isCollapsed ? (isMobile ? 0 : 60) : 280,
          boxShadow: "0 0 10px rgba(245, 158, 11, 0.1)"
        }}
        transition={{ duration: 0.2, ease: "easeOut" }} // Faster, smoother transition
      >
        {/* Header with New Chat button */}
        <div className="p-3 border-b border-amber-500/20">
          <motion.button
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 transition-colors"
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="h-4 w-4" />
            {!isCollapsed && <span className="font-cinzel">New Chat</span>}
          </motion.button>
        </div>
        
        {/* Chat list with loading and empty states */}
        <div className="flex-1 overflow-y-auto py-2 scroll-smooth">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center h-32">
              <Loader2Icon className="h-5 w-5 text-amber-300 animate-spin mb-2" />
              {!isCollapsed && (
                <p className="text-xs text-amber-300/70">Loading conversations...</p>
              )}
            </div>
          ) : chats.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-32 px-4">
              {!isCollapsed && (
                <>
                  <MessageSquareIcon className="h-5 w-5 text-amber-300/50 mb-2" />
                  <p className="text-xs text-center text-amber-300/70">No conversations yet. Start a new divine dialogue.</p>
                </>
              )}
            </div>
          ) : (
            // Chat list
            <AnimatePresence>              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }} // Faster animation for better responsiveness
                  className={`relative cursor-pointer my-1 mx-1`}
                  onClick={() => handleChatSelect(chat.id)}
                  onDoubleClick={(e) => handleDoubleClick(chat, e)}
                  whileHover={{ 
                    scale: 1.01, // Reduced scale for subtler effect
                    transition: { duration: 0.15 } // Faster response
                  }}
                >                  {/* Selection indicator */}
                  {activeChat === chat.id && (
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400 rounded-full"
                      layoutId="activeChat"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        boxShadow: "0 0 6px 1px rgba(245, 158, 11, 0.3)" // Reduced shadow for subtler effect
                      }}
                      transition={{ duration: 0.2 }} // Faster animation
                    />
                  )}
                  
                  {/* Chat item content */}
                  <div 
                    className={`flex items-center px-3 py-3 rounded-md ${
                      activeChat === chat.id 
                        ? 'bg-amber-800/20 text-amber-200 shadow-inner shadow-amber-500/10'
                        : 'text-amber-200/80 hover:bg-amber-600/10' 
                    }`}
                  >
                    {/* Dynamic icon based on chat */}
                    <div className={`
                      flex-shrink-0
                      ${activeChat === chat.id 
                        ? 'text-amber-400 animate-pulse' 
                        : 'text-amber-300/70'
                      }
                    `}>
                      {getChatIcon(chat)}
                    </div>
                    
                    {!isCollapsed && (
                      <div className="ml-3 overflow-hidden flex-1">
                        {editingChatId === chat.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full text-sm bg-slate-800/80 border border-amber-500/30 text-amber-200 rounded-sm px-2 py-0.5 focus:outline-none focus:border-amber-500/70"
                              placeholder="Enter chat name"
                              disabled={isUpdating}
                            />
                            <div className="flex space-x-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveChatName();
                                }}
                                className="text-green-400 hover:text-green-300"
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <CheckIcon className="h-3.5 w-3.5" />}
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingChatId(null);
                                }}
                                className="text-red-400 hover:text-red-300"
                                disabled={isUpdating}
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium truncate" title="Double-click to edit">{chat.title}</p>
                            <p className="text-xs text-amber-200/50 truncate">
                              {chat.lastMessage}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        {/* Footer with collapse button (desktop only) */}
        {!isMobile && (
          <div className="p-3 border-t border-amber-500/20">
            <button
              className="w-full flex items-center justify-center gap-1 py-2 text-amber-300/60 hover:text-amber-300 transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeftIcon className="h-5 w-5" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}