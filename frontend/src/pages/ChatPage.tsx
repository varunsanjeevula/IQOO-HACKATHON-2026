import { useState, useRef, useEffect } from 'react';
import { Send, Brain, User, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MemoryCard } from '@/components/memory/MemoryCard';

export function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your memory assistant. Ask me anything about your saved memories, documents, or reminders.",
      timestamp: new Date().toISOString()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { mutateAsync: sendMessage, isPending } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSend = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const text = customInput || input;
    if (!text.trim() || isPending) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await sendMessage(text);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I had trouble processing that request. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const suggestions = [
    "When does my warranty expire?",
    "How much did I spend on electronics?",
    "What's due this week?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto w-full relative">
      <header className="p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Memory Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask questions about your data</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            
            <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div 
                className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted rounded-tl-sm text-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              
              {msg.memories && msg.memories.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.memories.map(memory => (
                    <div key={memory.id} className="w-full sm:w-48 transform origin-top-left scale-90">
                      <MemoryCard memory={memory} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1 order-2">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isPending && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center h-[44px]">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4 ml-11">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(undefined, suggestion)}
                className="bg-background border rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your memories..."
            className="pr-12 h-14 rounded-2xl bg-muted border-none"
            disabled={isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 h-10 w-10 rounded-xl"
            disabled={!input.trim() || isPending}
          >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
