import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import ChatPage from '@/components/ChatPage';
import BlogPage from '@/components/BlogPage';
import ArticlePage from '@/components/ArticlePage';
import AboutPage from '@/components/AboutPage';
import HelpPage from '@/components/HelpPage';
import { AppProvider } from '@/components/AppContext';
import { GlobalModals } from '@/components/GlobalModals';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ChatPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
        <GlobalModals />
      </BrowserRouter>
    </AppProvider>
  );
}
