import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

// Configure axios defaults
axios.defaults.baseURL = 'https://klickks-assignment-ihpd.onrender.com/api';
axios.defaults.withCredentials = true;

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/check-auth');
      setIsAuthenticated(response.data.isAuthenticated);
      setUser(response.data.user || null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Navigation component
  const Navigation = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg p-1 shadow-md">
        <button
          onClick={() => setCurrentPage('login')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            currentPage === 'login'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentPage('register')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            currentPage === 'register'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome
            </h1>
            <p className="text-gray-600">
              Please {currentPage === 'login' ? 'sign in to your account' : 'create your account'}
            </p>
          </div>
          
          <Navigation />
          
          {currentPage === 'login' && (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentPage('register')}
            />
          )}
          
          {currentPage === 'register' && (
            <Register 
              onRegisterSuccess={() => setCurrentPage('login')}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;