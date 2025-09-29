import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  FileText, 
  Star, 
  Trash2, 
  Eye,
  Filter,
  Download,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'pdf'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'bookmarked'>('newest');
  const { state, setCurrentAnalysis, toggleBookmark } = useAppContext();
  const navigate = useNavigate();

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = state.history;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.request.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.request.type === filterType);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case 'bookmarked':
        return filtered.sort((a, b) => {
          if (a.isBookmarked && !b.isBookmarked) return -1;
          if (!a.isBookmarked && b.isBookmarked) return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }, [state.history, searchQuery, filterType, sortBy]);

  const handleViewResults = (item: any) => {
    setCurrentAnalysis(item.response);
    navigate('/dashboard/results');
  };

  const stats = {
    total: state.history.length,
    bookmarked: state.history.filter(item => item.isBookmarked).length,
    thisWeek: state.history.filter(item => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.timestamp) > weekAgo;
    }).length,
    textAnalyses: state.history.filter(item => item.request.type === 'text').length,
    pdfAnalyses: state.history.filter(item => item.request.type === 'pdf').length,
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Analysis History
          </h1>
          <p className="text-muted-foreground">
            Review and manage your previous AI analyses
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/analyze')}
          className="btn-hero"
        >
          <FileText className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: BookOpen },
          { label: 'Bookmarked', value: stats.bookmarked, icon: Star },
          { label: 'This Week', value: stats.thisWeek, icon: Calendar },
          { label: 'Text', value: stats.textAnalyses, icon: FileText },
          { label: 'PDF', value: stats.pdfAnalyses, icon: FileText },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your analyses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-40 glass-card">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="pdf">PDF Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-40 glass-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="bookmarked">Bookmarked First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      {filteredAndSortedHistory.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || filterType !== 'all' ? 'No Results Found' : 'No History Yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'Start analyzing content to build your learning history.'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button 
                onClick={() => navigate('/dashboard/analyze')}
                className="btn-hero"
              >
                Start Your First Analysis
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedHistory.map((item) => (
            <Card key={item.id} className="glass-card hover-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={item.request.type === 'pdf' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.request.type.toUpperCase()}
                      </Badge>
                      {item.isBookmarked && (
                        <Badge className="bg-brand-warning/10 text-brand-warning border-brand-warning">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Bookmarked
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 truncate">
                      Analysis #{item.id.slice(-6).toUpperCase()}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.request.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>✨ Analogy</span>
                      <span>📖 Story</span>
                      <span>🎯 Multi-level explanations</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(item.id)}
                      className={`${item.isBookmarked ? 'text-brand-warning' : ''}`}
                    >
                      <Star className={`h-4 w-4 ${item.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResults(item)}
                      className="btn-glass"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}