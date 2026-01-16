import React, { useState, useMemo } from 'react';
import Preview from '../components/Preview';
import yaml from 'js-yaml';

const RugbyTemplate = () => {
  const [colors, setColors] = useState({
    cardBgTop: '#333333',
    cardBgBottom: '#1a1a1a',
    borderColor: '#f1c40f',
    textColor: '#ffffff',
    timeColor: '#2ecc71',
    channelColor: '#e67e22'
  });

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
              <img src="\${channelLogo}" style="height: 70px; max-width: 90%; object-fit: contain;" onerror="this.style.display='none';">
              <div style="font-weight:bold; color:${colors.textColor}; font-size: 12px;">\${location}</div>
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

  // CORRECTION CRITIQUE ICI : Objet HASS complet
  const mockHass = useMemo(() => {
    const message = "Top14 - Toulouse vs Bordeaux";
    const fullDate = new Date('2026-01-20T21:00:00');

    return {
      // 1. Les états
      states: {
        "calendar.calendrier_allrugby": {
          entity_id: "calendar.calendrier_allrugby",
          state: "on",
          attributes: {
            message: message,
            location: "BeIn Sport 1",
            start_time: fullDate.toISOString(),
            friendly_name: "Rugby"
          }
        },
        "binary_sensor.match_rugby_cette_semaine": { 
            entity_id: "binary_sensor.match_rugby_cette_semaine",
            state: "on" 
        }
      },
      // 2. Configuration Système (Indispensable pour button-card)
      config: {
        state: "RUNNING",
        unit_system: { temperature: "°C", length: "km", mass: "kg", volume: "L" },
        version: "2024.1.0",
        components: ["calendar", "button_card"]
      },
      // 3. Infos utilisateur
      user: { is_owner: true, name: "Demo" },
      // 4. Langue et Localisation
      language: "fr",
      resources: {},
      themes: { default_theme: "default", themes: {} },
      selectedTheme: "default",
      locale: { language: "fr", number_format: "comma_period" },
      // 5. Fonction de localisation factice (pour éviter d'autres erreurs)
      localize: (key) => key
    };
  }, []);

  const previewConfig = useMemo(() => {
    const config = JSON.parse(JSON.stringify(cardConfig));
    const basePath = import.meta.env.BASE_URL;

    if (basePath !== '/') {
      Object.keys(config.custom_fields).forEach(key => {
        let field = config.custom_fields[key];
        if (typeof field === 'string') {
          // Extrait le code JS entre [[[ et ]]]
          const jsCode = field.substring(field.indexOf('[[[') + 3, field.lastIndexOf(']]]'));
          
          // Ajoute la variable basePath et remplace /local/ par ${basePath}local/ dans les template literals
          const updatedCode = `
            var basePath = '${basePath}';
            ${jsCode.replace(/`([^`]*?)\/local\/([^`]*?)`/g, '`$1${basePath}local/$2`')}
          `;
          
          config.custom_fields[key] = `[[[${updatedCode}]]]`;
        }
      });
    }
    return config;
  }, [cardConfig]);

  const yamlCode = useMemo(() => yaml.dump(cardConfig), [cardConfig]);

  const copyCode = () => {
    navigator.clipboard.writeText(yamlCode);
    alert("Code copié !");
  };

  return (
    <div className="builder-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>⚙️ Config</h2>
        <div className="form-group">
           <label>Fond Haut</label>
           <div className="color-picker-row"><input type="color" value={colors.cardBgTop} onChange={e => setColors({...colors, cardBgTop: e.target.value})} /></div>
        </div>
        <div className="form-group">
           <label>Fond Bas</label>
           <div className="color-picker-row"><input type="color" value={colors.cardBgBottom} onChange={e => setColors({...colors, cardBgBottom: e.target.value})} /></div>
        </div>
        <div className="form-group">
           <label>Bordure</label>
           <div className="color-picker-row"><input type="color" value={colors.borderColor} onChange={e => setColors({...colors, borderColor: e.target.value})} /></div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="preview-area">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <Preview type="button-card" config={previewConfig} hass={mockHass} />
        </div>
      </div>

      {/* CODE */}
      <div className="code-area">
        <textarea className="code-editor" readOnly value={yamlCode} />
        <button className="copy-btn" onClick={copyCode}>Copier</button>
      </div>
    </div>
  );
};

export default RugbyTemplate;