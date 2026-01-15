import React, { useState, useMemo } from 'react';
import Preview from '../components/Preview';
import yaml from 'js-yaml';

const RugbyTemplate = () => {
  // Couleurs personnalisables
  const [colors, setColors] = useState({
    cardBgTop: '#333333',
    cardBgBottom: '#1a1a1a',
    borderColor: '#f1c40f',
    textColor: '#ffffff',
    timeColor: '#2ecc71',
    channelColor: '#e67e22'
  });

  // Configuration de la carte générée dynamiquement
  const cardConfig = useMemo(() => {
    return {
      type: 'custom:button-card',
      entity: 'calendar.calendrier_allrugby',
      show_name: false,
      show_icon: false,
      tap_action: { action: 'none' },
      styles: {
        card: [
          { padding: '0px' },
          { background: 'none' },
          { border: 'none' },
          { 'box-shadow': 'none' }
        ],
        grid: [
          { 'grid-template-areas': '"match" "channel" "time"' },
          { 'grid-template-columns': '1fr' },
          { 'row-gap': '6px' }
        ]
      },
      custom_fields: {
        match: `[[[
          var msg = entity.attributes.message || "";
          var parts = msg.split(' - ');
          var competition = parts.length > 1 ? parts[0] : "Rugby";
          var matchPart = parts.length > 1 ? parts[1] : msg;
          
          var compLogo = \`/local/images/rugby/competitions/\${competition}.svg\`;
          var vsLogo = \`/local/images/rugby/competitions/vs.png\`;
  
          var content = "";
          if (matchPart.includes(' vs ')) {
            var teams = matchPart.split(' vs ');
            var teamA = teams[0].trim();
            var teamB = teams[1].trim();
            var logoA = \`/local/images/rugby/teams/\${teamA}.svg\`;
            var logoB = \`/local/images/rugby/teams/\${teamB}.svg\`;
            
            content = \`
              <div style="z-index: 2; display: flex; align-items: center; justify-content: space-around; width: 100%; padding: 5px 0;">
                <img src="\${logoA}" style="max-width: 85px; max-height: 85px; width: auto; height: auto; object-fit: contain;">
                <img src="\${vsLogo}" style="width: 70px; height: 70px; object-fit: contain; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">
                <img src="\${logoB}" style="max-width: 85px; max-height: 85px; width: auto; height: auto; object-fit: contain;">
              </div>
            \`;
          }
  
          return \`
            <div style="
              background: linear-gradient(180deg, ${colors.cardBgTop} 60%, ${colors.cardBgBottom} 100%);
              border-left: 5px solid ${colors.borderColor};
              border-radius: 10px;
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              min-height: 120px;
              padding: 10px 0;
            ">
              <div style="
                position: absolute;
                width: 85%; height: 85%;
                background-image: url('\${compLogo}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 0.4;
                z-index: 1;
              "></div>
              \${content}
            </div>
          \`;
        ]]]`,
        
        channel: `[[[
          var location = entity.attributes.location || "";
          var channelLogo = \`/local/images/rugby/chaines/\${location}.svg\`;
          
          return \`
            <div style="
              background: linear-gradient(180deg, #3a2d22 0%, ${colors.cardBgBottom} 100%);
              border-left: 5px solid ${colors.channelColor};
              border-radius: 10px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="font-size: 9px; color: ${colors.channelColor}; margin-bottom: 4px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Diffusion</div>
              <img src="\${channelLogo}" style="height: 70px; max-width: 90%; object-fit: contain;" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div style="display:none; font-weight:bold; color:${colors.textColor}; font-size: 12px;">\${location}</div>
            </div>
          \`;
        ]]]`,
        
        time: `[[[
          var start = new Date(entity.attributes.start_time);
          var dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
          var timeStr = start.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}).replace(':','h');
          
          return \`
            <div style="
              background: linear-gradient(180deg, #223328 0%, ${colors.cardBgBottom} 100%);
              border-left: 5px solid ${colors.timeColor};
              border-radius: 10px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
               <div style="font-size: 9px; color: ${colors.timeColor}; margin-bottom: 2px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Coup d'envoi</div>
               <div style="font-size: 13px; color: ${colors.textColor}; font-weight: 600; text-transform: capitalize;">\${start.toLocaleDateString('fr-FR', dateOptions)}</div>
               <div style="font-size: 24px; color: ${colors.timeColor}; font-weight: 900; line-height: 1; margin-top: 2px;">\${timeStr}</div>
            </div>
          \`;
        ]]]`
      }
    };
  }, [colors]);

  // Mock Hass avec données exemple
  const mockHass = useMemo(() => {
    const message = "Top14 - Toulouse vs Bordeaux";
    const fullDate = new Date('2026-01-20T21:00:00');

    return {
      states: {
        "calendar.calendrier_allrugby": {
          state: "on",
          attributes: {
            message: message,
            location: "BeIn Sport 1",
            start_time: fullDate.toISOString(),
          }
        }
      },
      language: "fr",
      locale: { language: "fr" },
      themes: { darkMode: true },
    };
  }, []);

  // YAML généré automatiquement
  const yamlCode = useMemo(() => yaml.dump(cardConfig), [cardConfig]);

  const copyCode = () => {
    navigator.clipboard.writeText(yamlCode);
    alert("Code copié dans le presse-papier !");
  };

  return (
    <div className="builder-container">
      
      {/* GAUCHE : Paramètres de couleurs uniquement */}
      <div className="sidebar">
        <h2>⚙️ Configuration</h2>
        
        <h3>🎨 Design & Couleurs</h3>
        
        <div className="form-group">
          <label>Fond Carte (Haut)</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.cardBgTop} 
              onChange={e => setColors({...colors, cardBgTop: e.target.value})} 
            />
            <span>{colors.cardBgTop}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Fond Carte (Bas)</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.cardBgBottom} 
              onChange={e => setColors({...colors, cardBgBottom: e.target.value})} 
            />
            <span>{colors.cardBgBottom}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Bordure Principale</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.borderColor} 
              onChange={e => setColors({...colors, borderColor: e.target.value})} 
            />
            <span>{colors.borderColor}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Couleur Heure</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.timeColor} 
              onChange={e => setColors({...colors, timeColor: e.target.value})} 
            />
            <span>{colors.timeColor}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Couleur Chaîne</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.channelColor} 
              onChange={e => setColors({...colors, channelColor: e.target.value})} 
            />
            <span>{colors.channelColor}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Couleur Texte</label>
          <div className="color-picker-row">
            <input 
              type="color" 
              value={colors.textColor} 
              onChange={e => setColors({...colors, textColor: e.target.value})} 
            />
            <span>{colors.textColor}</span>
          </div>
        </div>
      </div>

      {/* CENTRE : Preview */}
      <div className="preview-area">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {mockHass && (
            <Preview 
              type="button-card" 
              config={cardConfig} 
              hass={mockHass} 
            />
          )}
        </div>
      </div>

      {/* DROITE : Code YAML */}
      <div className="code-area">
        <div style={{padding: '20px 20px 0 20px'}}>
          <h2 style={{border: 'none', color: 'white'}}>📋 Code YAML</h2>
          <p style={{fontSize: '0.8rem', color:'#aaa'}}>Copie ce code dans une carte manuelle Home Assistant.</p>
        </div>
        <textarea 
          className="code-editor"
          readOnly 
          value={yamlCode} 
        />
        <button className="copy-btn" onClick={copyCode}>
          📋 COPIER LE CODE
        </button>
      </div>

    </div>
  );
};

export default RugbyTemplate;