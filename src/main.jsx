import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.jsx';
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
)
