import { useState, useEffect, useMemo } from 'react';
import type { Route } from './+types/philosophy';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { Brain, Search, Shuffle, Sparkles } from 'lucide-react';
import { PhilosophyCard } from '~/components/philosophy/philosophy-card';
import { LessonOfTheDay } from '~/components/philosophy/lesson-of-the-day';
import { philosophies } from '~/components/philosophy/philosophy-data';
import type { PhilosophyCategory } from '~/components/philosophy/types';
import { cn } from '~/lib/utils';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'Philosophy - Leap' },
        { name: 'description', content: 'Life lessons to enhance discipline, motivation, and mindset.' },
    ];
}

const categories: (PhilosophyCategory | 'All')[] = [
    'All',
    'Discipline',
    'Motivation',
    'Mindset',
    'Productivity',
    'Success',
    'Wisdom',
];

// Get lesson of the day based on current date (deterministic)
function getDailyLesson() {
    const today = new Date();
    // Create a seed from the current date (YYYYMMDD format)
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    // Use modulo to get a deterministic index
    const index = seed % philosophies.length;
    return philosophies[index];
}

export default function Philosophy() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PhilosophyCategory | 'All'>('All');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [randomHighlight, setRandomHighlight] = useState<string | null>(null);
    const dailyLesson = useMemo(() => getDailyLesson(), []);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('leap-philosophy-favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load favorites:', e);
            }
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('leap-philosophy-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleToggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const handleRandomLesson = () => {
        const randomIndex = Math.floor(Math.random() * philosophies.length);
        const randomId = philosophies[randomIndex].id;
        setRandomHighlight(randomId);

        // Scroll to the card
        setTimeout(() => {
            const element = document.getElementById(`philosophy-${randomId}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Remove highlight after 3 seconds
        setTimeout(() => {
            setRandomHighlight(null);
        }, 3000);
    };

    // Filter philosophies
    const filteredPhilosophies = useMemo(() => {
        return philosophies.filter(p => {
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesSearch = searchQuery === '' ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Sort: favorites first, then by category
    const sortedPhilosophies = useMemo(() => {
        return [...filteredPhilosophies].sort((a, b) => {
            const aFav = favorites.includes(a.id);
            const bFav = favorites.includes(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });
    }, [filteredPhilosophies, favorites]);

    return (
        <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            Philosophy
                        </h1>
                        <p className="text-muted-foreground">
                            Timeless wisdom to guide your journey. Keep these principles close to build discipline, motivation, and a winning mindset.
                        </p>
                    </div>
                    <Button onClick={handleRandomLesson} variant="outline" className="gap-2 shrink-0">
                        <Shuffle className="h-4 w-4" />
                        Random Lesson
                    </Button>
                </div>
            </div>

            {/* Lesson of the Day */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Today's Focus</h2>
                    <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
                </div>
                <LessonOfTheDay
                    lesson={dailyLesson}
                    isFavorited={favorites.includes(dailyLesson.id)}
                    onToggleFavorite={handleToggleFavorite}
                />
            </div>

            <Separator className="my-8" />

            {/* Browse Section Header */}
            <div>
                <h2 className="text-xl font-semibold mb-1">Explore More Wisdom</h2>
                <p className="text-sm text-muted-foreground">
                    Browse our full collection of life lessons
                </p>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search lessons, authors, or tags..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-sm"
                        >
                            {category}
                            {category !== 'All' && (
                                <span className="ml-1.5 opacity-60">
                                    ({philosophies.filter(p => p.category === category).length})
                                </span>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            {favorites.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>You have {favorites.length} favorite {favorites.length === 1 ? 'lesson' : 'lessons'}</span>
                </div>
            )}

            {/* Philosophy Grid */}
            {sortedPhilosophies.length === 0 ? (
                <div className="text-center py-20 border-2 dashed rounded-xl">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No lessons found</h3>
                    <p className="text-muted-foreground mt-1">
                        Try adjusting your search or filter
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedPhilosophies.map(philosophy => (
                        <div
                            key={philosophy.id}
                            id={`philosophy-${philosophy.id}`}
                            className={cn(
                                'transition-all duration-500',
                                randomHighlight === philosophy.id && 'ring-2 ring-primary ring-offset-4 ring-offset-background rounded-lg'
                            )}
                        >
                            <PhilosophyCard
                                philosophy={philosophy}
                                isFavorited={favorites.includes(philosophy.id)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
