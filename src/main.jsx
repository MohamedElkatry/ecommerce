import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import 'jwt-decode';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 
  <main className="pt-10">
 <StrictMode>
    <App />
  </StrictMode>
  </main>

)
