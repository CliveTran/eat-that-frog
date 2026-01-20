import type { Philosophy } from './types';

export const philosophies: Philosophy[] = [
    // Discipline
    {
        id: 'disc-1',
        title: 'The Power of Consistency',
        content: 'Success is the product of daily habits—not once-in-a-lifetime transformations. Small, consistent actions compound over time into extraordinary results.',
        category: 'Discipline',
        author: 'James Clear',
        tags: ['habits', 'consistency', 'compound effect']
    },
    {
        id: 'disc-2',
        title: 'Do It Now',
        content: 'The best time to plant a tree was 20 years ago. The second best time is now. Stop waiting for the perfect moment—it doesn\'t exist. Start where you are, use what you have, do what you can.',
        category: 'Discipline',
        tags: ['action', 'procrastination', 'starting']
    },
    {
        id: 'disc-3',
        title: 'Master Your Morning',
        content: 'How you start your day determines how you live your day. Win the morning, win the day. Create a morning routine that energizes you and sets the tone for productivity.',
        category: 'Discipline',
        tags: ['morning routine', 'habits', 'energy']
    },
    {
        id: 'disc-4',
        title: 'Embrace Discomfort',
        content: 'Growth lives outside your comfort zone. Everything you want is on the other side of fear and discomfort. Do one thing every day that scares you.',
        category: 'Discipline',
        tags: ['growth', 'comfort zone', 'courage']
    },

    // Motivation
    {
        id: 'motiv-1',
        title: 'Your Why',
        content: 'When your "why" is strong enough, the "how" will reveal itself. Connect to your deeper purpose. Motivation fades, but purpose endures.',
        category: 'Motivation',
        author: 'Simon Sinek',
        tags: ['purpose', 'vision', 'meaning']
    },
    {
        id: 'motiv-2',
        title: 'Fall Forward',
        content: 'Failure is not the opposite of success—it\'s part of success. Every setback is a setup for a comeback. Learn from your mistakes and keep moving forward.',
        category: 'Motivation',
        author: 'Denzel Washington',
        tags: ['failure', 'resilience', 'perseverance']
    },
    {
        id: 'motiv-3',
        title: 'The 1% Rule',
        content: 'If you get 1% better each day for a year, you\'ll end up 37 times better. Small improvements compound. Focus on progress, not perfection.',
        category: 'Motivation',
        tags: ['improvement', 'compound', 'progress']
    },
    {
        id: 'motiv-4',
        title: 'Celebrate Small Wins',
        content: 'Progress is progress, no matter how small. Acknowledge every step forward. Small wins fuel momentum and build confidence for bigger challenges.',
        category: 'Motivation',
        tags: ['wins', 'momentum', 'confidence']
    },
    {
        id: 'motiv-5',
        title: 'Future Self',
        content: 'Every decision you make today is a vote for the type of person you wish to become. Ask yourself: "What would my future self thank me for doing today?"',
        category: 'Motivation',
        tags: ['identity', 'decisions', 'future']
    },

    // Mindset
    {
        id: 'mind-1',
        title: 'Growth Mindset',
        content: 'Your abilities are not fixed—they can be developed through dedication and hard work. Believe in your capacity to grow. Intelligence and talent are just starting points.',
        category: 'Mindset',
        author: 'Carol Dweck',
        tags: ['growth', 'learning', 'potential']
    },
    {
        id: 'mind-2',
        title: 'Control the Controllable',
        content: 'Focus on what you can control: your attitude, effort, and response. Let go of everything else. You can\'t control the outcome, but you can control the input.',
        category: 'Mindset',
        tags: ['control', 'stoicism', 'focus']
    },
    {
        id: 'mind-3',
        title: 'Abundance Over Scarcity',
        content: 'There is enough success for everyone. Shift from a scarcity mindset to an abundance mindset. Someone else\'s success doesn\'t diminish yours.',
        category: 'Mindset',
        tags: ['abundance', 'collaboration', 'success']
    },
    {
        id: 'mind-4',
        title: 'Reframe Obstacles',
        content: 'The obstacle is the way. What stands in your path becomes the path itself. Every problem is an opportunity in disguise. Change your perspective, change your reality.',
        category: 'Mindset',
        author: 'Ryan Holiday',
        tags: ['obstacles', 'stoicism', 'perspective']
    },
    {
        id: 'mind-5',
        title: 'Own Your Story',
        content: 'You are not your past. Your history is not your destiny. The stories you tell yourself shape your reality. Rewrite your narrative with empowering beliefs.',
        category: 'Mindset',
        tags: ['identity', 'beliefs', 'narrative']
    },

    // Productivity
    {
        id: 'prod-1',
        title: 'Eat That Frog',
        content: 'If you have to eat a live frog, do it first thing in the morning. Tackle your biggest, most important task before anything else. Everything else will feel easier.',
        category: 'Productivity',
        author: 'Brian Tracy',
        tags: ['priorities', 'focus', 'morning']
    },
    {
        id: 'prod-2',
        title: 'Deep Work',
        content: 'The ability to focus without distraction on a cognitively demanding task is becoming increasingly rare—and increasingly valuable. Protect your attention like it\'s the most precious resource you have.',
        category: 'Productivity',
        author: 'Cal Newport',
        tags: ['focus', 'distraction', 'attention']
    },
    {
        id: 'prod-3',
        title: 'Parkinson\'s Law',
        content: 'Work expands to fill the time available for its completion. Set tight deadlines. Limit your time and watch your efficiency skyrocket.',
        category: 'Productivity',
        tags: ['deadlines', 'efficiency', 'time']
    },
    {
        id: 'prod-4',
        title: 'The Two-Minute Rule',
        content: 'If it takes less than two minutes, do it now. Small tasks pile up and create mental clutter. Clear them immediately and free your mind for bigger work.',
        category: 'Productivity',
        author: 'David Allen',
        tags: ['tasks', 'action', 'clutter']
    },
    {
        id: 'prod-5',
        title: 'Time Blocking',
        content: 'What gets scheduled gets done. Protect your time by blocking it on your calendar. Treat appointments with yourself as seriously as meetings with others.',
        category: 'Productivity',
        tags: ['scheduling', 'calendar', 'time management']
    },
    {
        id: 'prod-6',
        title: 'Single-Tasking',
        content: 'Multitasking is a myth. Your brain can only focus on one thing at a time. Do one thing at a time, and do it with full presence and attention.',
        category: 'Productivity',
        tags: ['focus', 'attention', 'presence']
    },

    // Success
    {
        id: 'succ-1',
        title: 'Define Your Own Success',
        content: 'Don\'t let society define success for you. True success is living in alignment with your values and goals. The only metric that matters is whether you\'re proud of the life you\'re building.',
        category: 'Success',
        tags: ['values', 'goals', 'definition']
    },
    {
        id: 'succ-2',
        title: 'Process Over Results',
        content: 'Fall in love with the process, not the outcome. Results are a byproduct of systems and habits. Focus on building great systems, and the results will follow.',
        category: 'Success',
        tags: ['process', 'systems', 'habits']
    },
    {
        id: 'succ-3',
        title: 'Play the Long Game',
        content: 'Patience beats speed every time. Compounding takes time. Most people overestimate what they can achieve in a year and underestimate what they can achieve in a decade.',
        category: 'Success',
        tags: ['patience', 'long-term', 'compound']
    },
    {
        id: 'succ-4',
        title: 'Learn in Public',
        content: 'Share your journey. Document your progress. Teaching others solidifies your own knowledge and builds your reputation. Build your body of work in public.',
        category: 'Success',
        tags: ['learning', 'sharing', 'reputation']
    },
    {
        id: 'succ-5',
        title: 'Network With Intent',
        content: 'Your network is your net worth. Surround yourself with people who challenge you, inspire you, and push you to grow. You become the average of the five people you spend the most time with.',
        category: 'Success',
        tags: ['network', 'relationships', 'growth']
    },

    // Wisdom
    {
        id: 'wisd-1',
        title: 'Be Present',
        content: 'The present moment is all you ever have. Yesterday is history, tomorrow is a mystery, but today is a gift—that\'s why it\'s called the present. Live fully in the now.',
        category: 'Wisdom',
        tags: ['presence', 'mindfulness', 'now']
    },
    {
        id: 'wisd-2',
        title: 'Health is Wealth',
        content: 'All the success in the world means nothing without your health. Prioritize sleep, nutrition, and movement. You can\'t pour from an empty cup—take care of yourself first.',
        category: 'Wisdom',
        tags: ['health', 'self-care', 'foundation']
    },
    {
        id: 'wisd-3',
        title: 'Gratitude Changes Everything',
        content: 'What you focus on expands. Shift your attention to what you have, not what you lack. Gratitude transforms your experience of life and attracts more blessings.',
        category: 'Wisdom',
        tags: ['gratitude', 'mindfulness', 'abundance']
    },
    {
        id: 'wisd-4',
        title: 'Less is More',
        content: 'Simplicity is the ultimate sophistication. Remove the unnecessary to reveal the essential. The art of living is knowing what to subtract, not what to add.',
        category: 'Wisdom',
        tags: ['simplicity', 'minimalism', 'essentialism']
    },
    {
        id: 'wisd-5',
        title: 'This Too Shall Pass',
        content: 'Nothing lasts forever—neither pain nor pleasure. In difficult times, remember this will pass. In good times, savor the moment. Everything is temporary.',
        category: 'Wisdom',
        tags: ['impermanence', 'perspective', 'acceptance']
    },
    {
        id: 'wisd-6',
        title: 'Seek to Understand',
        content: 'Listen more than you speak. Seek first to understand, then to be understood. True wisdom comes from curiosity and empathy, not from being right.',
        category: 'Wisdom',
        author: 'Stephen Covey',
        tags: ['listening', 'empathy', 'understanding']
    },
];
