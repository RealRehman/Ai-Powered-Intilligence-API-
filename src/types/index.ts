export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AnalysisRequest {
  id: string;
  content: string;
  type: 'text' | 'pdf';
  timestamp: Date;
}

export interface AnalysisResponse {
  id: string;
  requestId: string;
  analogy: string;
  story: string;
  explanations: {
    beginner: string;
    intermediate: string;
    expert: string;
  };
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  request: AnalysisRequest;
  response: AnalysisResponse;
  isBookmarked: boolean;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  currentAnalysis: AnalysisResponse | null;
  history: HistoryItem[];
  bookmarks: HistoryItem[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  theme: 'light' | 'dark';
}