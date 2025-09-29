import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  History, 
  Bookmark, 
  TrendingUp,
  Clock,
  Star,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const stats = [
    {
      title: 'Total Analyses',
      value: state.history.length,
      icon: Brain,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10'
    },
    {
      title: 'Bookmarked',
      value: state.bookmarks.length,
      icon: Star,
      color: 'text-brand-warning',
      bgColor: 'bg-brand-warning/10'
    },
    {
      title: 'This Week',
      value: state.history.filter(item => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(item.timestamp) > weekAgo;
      }).length,
      icon: TrendingUp,
      color: 'text-brand-success',
      bgColor: 'bg-brand-success/10'
    },
    {
      title: 'Recent Sessions',
      value: state.history.filter(item => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(item.timestamp) > dayAgo;
      }).length,
      icon: Clock,
      color: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary/10'
    }
  ];

  const quickActions = [
    {
      title: 'New Analysis',
      description: 'Analyze text or upload a PDF for AI-powered explanations',
      icon: FileText,
      color: 'bg-gradient-primary',
      action: () => navigate('/dashboard/analyze')
    },
    {
      title: 'Start Chat',
      description: 'Ask questions and get instant AI responses',
      icon: MessageSquare,
      color: 'bg-gradient-secondary',
      action: () => navigate('/dashboard/chat')
    },
    {
      title: 'View History',
      description: 'Browse your previous analyses and explanations',
      icon: History,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => navigate('/dashboard/history')
    },
    {
      title: 'Bookmarks',
      description: 'Access your saved favorite explanations',
      icon: Bookmark,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      action: () => navigate('/dashboard/bookmarks')
    }
  ];

  const recentItems = state.history.slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Welcome back, {state.user?.name}!
        </h1>
        <p className="text-xl text-muted-foreground">
          Transform complex concepts into clear understanding with AI
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card hover-glow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="glass-card hover-glow cursor-pointer group transition-all duration-300 hover:scale-105"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button className="w-full btn-glass group-hover:bg-white/20">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/history')}
              className="btn-glass"
            >
              View All
            </Button>
          </div>
          <div className="grid gap-4">
            {recentItems.map((item) => (
              <Card key={item.id} className="glass-card hover-glow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {item.request.content.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()} • 
                        {item.request.type.toUpperCase()}
                        {item.isBookmarked && ' • ⭐ Bookmarked'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Set current analysis and navigate to results
                        navigate('/dashboard/results');
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {state.history.length === 0 && (
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started with AI Learning</CardTitle>
            <CardDescription className="text-lg">
              Ready to transform complex content into clear understanding?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="text-4xl mb-2">📝</div>
                <h3 className="font-semibold">1. Input Content</h3>
                <p className="text-sm text-muted-foreground">
                  Paste text or upload a PDF document
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="font-semibold">2. AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get analogies, stories, and multi-level explanations
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold">3. Learn & Save</h3>
                <p className="text-sm text-muted-foreground">
                  Bookmark favorites and track your learning
                </p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="btn-hero"
              onClick={() => navigate('/dashboard/analyze')}
            >
              Start Your First Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}