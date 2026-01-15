// src/App.jsx
import React, { useState } from 'react';
// On supprime les imports de logos (vite.svg / react.svg) qui posent problème
// import viteLogo from '/vite.svg' 
import './App.css'; // Tu peux garder ou supprimer si tu veux refaire le CSS

function App() {
  return (
    <div className="App">
      <h1>Mon Générateur de Cartes Home Assistant</h1>
      <p>Le site est en ligne !</p>
      {/* C'est ici qu'on mettra tes composants Editor et Preview plus tard */}
    </div>
  );
}

export default App;