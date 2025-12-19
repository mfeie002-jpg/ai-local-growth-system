import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Bot, User, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const demoConversations = {
  en: [
    { role: 'user' as const, content: 'Hi, I need help with my digital marketing strategy.' },
    { role: 'assistant' as const, content: 'Hello! I\'d love to help. What are your main goals? Are you looking to increase traffic, improve conversions, or build brand awareness?' },
    { role: 'user' as const, content: 'We want more leads from our website but our current campaigns aren\'t working.' },
    { role: 'assistant' as const, content: 'I understand. Let me analyze your situation. Based on what you\'ve shared, I recommend:\n\n1. **SEO Optimization** - to increase organic traffic\n2. **Conversion Rate Optimization** - to turn more visitors into leads\n3. **AI-powered lead qualification** - to prioritize high-value prospects\n\nWould you like a free audit to identify your biggest opportunities?' },
    { role: 'user' as const, content: 'Yes, that sounds great!' },
    { role: 'assistant' as const, content: 'Perfect! I\'ll prepare a comprehensive audit covering your website, SEO, ads, and conversion potential. You\'ll receive actionable insights within 48 hours. 🚀' },
  ],
  de: [
    { role: 'user' as const, content: 'Hallo, ich brauche Hilfe mit meiner digitalen Marketingstrategie.' },
    { role: 'assistant' as const, content: 'Hallo! Ich helfe gerne. Was sind Ihre Hauptziele? Möchten Sie mehr Traffic, bessere Conversions oder Markenbekanntheit aufbauen?' },
    { role: 'user' as const, content: 'Wir wollen mehr Leads von unserer Website, aber unsere aktuellen Kampagnen funktionieren nicht.' },
    { role: 'assistant' as const, content: 'Ich verstehe. Lassen Sie mich Ihre Situation analysieren. Basierend auf dem, was Sie geteilt haben, empfehle ich:\n\n1. **SEO-Optimierung** - um organischen Traffic zu steigern\n2. **Conversion Rate Optimierung** - um mehr Besucher in Leads zu verwandeln\n3. **KI-gestützte Lead-Qualifizierung** - um hochwertige Interessenten zu priorisieren\n\nMöchten Sie ein kostenloses Audit, um Ihre grössten Chancen zu identifizieren?' },
    { role: 'user' as const, content: 'Ja, das klingt super!' },
    { role: 'assistant' as const, content: 'Perfekt! Ich bereite ein umfassendes Audit vor, das Ihre Website, SEO, Ads und Conversion-Potenzial abdeckt. Sie erhalten umsetzbare Insights innerhalb von 48 Stunden. 🚀' },
  ],
};

export function AIChatbotDemo() {
  const { isEnglish } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const conversation = isEnglish ? demoConversations.en : demoConversations.de;

  useEffect(() => {
    // Reset when language changes
    setMessages([]);
    setCurrentIndex(0);
  }, [isEnglish]);

  useEffect(() => {
    if (currentIndex >= conversation.length) return;

    const message = conversation[currentIndex];
    const delay = message.role === 'assistant' ? 1500 : 800;

    const timer = setTimeout(() => {
      if (message.role === 'assistant') {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, message]);
          setIsTyping(false);
          setCurrentIndex(prev => prev + 1);
        }, 1200);
      } else {
        setMessages(prev => [...prev, message]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, conversation]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleRestart = () => {
    setMessages([]);
    setCurrentIndex(0);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Chat Window */}
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-ai/10 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ai flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display">
                {isEnglish ? 'AI Marketing Assistant' : 'KI Marketing Assistent'}
              </h4>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {isEnglish ? 'Online now' : 'Jetzt online'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-ai/10 border border-ai/20">
            <Sparkles className="w-3 h-3 text-ai" />
            <span className="text-xs font-medium text-ai">AI</span>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatRef}
          className="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-ai" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-secondary/50 text-foreground rounded-bl-md'
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-ai" />
              </div>
              <div className="bg-secondary/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Restart prompt */}
          {currentIndex >= conversation.length && !isTyping && (
            <div className="text-center pt-4 animate-fade-in">
              <button
                onClick={handleRestart}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isEnglish ? '↻ Watch demo again' : '↻ Demo nochmal ansehen'}
              </button>
            </div>
          )}
        </div>

        {/* Input (decorative) */}
        <div className="px-4 py-3 border-t border-border/50 bg-card/30">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isEnglish ? 'Type a message...' : 'Nachricht eingeben...'}
              className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              disabled
            />
            <button
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground opacity-50 cursor-not-allowed"
              disabled
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {isEnglish ? 'This is a demo. Get the real experience with a free audit.' : 'Dies ist eine Demo. Erleben Sie es mit einem kostenlosen Audit.'}
          </p>
        </div>
      </div>
    </div>
  );
}