import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully catch cross-origin iframe inspection warnings from outer preview wrappers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event?.message &&
      (event.message.includes('contentWindow') ||
       event.message.includes('Cannot listen to the event from the provided iframe'))
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

