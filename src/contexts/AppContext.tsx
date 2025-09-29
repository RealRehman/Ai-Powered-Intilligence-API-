import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, HistoryItem, AnalysisResponse, ChatMessage, User } from '@/types';

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setCurrentAnalysis: (analysis: AnalysisResponse | null) => void;
  addToHistory: (item: HistoryItem) => void;
  toggleBookmark: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: AnalysisResponse | null }
  | { type: 'ADD_TO_HISTORY'; payload: HistoryItem }
  | { type: 'TOGGLE_BOOKMARK'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INIT_STATE'; payload: Partial<AppState> };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      return { ...state, user: null, currentAnalysis: null, chatMessages: [] };
    
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history.slice(0, 49)] // Keep last 50
      };
    
    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        history: state.history.map(item =>
          item.id === action.payload
            ? { ...item, isBookmarked: !item.isBookmarked }
            : item
        ),
        bookmarks: state.history.find(item => item.id === action.payload)?.isBookmarked
          ? state.bookmarks.filter(item => item.id !== action.payload)
          : [...state.bookmarks, state.history.find(item => item.id === action.payload)!]
      };
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    
    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] };
    
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'INIT_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const initialState: AppState = {
  user: null,
  currentAnalysis: null,
  history: [],
  bookmarks: [],
  chatMessages: [],
  isLoading: false,
  theme: 'light'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on init
  useEffect(() => {
    const savedState = localStorage.getItem('aiEducationPlatform');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'INIT_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }

    // Check for theme preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      dispatch({ type: 'TOGGLE_THEME' });
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      history: state.history,
      bookmarks: state.bookmarks,
      theme: state.theme
    };
    localStorage.setItem('aiEducationPlatform', JSON.stringify(stateToSave));
    localStorage.setItem('theme', state.theme);
    
    // Update document class
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.user, state.history, state.bookmarks, state.theme]);

  const contextValue: AppContextType = {
    state,
    login: (user) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    setCurrentAnalysis: (analysis) => dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis }),
    addToHistory: (item) => dispatch({ type: 'ADD_TO_HISTORY', payload: item }),
    toggleBookmark: (id) => dispatch({ type: 'TOGGLE_BOOKMARK', payload: id }),
    addChatMessage: (message) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message }),
    clearChat: () => dispatch({ type: 'CLEAR_CHAT' }),
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}