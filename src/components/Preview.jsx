import React, { useEffect, useRef, useState } from 'react';

const Preview = ({ type, config, hass }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cardTag = type === 'button-card' ? 'custom-button-card' : 'custom-bubble-card';
    const element = document.createElement(cardTag);

    // Fonction pour initialiser la carte
    const initCard = () => {
      try {
        // Vérification critique : est-ce que la méthode setConfig existe ?
        if (typeof element.setConfig !== 'function') {
          // Si le plugin n'est pas chargé, l'élément est un simple HTMLElement générique
          throw new Error(`Le plugin ${cardTag} n'est pas chargé ou détecté.`);
        }

        element.setConfig(config);
        element.hass = hass;
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(element);
        setError(null);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    };

    // On attend que le Custom Element soit défini dans le navigateur
    customElements.whenDefined(cardTag).then(() => {
      initCard();
    });

  }, [type, config, hass]);

  return (
    <div className="preview-wrapper">
      {error ? (
        <div className="error-box">
          ⚠️ Erreur : {error} <br/>
          <small>Vérifie que le fichier .js est bien dans /public/plugins/</small>
        </div>
      ) : (
        <div ref={containerRef} className="card-render"></div>
      )}
    </div>
  );
};

export default Preview;