import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Tag, 
  Trash2, 
  Bell, 
  Share, 
  Network, 
  Check, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryBadge } from '@/components/memory/CategoryBadge';
import { useMemory, useRelatedMemories } from '@/hooks/useMemories';
import { formatDate, getImageUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { MemoryCategory } from '@/types';

export function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: memory, isLoading, isError } = useMemory(id || '');
  const { data: relatedMemories } = useRelatedMemories(id || '');

  const [reminderSet, setReminderSet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !memory) {
    return (
      <div className="p-4 md:p-8 text-center mt-20 max-w-md mx-auto">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Brain className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Memory Not Found</h2>
        <p className="text-muted-foreground mb-6">This memory might have been deleted or moved.</p>
        <Button onClick={() => navigate('/memories')}>Back to Memories</Button>
      </div>
    );
  }

  const handleSetReminder = async (dateStr?: string, titleStr?: string) => {
    const targetDate = dateStr || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const reminderTitle = titleStr || `Follow up: ${memory.title}`;
    
    await api.createReminder({
      memory_id: memory.id,
      title: reminderTitle,
      description: `Automated reminder from ${memory.title}`,
      reminder_date: targetDate,
    });
    
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 4000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this memory?')) {
      setIsDeleting(true);
      await api.deleteMemory(memory.id);
      navigate('/memories', { replace: true });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const relationshipLabels: Record<string, { label: string; icon: string; color: string }> = {
    same_product: { label: 'Same Product', icon: '💻', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    related_product: { label: 'Related Item', icon: '🔗', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    same_trip: { label: 'Same Journey', icon: '✈️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    same_category: { label: 'Related Category', icon: '📂', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  const displayImage = getImageUrl(memory.category, memory.thumbnail_path);

  return (
    <div className="pb-24">
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-md p-4 border-b md:hidden">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            {copied ? <Check className="h-5 w-5 text-green-600" /> : <Share className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Visual Preview */}
        <div className="space-y-6">
          <div className="hidden md:flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share className="h-4 w-4" />}
                {copied ? 'Copied Link' : 'Share'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting} className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/80 bg-muted shadow-md aspect-[4/3] md:aspect-[3/4] relative group">
            <img 
              src={displayImage} 
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block mb-1">Original Record</span>
              <p className="font-bold text-lg leading-tight line-clamp-1">{memory.title}</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction & Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <CategoryBadge category={memory.category as MemoryCategory} />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Captured {formatDate(memory.created_at)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{memory.title}</h1>
          </div>

          {/* AI Summary Card */}
          {memory.summary && (
            <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-primary text-xs uppercase tracking-wider font-bold">
                  <Brain className="h-4 w-4" /> AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium leading-relaxed text-foreground/90">
                  {memory.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Smart Reminder Suggestion Banner */}
          {(() => {
            const rawDates = memory.ai_analysis?.importantDates;
            const firstDateItem = rawDates && rawDates.length > 0 ? rawDates[0] : null;
            const firstDateStr = typeof firstDateItem === 'string' ? firstDateItem : (firstDateItem as any)?.date;

            if (!firstDateStr) return null;

            return (
              <Card className="border-amber-200 bg-amber-50/70 shadow-none rounded-2xl">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                      <Bell className="h-4 w-4 text-amber-600" /> Smart Reminder Detected
                    </h3>
                    <p className="text-xs text-amber-800 mt-1">
                      Important date: <span className="font-semibold">{formatDate(firstDateStr)}</span>
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleSetReminder(
                      firstDateStr,
                      `Reminder: ${memory.title}`
                    )}
                    disabled={reminderSet}
                    className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 text-xs rounded-xl"
                  >
                    {reminderSet ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Reminder Set!
                      </>
                    ) : (
                      'Set Reminder'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })()}

          {/* Extracted Entities */}
          {memory.ai_analysis?.entities && memory.ai_analysis.entities.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                <Tag className="h-4 w-4" /> Extracted Entities
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {memory.ai_analysis.entities.map((entity: any, idx: number) => (
                  <div key={idx} className="bg-card border rounded-xl p-3 shadow-xs">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-0.5">
                      {entity.name || entity.type}
                    </span>
                    <span className="font-bold text-sm text-foreground break-words">
                      {entity.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contextual Connections / Related Memories Engine */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Network className="h-4 w-4 text-primary" /> Contextual Connections ({relatedMemories?.length || 0})
            </h3>

            {relatedMemories && relatedMemories.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {relatedMemories.map((rel: any) => {
                  const relBadge = relationshipLabels[rel.relationship_type] || {
                    label: 'Related Record',
                    icon: '🔗',
                    color: 'bg-gray-100 text-gray-700 border-gray-200'
                  };
                  return (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/memory/${rel.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/40 hover:border-primary/40 transition-all cursor-pointer group"
                    >
                      <img 
                        src={getImageUrl(rel.category, rel.thumbnail_path)} 
                        alt="" 
                        className="h-12 w-12 rounded-lg object-cover bg-muted shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${relBadge.color}`}>
                            {relBadge.icon} {relBadge.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {Math.round((rel.confidence || 0.85) * 100)}% match
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                          {rel.title}
                        </h4>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic bg-muted/40 p-3 rounded-xl">
                No connected records linked yet. Recall automatically maps relationships when related documents are added.
              </p>
            )}
          </div>

          {/* Keywords */}
          {memory.ai_analysis?.keywords && memory.ai_analysis.keywords.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Index Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {memory.ai_analysis.keywords.map((kw: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="capitalize text-xs font-medium bg-muted/80">
                    <Sparkles className="h-2.5 w-2.5 mr-1 text-primary" /> {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
