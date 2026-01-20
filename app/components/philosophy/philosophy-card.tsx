import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { Philosophy } from './types';

interface PhilosophyCardProps {
    philosophy: Philosophy;
    isFavorited: boolean;
    onToggleFavorite: (id: string) => void;
}

const categoryColors: Record<string, string> = {
    Discipline: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    Motivation: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    Mindset: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    Productivity: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    Success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    Wisdom: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
};

const categoryGradients: Record<string, string> = {
    Discipline: 'from-red-500/10 to-red-600/5',
    Motivation: 'from-orange-500/10 to-orange-600/5',
    Mindset: 'from-purple-500/10 to-purple-600/5',
    Productivity: 'from-blue-500/10 to-blue-600/5',
    Success: 'from-green-500/10 to-green-600/5',
    Wisdom: 'from-amber-500/10 to-amber-600/5',
};

export function PhilosophyCard({ philosophy, isFavorited, onToggleFavorite }: PhilosophyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = philosophy.content.length > 180;
    const displayContent = !isExpanded && shouldTruncate
        ? philosophy.content.slice(0, 180) + '...'
        : philosophy.content;

    return (
        <Card className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col">
            {/* Gradient Accent */}
            <div className={cn(
                'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                categoryGradients[philosophy.category]
            )} />

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <Badge
                        variant="outline"
                        className={cn('text-xs font-medium', categoryColors[philosophy.category])}
                    >
                        {philosophy.category}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onToggleFavorite(philosophy.id)}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorited ? (
                            <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                        ) : (
                            <Bookmark className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <CardTitle className="text-lg leading-tight mt-2">{philosophy.title}</CardTitle>
                {philosophy.author && (
                    <p className="text-xs text-muted-foreground italic">— {philosophy.author}</p>
                )}
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
                <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                    {displayContent}
                </p>

                {shouldTruncate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 self-start text-xs px-0 h-auto hover:bg-transparent"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </Button>
                )}

                {philosophy.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
                        {philosophy.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
