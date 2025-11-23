import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import Login from './components/Login.tsx';
import Screens from './components/Screens.tsx';
import Playlists from './components/Playlists.tsx';
import Navigation from './components/Navigation.tsx';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/screens" />} />
        <Route path="/screens" element={
          <ProtectedRoute>
            <Screens />
          </ProtectedRoute>
        } />
        <Route path="/playlists" element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/screens" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;