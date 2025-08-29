import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')!).render(
<BrowserRouter>
 <GoogleOAuthProvider clientId={clientId!}>
<App />
</GoogleOAuthProvider>
</BrowserRouter>
    

)
