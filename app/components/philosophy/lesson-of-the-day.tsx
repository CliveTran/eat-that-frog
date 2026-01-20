import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Bookmark, BookmarkCheck, Calendar } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { Philosophy } from './types';

interface LessonOfTheDayProps {
    lesson: Philosophy;
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
    Discipline: 'from-red-500 via-red-600 to-orange-500',
    Motivation: 'from-orange-500 via-amber-500 to-yellow-500',
    Mindset: 'from-purple-500 via-violet-500 to-indigo-500',
    Productivity: 'from-blue-500 via-cyan-500 to-teal-500',
    Success: 'from-green-500 via-emerald-500 to-teal-500',
    Wisdom: 'from-amber-500 via-yellow-500 to-orange-400',
};

export function LessonOfTheDay({ lesson, isFavorited, onToggleFavorite }: LessonOfTheDayProps) {
    return (
        <div className="relative group">
            {/* Gradient background blur effect */}
            <div
                className={cn(
                    'absolute -inset-1 bg-gradient-to-r rounded-2xl opacity-30 group-hover:opacity-40 blur transition duration-500',
                    categoryGradients[lesson.category]
                )}
            />

            <Card className="relative border-2 shadow-xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Lesson of the Day</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => onToggleFavorite(lesson.id)}
                            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {isFavorited ? (
                                <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                            ) : (
                                <Bookmark className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    <div className="flex items-start gap-3">
                        <Badge
                            variant="outline"
                            className={cn('text-sm font-semibold px-3 py-1', categoryColors[lesson.category])}
                        >
                            {lesson.category}
                        </Badge>
                    </div>

                    <CardTitle className="text-2xl md:text-3xl leading-tight mt-4">
                        {lesson.title}
                    </CardTitle>

                    {lesson.author && (
                        <p className="text-sm text-muted-foreground italic mt-2">— {lesson.author}</p>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                        {lesson.content}
                    </p>

                    {lesson.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            {lesson.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Decorative gradient line */}
                    <div className={cn(
                        'h-1 rounded-full bg-gradient-to-r',
                        categoryGradients[lesson.category]
                    )} />
                </CardContent>
            </Card>
        </div>
    );
}
