import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  const registerServiceWorker = () => {
    // Construct the service worker URL relative to the document's origin 
    // to prevent cross-origin registration errors.
    const serviceWorkerUrl = new URL('service-worker.js', window.location.origin);
    navigator.serviceWorker.register(serviceWorkerUrl)
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  };

  // The 'load' event might have already passed. To avoid a race condition
  // in some environments where the document is 'complete' but not yet ready
  // for registration, we defer the call slightly.
  if (document.readyState === 'complete') {
    setTimeout(registerServiceWorker, 1);
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