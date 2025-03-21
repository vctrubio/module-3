import React from 'react';
import ReactDOM from 'react-dom/client';
import { Index } from './components/Index';

// Add the necessary FontAwesome CSS for icons
// You'd need to include this in your HTML or via import if using a package
document.addEventListener('DOMContentLoaded', () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(link);
});

// Add the fade-in animation to stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

// Define global object types for development helpers
declare global {
  interface Window {
    w: any;
    c: any;
  }
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Index />);
