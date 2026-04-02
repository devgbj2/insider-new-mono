import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from './components/ui/tooltip';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
    <Toaster position='bottom-right' />
  </StrictMode>,
)
