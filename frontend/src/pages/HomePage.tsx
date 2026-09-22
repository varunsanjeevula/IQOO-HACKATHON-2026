import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, PlusCircle, Upload, Bell, Calendar, Zap, Plane, Shield, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';
import { useInsights } from '@/hooks/useInsights';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { getRelativeTime } from '@/lib/utils';

const searchPlaceholders = [
  "Find the restaurant I saved last month",
  "Where is my laptop invoice?",
  "Show my train ticket to Chennai",
  "How much did I spend on food?"
];

type VoiceResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type VoiceRecognition = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: VoiceResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

export function HomePage() {
  const navigate = useNavigate();
  const { demoMode } = useAppStore();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  
  const { data: insights, isLoading } = useInsights();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const startVoiceSearch = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: VoiceRecognition;
      webkitSpeechRecognition?: VoiceRecognition;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setVoiceError('');
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setQuery(transcript);
      setIsListening(false);
      if (transcript) navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceError('Voice search could not hear you. Please try again.');
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const getReminderIcon = (title: string) => {
    if (title.toLowerCase().includes('warranty')) return Shield;
    if (title.toLowerCase().includes('train') || title.toLowerCase().includes('flight')) return Plane;
    if (title.toLowerCase().includes('doctor') || title.toLowerCase().includes('health')) return Zap;
    return Bell;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {demoMode && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-sm text-indigo-800 text-center flex items-center justify-center gap-2 md:hidden">
          <Zap className="h-4 w-4" />
          Demo Mode — Exploring with sample data
        </div>
      )}

      <header className="mt-4 md:mt-8 text-center md:text-left space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">Recall</h1>
        <p className="text-lg text-muted-foreground">Your personal memory assistant.</p>
      </header>

      <form onSubmit={handleSearch} className="relative mt-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholders[placeholderIndex]}
            className="h-14 md:h-16 pl-12 pr-12 rounded-2xl border-2 text-base md:text-lg shadow-sm transition-all focus-visible:ring-0 focus-visible:border-primary placeholder:transition-opacity placeholder:duration-500"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            onClick={startVoiceSearch}
            aria-label={isListening ? 'Listening for voice search' : 'Start voice search'}
          >
            <Mic className={`h-5 w-5 ${isListening ? 'text-primary animate-pulse' : ''}`} />
          </button>
        </div>
        {voiceError && <p className="mt-2 text-sm text-destructive">{voiceError}</p>}
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/upload')}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-full">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm">Add Memory</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/upload')}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-full">
            <div className="bg-blue-500/10 p-3 rounded-full text-blue-500">
              <Upload className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm">Upload Document</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={startVoiceSearch}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-full">
            <div className="bg-purple-500/10 p-3 rounded-full text-purple-500">
              <Mic className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm">Voice Search</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/reminders')}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-full">
            <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
              <Bell className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm">Reminders</span>
          </CardContent>
        </Card>
      </div>

      {!isLoading && insights && insights.upcomingReminders.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Important Today
          </h2>
          <div className="flex flex-col gap-3">
            {insights.upcomingReminders.slice(0, 3).map((reminder) => {
              const Icon = getReminderIcon(reminder.title);
              return (
                <Card key={reminder.id} className="border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/memory/${reminder.memory_id}`)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-muted p-2 rounded-full">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground">{reminder.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-bold text-primary">{getRelativeTime(reminder.reminder_date)}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> Due
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {!isLoading && insights && insights.recentlyAdded.length > 0 && (
        <section className="mt-4 pb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Memories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {insights.recentlyAdded.slice(0, 4).map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
