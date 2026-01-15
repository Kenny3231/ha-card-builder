import React, { useEffect, useRef } from 'react';

const Preview = ({ type, config, hass }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Nettoyer l'ancienne carte
    containerRef.current.innerHTML = '';

    // 2. Créer l'élément (ex: 'custom-button-card')
    // Attention: le tag doit correspondre à ce que le plugin JS définit
    const cardTag = type === 'button-card' ? 'custom-button-card' : 'custom-bubble-card';
    
    try {
      const element = document.createElement(cardTag);
      
      // 3. Injecter la config
      element.setConfig(config);
      
      // 4. Injecter le mock HASS
      element.hass = hass;

      // 5. Ajouter au DOM
      containerRef.current.appendChild(element);
    } catch (e) {
      containerRef.current.innerHTML = `<div style="color:red">Erreur config: ${e.message}</div>`;
    }

  }, [type, config, hass]); // Se recharge si ces valeurs changent

  return (
    <div className="preview-container" style={{ padding: '20px', border: '1px solid #333' }}>
      <h3>Aperçu en direct</h3>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Preview;