import React, { useState } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Star, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Copy,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { textToSpeechService } from '@/services/textToSpeech';
import { useToast } from '@/hooks/use-toast';

export default function Results() {
  const { state, toggleBookmark } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analogy');
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);

  const analysis = state.currentAnalysis;
  const historyItem = analysis ? state.history.find(h => h.response.id === analysis.id) : null;

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Found</h2>
        <p className="text-muted-foreground mb-6">
          You haven't analyzed any content yet.
        </p>
        <Button onClick={() => window.location.href = '/dashboard/analyze'} className="btn-hero">
          Start Analysis
        </Button>
      </div>
    );
  }

  const handleSpeak = async (text: string, section: string) => {
    if (speakingSection === section && textToSpeechService.isSpeaking) {
      textToSpeechService.stop();
      setSpeakingSection(null);
      return;
    }

    try {
      setSpeakingSection(section);
      await textToSpeechService.speak(text);
      setSpeakingSection(null);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Error",
        description: "Could not play audio. Please try again.",
        variant: "destructive",
      });
      setSpeakingSection(null);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const handleBookmark = () => {
    if (historyItem) {
      toggleBookmark(historyItem.id);
      toast({
        title: historyItem.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        description: historyItem.isBookmarked ? 
          "This analysis has been removed from your bookmarks." : 
          "This analysis has been saved to your bookmarks.",
      });
    }
  };

  const SpeechButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSpeak(text, section)}
      className={`speech-btn ${speakingSection === section ? 'bg-primary/20' : ''}`}
    >
      {speakingSection === section && textToSpeechService.isSpeaking ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Analysis Results
          </h1>
          <p className="text-muted-foreground">
            AI-powered explanations for your content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            onClick={handleBookmark}
            className={`btn-glass ${historyItem?.isBookmarked ? 'bg-brand-warning/10 text-brand-warning' : ''}`}
          >
            <Star className={`h-4 w-4 mr-2 ${historyItem?.isBookmarked ? 'fill-current' : ''}`} />
            {historyItem?.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="outline" className="btn-glass">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Original Content */}
      {historyItem && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Original Content
            </CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mr-2">
                {historyItem.request.type.toUpperCase()}
              </Badge>
              Analyzed on {new Date(historyItem.timestamp).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto scrollbar-thin">
              <p className="text-sm whitespace-pre-wrap">
                {historyItem.request.content}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="analogy" className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            Analogy
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            Story
          </TabsTrigger>
          <TabsTrigger value="beginner" className="flex items-center gap-2">
            <span className="text-lg">🟢</span>
            Beginner
          </TabsTrigger>
          <TabsTrigger value="explanations" className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            All Levels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analogy">
          <Card className="ai-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  Real-Life Analogy
                </CardTitle>
                <div className="flex items-center gap-2">
                  <SpeechButton text={analysis.analogy} section="analogy" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(analysis.analogy, 'Analogy')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Understanding through familiar comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.analogy}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story">
          <Card className="ai-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Fictional Story
                </CardTitle>
                <div className="flex items-center gap-2">
                  <SpeechButton text={analysis.story} section="story" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(analysis.story, 'Story')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Learning through engaging narratives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.story}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beginner">
          <Card className="ai-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🟢</span>
                  Beginner Explanation
                </CardTitle>
                <div className="flex items-center gap-2">
                  <SpeechButton text={analysis.explanations.beginner} section="beginner" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(analysis.explanations.beginner, 'Beginner explanation')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Simple and accessible explanation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.explanations.beginner}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explanations">
          <div className="space-y-6">
            {/* Beginner */}
            <Card className="ai-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-green-500">Beginner</Badge>
                    Simple & Clear
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <SpeechButton text={analysis.explanations.beginner} section="beginner-full" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(analysis.explanations.beginner, 'Beginner explanation')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.explanations.beginner}
                </p>
              </CardContent>
            </Card>

            {/* Intermediate */}
            <Card className="ai-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-yellow-500">Intermediate</Badge>
                    Detailed & Structured
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <SpeechButton text={analysis.explanations.intermediate} section="intermediate" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(analysis.explanations.intermediate, 'Intermediate explanation')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.explanations.intermediate}
                </p>
              </CardContent>
            </Card>

            {/* Expert */}
            <Card className="ai-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-red-500">Expert</Badge>
                    Comprehensive & Technical
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <SpeechButton text={analysis.explanations.expert} section="expert" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(analysis.explanations.expert, 'Expert explanation')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis.explanations.expert}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-8">
        <Button 
          onClick={() => window.location.href = '/dashboard/analyze'}
          className="btn-hero"
        >
          <Lightbulb className="mr-2 h-5 w-5" />
          Analyze More Content
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/dashboard/chat'}
          className="btn-glass"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Ask Follow-up Questions
        </Button>
      </div>
    </div>
  );
}