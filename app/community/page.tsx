'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Clock, User } from 'lucide-react';

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  location: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  category: 'resolved' | 'pending' | 'update';
}

const communityPosts: CommunityPost[] = [
  {
    id: 1,
    author: 'Priya Sharma',
    avatar: 'PS',
    timestamp: '2 hours ago',
    location: 'Sector 18, Noida',
    content: 'Great news! The pothole on Main Street has been fixed. Thanks to everyone who reported it. Our community efforts really work! 🎉',
    image: '/placeholder-fixed-road.jpg',
    likes: 24,
    comments: 8,
    category: 'resolved'
  },
  {
    id: 2,
    author: 'Amit Kumar',
    avatar: 'AK',
    timestamp: '5 hours ago',
    location: 'Park Avenue, Delhi',
    content: 'Street light has been flickering for 3 days now. Reported it through the app. Hoping for a quick resolution as it\'s affecting evening walkers.',
    likes: 12,
    comments: 5,
    category: 'pending'
  },
  {
    id: 3,
    author: 'Municipal Corporation',
    avatar: 'MC',
    timestamp: '1 day ago',
    location: 'City Wide',
    content: 'Weekly update: We resolved 45 civic issues this week including 12 potholes, 8 street light repairs, and 25 waste management concerns. Thank you for your active participation!',
    likes: 89,
    comments: 23,
    category: 'update'
  },
  {
    id: 4,
    author: 'Sneha Gupta',
    avatar: 'SG',
    timestamp: '2 days ago',
    location: 'Green Park, Delhi',
    content: 'Overflowing garbage bin near the park entrance. It\'s becoming a health hazard. Rats and stray dogs are making it worse. Please help!',
    image: '/placeholder-garbage.jpg',
    likes: 31,
    comments: 12,
    category: 'pending'
  }
];

export default function Community() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const filteredPosts = communityPosts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.category === activeFilter;
  });

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Stay connected with your neighborhood</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All Posts' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'pending', label: 'Pending' },
            { key: 'update', label: 'Updates' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeFilter === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Community Stats */}
        <div className="bg-card rounded-lg p-4 border mb-6">
          <h3 className="font-semibold mb-3">Community Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">127</div>
              <div className="text-xs text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">43</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1.2K</div>
              <div className="text-xs text-muted-foreground">Active Citizens</div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-card rounded-lg p-4 border">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{post.author}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-sm mb-3">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-3">
                  <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    📷 Image: {post.image}
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    likedPosts.has(post.id) 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Button */}
        <button className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center text-2xl">
          +
        </button>
      </div>
    </div>
  );
}