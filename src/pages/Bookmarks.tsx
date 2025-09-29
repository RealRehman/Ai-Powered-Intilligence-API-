import React, { useState } from 'react';
import { Star, Search, Calendar, Eye, StarOff, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Bookmarks() {
  const [searchQuery, setSearchQuery] = useState('');
  const { state, setCurrentAnalysis, toggleBookmark } = useAppContext();
  const navigate = useNavigate();

  const bookmarkedItems = state.history.filter(item => item.isBookmarked);
  
  const filteredBookmarks = searchQuery
    ? bookmarkedItems.filter(item =>
        item.request.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookmarkedItems;

  const handleViewResults = (item: any) => {
    setCurrentAnalysis(item.response);
    navigate('/dashboard/results');
  };

  const handleRemoveBookmark = (itemId: string) => {
    toggleBookmark(itemId);
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            <Star className="inline h-8 w-8 mr-2 text-brand-warning fill-current" />
            Bookmarks
          </h1>
          <p className="text-muted-foreground">
            Your saved favorite analyses and explanations
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-3 text-brand-warning fill-current" />
            <p className="text-3xl font-bold mb-1">{bookmarkedItems.length}</p>
            <p className="text-sm text-muted-foreground">Total Bookmarks</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-primary" />
            <p className="text-3xl font-bold mb-1">
              {bookmarkedItems.filter(item => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(item.timestamp) > weekAgo;
              }).length}
            </p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-brand-secondary" />
            <p className="text-3xl font-bold mb-1">
              {Math.round((bookmarkedItems.length / Math.max(state.history.length, 1)) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Bookmark Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      {bookmarkedItems.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">
              {bookmarkedItems.length === 0 ? '⭐' : '🔍'}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {bookmarkedItems.length === 0 
                ? 'No Bookmarks Yet' 
                : 'No Results Found'
              }
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {bookmarkedItems.length === 0 
                ? 'Bookmark your favorite analyses to quickly access them later. Click the star icon on any analysis to save it here.'
                : 'Try adjusting your search terms to find the bookmarks you\'re looking for.'
              }
            </p>
            {bookmarkedItems.length === 0 && (
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/dashboard/analyze')}
                  className="btn-hero"
                >
                  Start Analyzing Content
                </Button>
                <p className="text-sm text-muted-foreground">
                  Or browse your <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate('/dashboard/history')}
                  >
                    analysis history
                  </Button> to bookmark existing analyses
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookmarks.map((item) => (
            <Card key={item.id} className="glass-card hover-glow border-brand-warning/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-brand-warning fill-current" />
                      <Badge 
                        variant={item.request.type === 'pdf' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.request.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Bookmarked on {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 truncate">
                      Analysis #{item.id.slice(-6).toUpperCase()}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.request.content}
                    </p>
                    
                    {/* Preview of analysis results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🔍</span>
                            <span className="text-xs font-medium">Analogy</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.response.analogy.substring(0, 80)}...
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📚</span>
                            <span className="text-xs font-medium">Story</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.response.story.substring(0, 80)}...
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🎯</span>
                            <span className="text-xs font-medium">Multi-level</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            Beginner, intermediate & expert explanations
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBookmark(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <StarOff className="h-4 w-4" />
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

      {/* Tips */}
      {bookmarkedItems.length > 0 && (
        <Card className="glass-card border-brand-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Bookmark Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📱 Quick Access</h4>
                <p className="text-muted-foreground">
                  Bookmark analyses you want to reference frequently for easy access from any device.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔄 Stay Organized</h4>
                <p className="text-muted-foreground">
                  Use bookmarks to create your personal library of the most valuable explanations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}