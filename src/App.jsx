import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RugbyTemplate from './pages/RugbyTemplate';
import './App.css';

// Une page d'accueil simple
const Home = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>Bibliothèque de Templates HA</h1>
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
      
      {/* Carte "Lien" vers la page Rugby */}
      <Link to="/rugby" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ 
          background: '#222', width: '200px', height: '150px', 
          borderRadius: '12px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', cursor: 'pointer', border: '1px solid #444' 
        }}>
          <h3>🏉 Template Rugby</h3>
        </div>
      </Link>

    </div>
  </div>
);

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <nav style={{ padding: '15px', background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Accueil</Link>
        <Link to="/rugby" style={{ color: '#aaa', textDecoration: 'none' }}>Rugby</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rugby" element={<RugbyTemplate />} />
      </Routes>
    </Router>
  );
}

export default App;