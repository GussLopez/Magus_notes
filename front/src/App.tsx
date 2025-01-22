import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { DarkModeProvider } from './interfaces/DarkMode';
import Home from './pages/Home';
import Notas from './pages/Notas';
import Perfil from './pages/Perfil';
import CrearNota from './pages/CrearNota';
import EditarNota from './pages/EditarNota';
import Iniciosesion from './pages/Login';
import Soporte from './pages/Soporte';
import Nota from './pages/Nota';
import PasswordReset from "./pages/PasswordReset";
import Nosotros from './pages/Nosotros';
import { useState } from 'react';
import Header from './components/Header';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();

  return (
    <>
      <DarkModeProvider>
      
        {location.pathname !== '/login' && <Header userId={userId} setUserId={setUserId} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil userId={userId}/>} />
          <Route path="/login" element={<Iniciosesion />} />
          <Route path="/notas" element={<Notas userId={userId}/>} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/crearNota" element={<CrearNota userId={userId}/>} />
          <Route path="/notas/editarNota/:id" element={<EditarNota />} />
          <Route path="/notas/nota/:id" element={<Nota />} />
          <Route path="/reset-password" element={<PasswordReset />} />
        </Routes>
      </DarkModeProvider>
    </>
  );
}

export default App;
