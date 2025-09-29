import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

const Index = () => {
  const { state } = useAppContext();

  // Redirect based on authentication status
  if (state.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
