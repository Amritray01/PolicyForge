import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import './index.css';
import './App.css';

const queryClient = new QueryClient();

// Global cursor glow effect listener
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.glow-card, .glow-input');
  for (const card of cards) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  </React.StrictMode>,
);