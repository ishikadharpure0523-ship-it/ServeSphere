import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// Mock blog posts data
const BLOG_POSTS = [
  {
    id: 1,
    title: 'How Technology is Transforming NGO Operations in India',
    slug: 'technology-transforming-ngo-operations',
    excerpt: 'Discover how digital platforms are helping NGOs reach more beneficiaries, manage volunteers efficiently, and maintain transparency with donors.',
    thumbnail: 'bg-gradient-to-br from-teal to-teal-dark',
    category: 'Technology',
    date: '2026-01-15',
    readTime: '5 min read',
    author: 'Priya Sharma',
  },
  {
    id: 2,
    title: 'The Impact of Volunteer Work on Personal Growth',
    slug: 'volunteer-work-personal-growth',
    excerpt: 'Learn how volunteering not only helps communities but also develops crucial life skills, builds networks, and enhances career prospects.',
    thumbnail: 'bg-gradient-to-br from-amber to-amber-dark',
    category: 'Volunteering',
    date: '2026-01-12',
    readTime: '4 min read',
    author: 'Arjun Kulkarni',
  },
  {
    id: 3,
    title: 'Transparency in Donations: Why It Matters',
    slug: 'transparency-in-donations',
    excerpt: 'Understanding the importance of donation tracking and how blockchain technology is revolutionizing trust in charitable giving.',
    thumbnail: 'bg-gradient-to-br from-coral to-red-500',
    category: 'Donations',
    date: '2026-01-10',
    readTime: '6 min read',
    author: 'Sunita Mehta',
  },
  {
    id: 4,
    title: 'Building Trust: How NGOs Can Improve Their Credibility',
    slug: 'building-trust-ngo-credibility',
    excerpt: 'Practical strategies for NGOs to build and maintain trust with volunteers, donors, and the communities they serve.',
    thumbnail: 'bg-gradient-to-br from-teal-dark to-ink',
    category: 'NGO Management',
    date: '2026-01-08',
    readTime: '7 min read',
    author: 'Rahul Verma',
  },
  {
    id: 5,
    title: 'Success Story: How One Volunteer Changed 100 Lives',
    slug: 'volunteer-success-story',
    excerpt: 'An inspiring journey of a volunteer who started with teaching one child and ended up creating an education movement in rural Maharashtra.',
    thumbnail: 'bg-gradient-to-br from-amber-dark to-orange-600',
    category: 'Success Stories',
    date: '2026-01-05',
    readTime: '8 min read',
    author: 'Meera Patel',
  },
  {
    id: 6,
    title: 'Understanding the UN Sustainable Development Goals',
    slug: 'understanding-sdgs',
    excerpt: 'A comprehensive guide to the 17 SDGs and how your volunteer work or donations contribute to global development targets.',
    thumbnail: 'bg-gradient-to-br from-teal to-blue-600',
    category: 'Education',
    date: '2026-01-03',
    readTime: '10 min read',
    author: 'Dr. Anjali Singh',
  },
];

const CATEGORIES = ['All', 'Technology', 'Volunteering', 'Donations', 'NGO Management', 'Success Stories', 'Education'];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-sand">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal via-teal-dark to-ink text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Our Blog</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Stories, insights, and updates from the world of social impact
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-teal text-white shadow-lg shadow-teal/20'
                      : 'bg-white text-muted border border-gray-200 hover:border-teal hover:text-teal'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center py-20"
            >
              <p className="text-muted text-lg">No articles found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map(post => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <div className={`h-48 ${post.thumbnail} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-ink">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl text-ink mb-3 group-hover:text-teal transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-muted">By {post.author}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-teal text-sm font-semibold hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
