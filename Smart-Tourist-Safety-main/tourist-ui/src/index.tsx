import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Verify from './Verify';   // verification component
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Registration */}
        <Route path="/" element={<App />} />

        {/* Verification */}
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();