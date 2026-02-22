import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAiSettings } from '../hooks/useQueries';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const { data: aiSettings } = useGetAiSettings();

  useEffect(() => {
    const hasVisited = localStorage.getItem('chatGreetingShown');
    if (!hasVisited && aiSettings) {
      setShowGreeting(true);
      localStorage.setItem('chatGreetingShown', 'true');
      setTimeout(() => setShowGreeting(false), 5000);
    }
  }, [aiSettings]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && aiSettings) {
      setMessages([
        {
          id: '1',
          text: aiSettings.initialGreeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, aiSettings]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response (in production, this would call Salesforce Agentforce API)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm currently being integrated with Salesforce Agentforce. In the meantime, please use the contact form to reach out.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const avatarUrl = aiSettings?.avatarImage?.getDirectURL() || '/assets/generated/ai-assistant-avatar.dim_200x200.png';
  const botName = aiSettings?.botName || 'AI Assistant';

  return (
    <>
      {/* Greeting Popup */}
      {showGreeting && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-in-right">
          <div className="bg-card border border-border rounded-2xl shadow-card-hover p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <img src={avatarUrl} alt={botName} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{botName}</p>
                <p className="text-sm text-muted-foreground">
                  {aiSettings?.initialGreeting}{' '}
                  <span className="inline-block animate-wave">👋</span>
                </p>
              </div>
              <button onClick={() => setShowGreeting(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="bg-card border border-border rounded-2xl shadow-card-hover w-96 h-[500px] flex flex-col animate-scale-in">
            {/* Header */}
            <div className="gradient-primary p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={avatarUrl} alt={botName} className="w-10 h-10 rounded-full border-2 border-white" />
                <div>
                  <h3 className="font-semibold text-white">{botName}</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-white/80">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" className="shrink-0">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="w-14 h-14 rounded-full shadow-glow-md hover:shadow-glow-lg transition-all"
          >
            <MessageCircle size={24} />
          </Button>
        )}
      </div>
    </>
  );
}
