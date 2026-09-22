import { Memory, MemoryCategory } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryBadge } from './CategoryBadge';
import { getRelativeTime, getImageUrl } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const navigate = useNavigate();
  const imgSrc = getImageUrl(memory.category, memory.thumbnail_path);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-md border-border/60 hover:border-primary/40 rounded-2xl"
      onClick={() => navigate(`/memory/${memory.id}`)}
    >
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        <img 
          src={imgSrc} 
          alt={memory.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <CategoryBadge category={memory.category as MemoryCategory} className="bg-background/90 text-foreground border-none backdrop-blur-sm shadow-sm" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="line-clamp-1 font-bold text-foreground text-base group-hover:text-primary transition-colors">{memory.title}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">{memory.summary || memory.description}</p>
          <p className="mt-2 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
            {getRelativeTime(memory.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
