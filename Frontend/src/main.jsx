import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // import createRoot
import './index.css';
import { BrowserRouter } from "react-router-dom"; // Ensure this is imported
import App from './App.jsx';

const root = createRoot(document.getElementById('root')); // create the root element
root.render( // use render method on the root element
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
