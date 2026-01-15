import React, { useEffect, useRef, useState } from 'react';

const Preview = ({ type, config, hass }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDefined, setIsDefined] = useState(false);

  // 1. Gestion du nom du tag (custom-button-card)
  const cardTag = type === 'button-card' ? 'custom-button-card' : `custom-${type}`;

  useEffect(() => {
    const loadScript = async () => {
      // Si déjà chargé, on ne fait rien
      if (customElements.get(cardTag)) {
        setIsDefined(true);
        setStatus('success');
        return;
      }

      console.log(`📦 Chargement du script pour ${cardTag}...`);
      
      const script = document.createElement('script');
      script.type = 'module';
      
      // --- CORRECTION DU CHEMIN ICI ---
      // On récupère le chemin de base (ex: "/" en local, ou "/mon-repo/" sur GitHub)
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
        ? import.meta.env.BASE_URL 
        : `${import.meta.env.BASE_URL}/`;
        
      // On construit l'URL complète
      script.src = `${baseUrl}plugins/${type}.js`;
      
      console.log(`🔍 Tentative de lecture : ${script.src}`); // Regarde ça dans la console F12

      script.onload = () => {
        console.log(`✅ Script ${type}.js téléchargé`);
        customElements.whenDefined(cardTag).then(() => {
          console.log(`✅ Web Component ${cardTag} enregistré`);
          setIsDefined(true);
        });
      };

      script.onerror = () => {
        setStatus('error');
        setErrorMessage(`Impossible de charger le fichier : ${script.src}. Vérifie qu'il est bien dans public/plugins/`);
      };

      document.head.appendChild(script);
    };

    loadScript();
  }, [type, cardTag]);

  // 2. Rendu de la carte
  useEffect(() => {
    // On attend que tout soit prêt (script chargé + ref DOM + config + hass)
    if (!isDefined || !containerRef.current || !config || !hass) return;

    try {
      containerRef.current.innerHTML = '';
      
      const element = document.createElement(cardTag);
      
      // Vérification ultime avant d'appeler setConfig
      if (typeof element.setConfig !== 'function') {
        throw new Error(`Le composant ${cardTag} existe mais n'a pas de méthode setConfig.`);
      }

      element.setConfig(config);
      element.hass = hass;

      containerRef.current.appendChild(element);
      setStatus('success');
      
    } catch (e) {
      console.error(e);
      setStatus('error');
      setErrorMessage(e.message);
    }
  }, [isDefined, config, hass, cardTag]);

  return (
    <div className="preview-wrapper" style={{ width: '100%', minHeight: '200px' }}>
      {status === 'error' && (
        <div style={{ background: '#451a1a', color: '#fca5a5', padding: '15px', borderRadius: '8px', border: '1px solid #7f1d1d' }}>
          <strong>⚠️ Erreur :</strong> {errorMessage}
        </div>
      )}
      
      <div ref={containerRef} style={{ display: status === 'success' ? 'block' : 'none' }}></div>
    </div>
  );
};

export default Preview;