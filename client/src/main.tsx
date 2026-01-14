import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Upload from './components/Upload.tsx'
import InputPrice from './components/InputPrice.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Upload /> */}
    <InputPrice />
  </StrictMode>,
)
