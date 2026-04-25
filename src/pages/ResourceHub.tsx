import React from 'react';
import { Search, Filter, BookOpen, Pen, Lightbulb, Globe, Palette, Code, Video, FileText, Headphones, Image } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: 'Modern Philosophy',
    subtitle: 'Exploring contemporary thought',
    type: 'Course',
    items: 45,
    icon: <Lightbulb size={24} />,
    iconBg: '#D4C4B0'
  },
  {
    id: 2,
    title: 'Creative Writing Masterclass',
    subtitle: 'Craft compelling narratives',
    type: 'Course',
    items: 32,
    icon: <Pen size={24} />,
    iconBg: '#C9B8A3'
  },
  {
    id: 3,
    title: 'AI Ethics & Society',
    subtitle: 'Technology and moral frameworks',
    type: 'Course',
    items: 28,
    icon: <Globe size={24} />,
    iconBg: '#BFA992'
  },
  {
    id: 4,
    title: 'Digital Art Fundamentals',
    subtitle: 'Master digital illustration',
    type: 'Course',
    items: 38,
    icon: <Palette size={24} />,
    iconBg: '#D4C4B0'
  },
  {
    id: 5,
    title: 'Web Development Essentials',
    subtitle: 'Build modern web applications',
    type: 'Course',
    items: 52,
    icon: <Code size={24} />,
    iconBg: '#C9B8A3'
  },
  {
    id: 6,
    title: 'Advanced Literature',
    subtitle: 'Deep dive into classic texts',
    type: 'Course',
    items: 41,
    icon: <BookOpen size={24} />,
    iconBg: '#BFA992'
  },
  {
    id: 7,
    title: 'Video Lectures Library',
    subtitle: 'Recorded sessions and tutorials',
    type: 'Videos',
    items: 127,
    icon: <Video size={24} />,
    iconBg: '#D4C4B0'
  },
  {
    id: 8,
    title: 'Study Materials & Notes',
    subtitle: 'Comprehensive learning resources',
    type: 'Documents',
    items: 234,
    icon: <FileText size={24} />,
    iconBg: '#C9B8A3'
  },
  {
    id: 9,
    title: 'Audio Books & Podcasts',
    subtitle: 'Learn on the go',
    type: 'Audio',
    items: 89,
    icon: <Headphones size={24} />,
    iconBg: '#BFA992'
  },
  {
    id: 10,
    title: 'Infographics & Charts',
    subtitle: 'Visual learning aids',
    type: 'Graphics',
    items: 156,
    icon: <Image size={24} />,
    iconBg: '#D4C4B0'
  }
];

const categories = ['All', 'Courses', 'Videos', 'Documents', 'Audio', 'Graphics'];

export default function ResourceHub() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.type === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl text-[#4A3F33] mb-2">Resource Hub</h2>
        <p className="text-[#6B5844]">Access all your learning materials in one place</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B8B7E]" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FAF7F3] rounded-2xl text-[#4A3F33] placeholder-[#9B8B7E] focus:outline-none focus:ring-2 focus:ring-[#A68968]"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#F5F0EA] rounded-2xl text-[#6B5844] hover:bg-[#E8DFD3] transition-colors">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${selectedCategory === category
                  ? 'bg-[#A68968] text-white'
                  : 'bg-[#F5F0EA] text-[#6B5844] hover:bg-[#E8DFD3]'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#6B5844]"
                style={{ backgroundColor: resource.iconBg }}
              >
                {resource.icon}
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-[#F5F0EA] text-[#6B5844]">
                {resource.type}
              </span>
            </div>

            <h4 className="text-lg text-[#4A3F33] mb-1 group-hover:text-[#A68968] transition-colors">
              {resource.title}
            </h4>
            <p className="text-sm text-[#9B8B7E] mb-4">{resource.subtitle}</p>

            <div className="flex items-center justify-between pt-4 border-t border-[#F5F0EA]">
              <span className="text-sm text-[#6B5844]">{resource.items} items</span>
              <button className="text-sm text-[#A68968] hover:text-[#6B5844] transition-colors">
                View All →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#9B8B7E] text-lg">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
