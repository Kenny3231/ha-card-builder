import React, { useEffect, useRef, useState } from 'react';

const Preview = ({ type, config, hass }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('🔍 Debug Preview:');
    console.log('- type:', type);
    console.log('- containerRef:', containerRef.current);
    console.log('- config:', config);
    console.log('- hass:', hass);
    console.log('- button-card enregistré ?', customElements.get('button-card'));

    if (!containerRef.current || !config || !hass) {
      console.log('❌ Manque containerRef, config ou hass');
      return;
    }

    // ✅ CORRECTION : Utiliser 'button-card' au lieu de 'custom-button-card'
    const cardTag = type === 'button-card' ? 'button-card' : 'custom-bubble-card';
    
    const isRegistered = customElements.get(cardTag);

    if (!isRegistered) {
      customElements.whenDefined(cardTag).then(() => {
        renderCard(cardTag);
      }).catch(() => {
        setStatus('error');
        setErrorMessage(`Le plugin ${cardTag} n'est pas chargé. Vérifiez le fichier button-card.js dans /public/plugins/`);
      });

      setTimeout(() => {
        if (!customElements.get(cardTag)) {
          setStatus('error');
          setErrorMessage(`TIMEOUT: Impossible de charger ${cardTag}. Le fichier button-card.js est probablement introuvable.`);
        }
      }, 3000);
    } else {
      renderCard(cardTag);
    }

    function renderCard(tag) {
      try {
        const element = document.createElement(tag);
        
        if (typeof element.setConfig !== 'function') {
          throw new Error("La méthode setConfig n'existe pas. Le plugin est mal chargé.");
        }
        
        element.setConfig(config);
        element.hass = hass;
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(element);
        setStatus('success');
      } catch (e) {
        console.error('Erreur lors du rendu:', e);
        setStatus('error');
        setErrorMessage(e.message);
      }
    }

  }, [type, config, hass]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
      
      {status === 'loading' && (
        <div style={{ background: '#1e293b', color: '#94a3b8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          Chargement du plugin button-card...
        </div>
      )}

      {status === 'error' && (
        <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <strong>⚠️ Erreur critique :</strong><br/>
          {errorMessage}<br/>
          <small style={{display:'block', marginTop:'10px', color: '#fff'}}>
            Vérifiez que le fichier <code>/public/plugins/button-card.js</code> existe bien.
          </small>
        </div>
      )}

      <div 
        ref={containerRef} 
        style={{ 
          display: status === 'success' ? 'block' : 'none',
          width: '100%'
        }}
      ></div>
    </div>
  );
};

export default Preview;