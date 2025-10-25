import './App.css'
import { useState } from 'react';
import Register from './pages/register';
import Login from './pages/Login';
import Books from './pages/Books';
import AudioBooks from './pages/AudioBooks';
import Ebooks from './pages/Ebooks';
import Navbar from './components/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);

  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <main className="pt-16 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/audiobooks" element={<AudioBooks />} />
          
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
