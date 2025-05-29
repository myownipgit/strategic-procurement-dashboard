import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ChatbotPage from './components/ChatbotPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'chatbot':
        return <ChatbotPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const renderNavigation = () => {
    if (currentPage === 'chatbot') {
      // Navigation for chatbot page is handled internally
      return null;
    }

    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setCurrentPage('chatbot')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-medium flex items-center space-x-2"
        >
          <span>🤖</span>
          <span>AI Assistant</span>
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      {renderNavigation()}
      {renderCurrentPage()}
      
      {/* Global Navigation Footer for Chatbot Page */}
      {currentPage === 'chatbot' && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-medium flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;