'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react';

interface HistoryItem {
  id: number;
  title: string;
  category: string;
  location: string;
  dateReported: string;
  status: 'resolved' | 'in-progress' | 'rejected';
  description: string;
  image?: string;
  updatedAt: string;
  resolvedAt?: string;
  priority: 'high' | 'medium' | 'low';
}

const historyData: HistoryItem[] = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    category: 'Road Issues',
    location: 'Main Street, Sector 15',
    dateReported: '2024-01-15',
    status: 'resolved',
    description: 'Large pothole causing traffic issues and vehicle damage',
    image: '/placeholder-pothole.jpg',
    updatedAt: '2024-01-18',
    resolvedAt: '2024-01-18',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Broken Street Light',
    category: 'Street Lighting',
    location: 'Park Avenue, Sector 12',
    dateReported: '2024-01-20',
    status: 'in-progress',
    description: 'Street light not working, creating safety concerns at night',
    updatedAt: '2024-01-22',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Overflowing Garbage Bin',
    category: 'Waste Management',
    location: 'Green Park, Sector 18',
    dateReported: '2024-01-25',
    status: 'resolved',
    description: 'Garbage bin consistently overflowing, attracting pests',
    image: '/placeholder-garbage.jpg',
    updatedAt: '2024-01-26',
    resolvedAt: '2024-01-26',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'Broken Traffic Signal',
    category: 'Traffic Management',
    location: 'Central Square Intersection',
    dateReported: '2024-01-30',
    status: 'rejected',
    description: 'Traffic signal not functioning properly during peak hours',
    updatedAt: '2024-02-01',
    priority: 'high'
  },
  {
    id: 5,
    title: 'Damaged Bus Stop Shelter',
    category: 'Public Infrastructure',
    location: 'Metro Station Road',
    dateReported: '2024-02-05',
    status: 'in-progress',
    description: 'Bus stop shelter damaged by storm, needs repair',
    image: '/placeholder-bus-stop.jpg',
    updatedAt: '2024-02-06',
    priority: 'low'
  }
];

export default function History() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = historyData.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getStats = () => {
    const total = historyData.length;
    const resolved = historyData.filter(item => item.status === 'resolved').length;
    const inProgress = historyData.filter(item => item.status === 'in-progress').length;
    const rejected = historyData.filter(item => item.status === 'rejected').length;

    return { total, resolved, inProgress, rejected };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Report History</h1>
          <p className="text-muted-foreground">Track your civic contributions</p>
        </div>

        {/* Statistics Overview */}
        <div className="bg-card rounded-lg p-4 border mb-6">
          <h3 className="font-semibold mb-3">Your Impact Summary</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'rejected', label: 'Rejected' }
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

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.map(item => (
            <div key={item.id} className={`bg-card rounded-lg p-4 border border-l-4 ${getPriorityColor(item.priority)}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status.replace('-', ' ')}
                </div>
              </div>

              {/* Location and Date */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.dateReported).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

              {/* Image Placeholder */}
              {item.image && (
                <div className="mb-3">
                  <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                    📷 {item.image}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reported:</span>
                  <span>{new Date(item.dateReported).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
                {item.resolvedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resolved:</span>
                    <span className="text-green-600">{new Date(item.resolvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
                {item.status === 'in-progress' && (
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs">
                    Follow Up
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground text-sm">
              {activeFilter === 'all' 
                ? "You haven't reported any issues yet." 
                : `No ${activeFilter.replace('-', ' ')} reports found.`}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-4 w-full max-w-sm max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{selectedItem.title}</h2>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {selectedItem.category}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {selectedItem.location}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    selectedItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedItem.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedItem.priority}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-muted-foreground">{selectedItem.description}</p>
                </div>
                
                {selectedItem.image && (
                  <div>
                    <span className="font-medium">Image:</span>
                    <div className="mt-1 w-full h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      📷 {selectedItem.image}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}