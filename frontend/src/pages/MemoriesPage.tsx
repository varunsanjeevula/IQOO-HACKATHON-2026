import { useState } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Receipts', 'Invoices', 'Travel', 'Warranties', 'Medical', 'Tickets', 'Other'];

export function MemoriesPage() {
  const { data: memories, isLoading } = useMemories();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredMemories = memories?.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category.toLowerCase().includes(activeCategory.toLowerCase().replace(/s$/, ''));
    const matchesSearch = search === '' || m.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">Your Memories</h1>
        <p className="text-muted-foreground">{memories?.length || 0} items saved securely.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search titles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-none shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-card border-none shadow-sm gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="bg-card border-none shadow-sm gap-2">
            <SortDesc className="h-4 w-4" /> Sort
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-2 gap-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? 'default' : 'secondary'}
            className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-2xl h-64" />
          ))}
        </div>
      ) : filteredMemories && filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMemories.map(memory => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No memories found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
