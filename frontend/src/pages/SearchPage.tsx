import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryBadge } from '@/components/memory/CategoryBadge';
import { useSearch } from '@/hooks/useSearch';
import { getRelativeTime, getImageUrl } from '@/lib/utils';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const { data, isLoading } = useSearch(activeQuery);

  const processSteps = [
    { text: "Understanding your request...", icon: Brain },
    { text: "Searching your memories...", icon: Search },
    { text: "Finding related information...", icon: Sparkles }
  ];

  useEffect(() => {
    if (activeQuery && activeQuery.length > 2) {
      setIsProcessing(true);
      setProcessStep(0);
      
      const timer1 = setTimeout(() => setProcessStep(1), 500);
      const timer2 = setTimeout(() => setProcessStep(2), 1300);
      const timer3 = setTimeout(() => setIsProcessing(false), 1800);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [activeQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && query !== activeQuery) {
      setActiveQuery(query);
      navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
    }
  };

  const suggestions = [
    "Find the restaurant my friend recommended",
    "When does my laptop warranty expire?",
    "Show my Chennai train ticket",
    "How much did I spend on electronics?"
  ];

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your memories..."
            className="h-14 pl-12 rounded-xl text-lg shadow-sm border-2 focus-visible:border-primary"
          />
        </form>
      </div>

      <div className="flex-1">
        {!activeQuery ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Suggestions</h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(suggestion);
                    setActiveQuery(suggestion);
                    navigate(`/search?q=${encodeURIComponent(suggestion)}`, { replace: true });
                  }}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                  <span className="font-medium">{suggestion}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={processStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                {(() => {
                  const Icon = processSteps[processStep].icon;
                  return (
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-8 w-8 animate-pulse" />
                    </div>
                  );
                })()}
                <h3 className="text-xl font-medium text-foreground">{processSteps[processStep].text}</h3>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 h-32 flex gap-4">
                  <div className="h-full w-24 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-5 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.results.length > 0 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {data.results.length} Result{data.results.length !== 1 && 's'}
            </h2>
            <div className="flex flex-col gap-4">
              {data.results.map((result, idx) => (
                <Card 
                  key={idx} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => navigate(`/memory/${result.memory.id}`)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-48 sm:h-auto sm:w-48 bg-muted shrink-0 relative overflow-hidden">
                      <img 
                        src={getImageUrl(result.memory.category, result.memory.thumbnail_path)} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="text-xl font-bold line-clamp-2">{result.memory.title}</h3>
                        <CategoryBadge category={result.memory.category} className="shrink-0" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {result.memory.summary || result.memory.description}
                      </p>
                      
                      <div className="mt-auto space-y-3">
                        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Why this matched</h4>
                          <ul className="space-y-1">
                            {result.matchReasons.map((reason, ridx) => (
                              <li key={ridx} className="text-xs text-foreground flex items-center gap-2">
                                <span className="text-green-500 font-bold">✓</span> {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">
                          Saved {getRelativeTime(result.memory.created_at)}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4 animate-in fade-in">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No memories found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find anything matching "{activeQuery}". Try adjusting your search terms or upload a new memory.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => navigate('/upload')}>
              Upload New Memory
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
