import { MemoryCategory } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Receipt, FileText, Shield, FileQuestion, Plane, Ticket, Award, Activity, GraduationCap, Image as ImageIcon, HeartPulse, User } from 'lucide-react';

interface CategoryBadgeProps {
  category: MemoryCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = {
    receipt: { color: 'bg-green-100 text-green-800 border-green-200', icon: Receipt },
    invoice: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FileText },
    warranty: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Shield },
    bill: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FileText },
    travel: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Plane },
    ticket: { color: 'bg-pink-100 text-pink-800 border-pink-200', icon: Ticket },
    certificate: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Award },
    medical: { color: 'bg-red-100 text-red-800 border-red-200', icon: Activity },
    education: { color: 'bg-teal-100 text-teal-800 border-teal-200', icon: GraduationCap },
    screenshot: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: ImageIcon },
    insurance: { color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: HeartPulse },
    personal: { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: User },
    other: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileQuestion },
  };

  const catKey = (category || 'other').toLowerCase() as MemoryCategory;
  const { color, icon: Icon } = config[catKey] || config.other;

  return (
    <Badge variant="outline" className={cn('flex items-center gap-1 font-medium', color, className)}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{category}</span>
    </Badge>
  );
}
