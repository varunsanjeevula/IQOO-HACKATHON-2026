import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays > 7 && diffDays <= 30) return `In ${Math.floor(diffDays / 7)} weeks`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  
  return formatDate(dateStr);
}

const defaultImages: Record<string, string> = {
  invoice: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
  receipt: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
  warranty: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  bill: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  ticket: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  certificate: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  medical: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
  screenshot: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  insurance: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80',
};

export function getImageUrl(category?: string, path?: string | null): string {
  const catKey = (category || 'other').toLowerCase();
  if (!path) {
    return defaultImages[catKey] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80';
  }
  if (path.startsWith('http')) {
    return path;
  }
  if (path.startsWith('/uploads')) {
    return `http://localhost:3001${path}`;
  }
  return defaultImages[catKey] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80';
}
