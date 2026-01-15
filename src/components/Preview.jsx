import React, { useEffect, useRef, useState } from 'react';

const Preview = ({ type, config, hass }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading, error, success
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!containerRef.current) return;

    const cardTag = type === 'button-card' ? 'button-card' : 'custom-bubble-card';
    
    // 1. Vérifier si le Custom Element est enregistré dans le navigateur
    const isRegistered = customElements.get(cardTag);

    if (!isRegistered) {
      // Si pas enregistré, on attend un peu (max 2 secondes)
      customElements.whenDefined(cardTag).then(() => {
        renderCard(cardTag);
      }).catch(() => {
        setStatus('error');
        setErrorMessage(`Le plugin ${cardTag} n'est pas chargé. Vérifie le fichier index.html.`);
      });

      // Timeout de sécurité si le fichier JS est 404
      setTimeout(() => {
        if (!customElements.get(cardTag)) {
          setStatus('error');
          setErrorMessage(`TIMEOUT: Impossible de charger ${cardTag}. Le fichier .js est probablement introuvable (Erreur 404).`);
        }
      }, 2000);
    } else {
      renderCard(cardTag);
    }

    function renderCard(tag) {
      try {
        const element = document.createElement(tag);
        // Sécurité critique
        if (typeof element.setConfig !== 'function') {
          throw new Error("La méthode setConfig n'existe pas. Le plugin est mal chargé.");
        }
        
        element.setConfig(config);
        element.hass = hass;
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(element);
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setErrorMessage(e.message);
      }
    }

  }, [type, config, hass]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      
      {/* Affichage des erreurs si ça plante */}
      {status === 'error' && (
        <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '15px', borderRadius: '8px', maxWidth: '300px', textAlign: 'center' }}>
          <strong>Erreur critique :</strong><br/>
          {errorMessage}<br/>
          <small style={{display:'block', marginTop:'10px', color: '#fff'}}>
            Vérifie que le fichier <code>/public/plugins/button-card.js</code> existe bien dans ton projet.
          </small>
        </div>
      )}

      {/* Zone de rendu */}
      <div ref={containerRef} style={{ display: status === 'success' ? 'block' : 'none' }}></div>
    </div>
  );
};

export default Preview;