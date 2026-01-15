import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/main.css'
// import App from './App.tsx'
import InputPrice from './components/InputPrice.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InputPrice />
  </StrictMode>,
)
