import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Send, Loader2, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { openRouterService } from '@/services/openRouter';
import { useToast } from '@/hooks/use-toast';
import { AnalysisRequest, AnalysisResponse, HistoryItem } from '@/types';

export default function Analyze() {
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { setCurrentAnalysis, addToHistory, setLoading } = useAppContext();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        // For now, we'll just handle text files directly
        if (selectedFile.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            setTextContent(content);
          };
          reader.readAsText(selectedFile);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or text file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async (content: string, type: 'text' | 'pdf') => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please enter some text or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setLoading(true);

    try {
      const analysisRequest: AnalysisRequest = {
        id: Math.random().toString(36).substr(2, 9),
        content,
        type,
        timestamp: new Date(),
      };

      const result = await openRouterService.analyzeContent(content);

      const analysisResponse: AnalysisResponse = {
        id: Math.random().toString(36).substr(2, 9),
        requestId: analysisRequest.id,
        analogy: result.analogy || "Analysis could not generate an analogy.",
        story: result.story || "Analysis could not generate a story.",
        explanations: result.explanations || {
          beginner: "Beginner explanation not available.",
          intermediate: "Intermediate explanation not available.",
          expert: "Expert explanation not available."
        },
        timestamp: new Date(),
      };

      const historyItem: HistoryItem = {
        id: analysisResponse.id,
        request: analysisRequest,
        response: analysisResponse,
        isBookmarked: false,
        timestamp: new Date(),
      };

      setCurrentAnalysis(analysisResponse);
      addToHistory(historyItem);

      toast({
        title: "Analysis Complete!",
        description: "Your content has been analyzed successfully.",
      });

      navigate('/dashboard/results');
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const handleTextAnalyze = () => {
    handleAnalyze(textContent, 'text');
  };

  const handleFileAnalyze = () => {
    if (file && textContent) {
      handleAnalyze(textContent, 'pdf');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 hover-glow">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          AI Content Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Transform complex content into clear, multi-level understanding
        </p>
      </div>

      {/* Analysis Interface */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Input
          </CardTitle>
          <CardDescription>
            Choose how you'd like to input your content for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content to Analyze</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your text here... (articles, research papers, complex explanations, etc.)"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[300px] glass-card"
                />
                <p className="text-sm text-muted-foreground">
                  {textContent.length} characters
                </p>
              </div>
              <Button
                onClick={handleTextAnalyze}
                disabled={isAnalyzing || !textContent.trim()}
                className="w-full btn-hero"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Analyze Content
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Document</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="glass-card"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, TXT (Max 10MB)
                  </p>
                </div>

                {file && (
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Upload className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {textContent && (
                  <div className="space-y-2">
                    <Label>Extracted Content Preview</Label>
                    <Textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="min-h-[200px] glass-card"
                      placeholder="File content will appear here..."
                    />
                  </div>
                )}

                <Button
                  onClick={handleFileAnalyze}
                  disabled={isAnalyzing || !textContent.trim()}
                  className="w-full btn-hero"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Document...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Analyze Document
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card hover-glow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold mb-2">Real-Life Analogies</h3>
            <p className="text-sm text-muted-foreground">
              Complex concepts explained through familiar, everyday comparisons
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-secondary mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold mb-2">Fictional Stories</h3>
            <p className="text-sm text-muted-foreground">
              Engaging narratives that make abstract ideas memorable and fun
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Multi-Level Learning</h3>
            <p className="text-sm text-muted-foreground">
              Beginner, intermediate, and expert explanations for every level
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}