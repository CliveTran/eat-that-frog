export type PhilosophyCategory =
    | 'Discipline'
    | 'Motivation'
    | 'Mindset'
    | 'Productivity'
    | 'Success'
    | 'Wisdom';

export interface Philosophy {
    id: string;
    title: string;
    content: string;
    category: PhilosophyCategory;
    author?: string;
    tags: string[];
}
