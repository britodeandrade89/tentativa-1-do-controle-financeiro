import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Service Worker Registration ---
// To definitively solve the "InvalidStateError", we decouple the Service Worker
// registration from React's component lifecycle. This code runs as soon as the
// script is loaded and uses the browser's standard 'load' event, which is the
// most reliable moment for registration. It also handles the race condition where
// the 'load' event may have already fired.
if ('serviceWorker' in navigator) {
  const registerServiceWorker = () => {
    // We use an absolute URL to avoid potential origin conflicts.
    const serviceWorkerUrl = new URL('service-worker.js', window.location.origin);
    navigator.serviceWorker.register(serviceWorkerUrl)
      .then(registration => {
        console.log('Service Worker registered successfully with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  };

  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);