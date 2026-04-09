import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { QuickActionButton } from "./QuickActionButton";
import { Send, Calculator, Code, GraduationCap, Briefcase, Lightbulb, BookOpen, MoreHorizontal } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const quickTopics = [
  { label: "Careers with Maths & Science", icon: <Calculator className="w-4 h-4" /> },
  { label: "Skills for Software Development", icon: <Code className="w-4 h-4" /> },
  { label: "Diploma vs. Degree", icon: <GraduationCap className="w-4 h-4" /> },
];

const allTopics = [
  ...quickTopics,
  { label: "Internship Options", icon: <Briefcase className="w-4 h-4" /> },
  { label: "IT Career Paths", icon: <Lightbulb className="w-4 h-4" /> },
  { label: "Understanding Qualifications", icon: <BookOpen className="w-4 h-4" /> },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your BC CourseFinder™ assistant. How can I assist you with planning your IT studies at Belgium Campus?\n\nI can help you with:\n• Exploring IT career paths\n• Understanding qualifications\n• Finding internships and learnerships\n• Comparing diploma and degree options",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call backend API for AI response
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling backend:', error);
      
      // Fallback message if backend is not running
      return "⚠️ I'm having trouble connecting to my AI service. Please make sure:\n\n1. The backend server is running (npm start in the /server folder)\n2. Your Gemini API key is configured in the .env file\n\nIn the meantime, I can still help! Try asking about:\n• IT career paths\n• Diploma vs Degree options\n• Internship opportunities\n• Course information";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Get AI response
    try {
      const aiResponse = await getAIResponse(currentInput);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (topic: string) => {
    setInputValue(topic);
    // Trigger send after setting value
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const topicsToShow = showAllTopics ? allTopics : quickTopics;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">BC CourseFinder™</h1>
        <button 
          onClick={() => setShowAllTopics(!showAllTopics)}
          className="p-2 hover:bg-[#2a4a7f] rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isBot={message.isBot}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">BC</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm max-w-[80%]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {topicsToShow.map((topic, index) => (
            <QuickActionButton
              key={index}
              label={topic.label}
              icon={topic.icon}
              onClick={() => handleQuickAction(topic.label)}
            />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === "" || isLoading}
            className="bg-[#1e3a5f] hover:bg-[#2a4a7f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}