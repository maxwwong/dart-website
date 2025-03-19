import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { MatchHistory } from './pages/MatchHistory';
import { About } from './pages/About';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PlayerManagement } from './pages/admin/PlayerManagement';
import { MatchupManagement } from './pages/admin/MatchupManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <Layout>
                  <MatchHistory />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <Layout>
                  <About />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/players" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <PlayerManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/matchups" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <MatchupManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;