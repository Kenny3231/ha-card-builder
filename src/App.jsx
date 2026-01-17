import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RugbyTemplate from './pages/RugbyTemplate';
import './App.css';

const Home = () => (
  <>
    <main className="main-content home-main">
      <div className="hero-section">
        <h1>🔧 HA Card Builder</h1>
        <p>Créez des cartes Home Assistant personnalisées.</p>
      </div>
      
      <div className="home-grid">
        <Link to="/rugby" className="template-card">
          <div className="template-card-image">
            🏉
          </div>
          <div className="template-card-body">
            <div className="template-card-title">Template Rugby</div>
            <div className="template-card-description">
              Carte personnalisable pour afficher les matchs de rugby depuis un calendrier
            </div>
          </div>
        </Link>
      </div>
    </main>
  </>
);

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rugby" element={<RugbyTemplate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
