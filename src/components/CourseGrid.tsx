import React from 'react';
import { CourseCard } from './CourseCard';
import { BookOpen, Pen, Lightbulb, Globe, Palette, Code } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Modern Philosophy',
    subtitle: 'Exploring contemporary thought',
    progress: 75,
    icon: <Lightbulb size={24} />,
    iconBg: '#D4C4B0'
  },
  {
    id: 2,
    title: 'Creative Writing Masterclass',
    subtitle: 'Craft compelling narratives',
    progress: 40,
    icon: <Pen size={24} />,
    iconBg: '#C9B8A3'
  },
  {
    id: 3,
    title: 'AI Ethics & Society',
    subtitle: 'Technology and moral frameworks',
    progress: 90,
    icon: <Globe size={24} />,
    iconBg: '#BFA992'
  },
  {
    id: 4,
    title: 'Digital Art Fundamentals',
    subtitle: 'Master digital illustration',
    progress: 60,
    icon: <Palette size={24} />,
    iconBg: '#D4C4B0'
  },
  {
    id: 5,
    title: 'Web Development Essentials',
    subtitle: 'Build modern web applications',
    progress: 35,
    icon: <Code size={24} />,
    iconBg: '#C9B8A3'
  },
  {
    id: 6,
    title: 'Advanced Literature',
    subtitle: 'Deep dive into classic texts',
    progress: 80,
    icon: <BookOpen size={24} />,
    iconBg: '#BFA992'
  }
];

export function CourseGrid() {
  return (
    <div>
      <h3 className="text-2xl text-[#4A3F33] mb-6">Resource Hub</h3>
      <div className="grid grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}