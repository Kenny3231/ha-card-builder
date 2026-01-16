import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Preview from '../components/Preview';
import yaml from 'js-yaml';

const RugbyTemplate = () => {
  const [colors, setColors] = useState({
    mborder: '#f1c40f',
    mhaut: '#333333',
    mbas: '#1a1a1a',
    cborder: '#e67e22',
    chaut: '#3a2d22',
    cbas: '#1a1a1a',
    hborder: '#2ecc71',
    hhaut: '#223328',
    hbas: '#1a1a1a',
    textColor: '#ffffff'
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
              background: linear-gradient(180deg, ${colors.mhaut} 60%, ${colors.mbas} 100%);
              border-left: 5px solid ${colors.mborder};
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
              background: linear-gradient(180deg, ${colors.chaut} 0%, ${colors.cbas} 100%);
              border-left: 5px solid ${colors.cborder};
              border-radius: 10px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="font-size: 9px; color: ${colors.cborder}; margin-bottom: 4px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Diffusion</div>
              <img src="\${channelLogo}" style="height: 70px; max-width: 90%; object-fit: contain;" onerror="this.style.display='none';">
              <div style="display:none;font-weight:bold; color:${colors.textColor}; font-size: 12px;">\${location}</div>
            </div>
          \`;
        ]]]`,
        time: `[[[
          var start = new Date(entity.attributes.start_time);
          var dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
          var timeStr = start.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}).replace(':','h');
          return \`
            <div style="
              background: linear-gradient(180deg, ${colors.hhaut} 0%, ${colors.hbas} 100%);
              border-left: 5px solid ${colors.hborder};
              border-radius: 10px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
               <div style="font-size: 9px; color: ${colors.hborder}; margin-bottom: 2px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Coup d'envoi</div>
               <div style="font-size: 13px; color: ${colors.textColor}; font-weight: 600; text-transform: capitalize;">\${start.toLocaleDateString('fr-FR', dateOptions)}</div>
               <div style="font-size: 24px; color: ${colors.hborder}; font-weight: 900; line-height: 1; margin-top: 2px;">\${timeStr}</div>
            </div>
          \`;
        ]]]`
      }
    };
  }, [colors]);

  const mockHass = useMemo(() => {
    const message = "Top14 - Toulouse vs Bordeaux";
    const fullDate = new Date('2026-01-20T21:00:00');

    return {
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
      config: {
        state: "RUNNING",
        unit_system: { temperature: "°C", length: "km", mass: "kg", volume: "L" },
        version: "2024.1.0",
        components: ["calendar", "button_card"]
      },
      user: { is_owner: true, name: "Demo" },
      language: "fr",
      resources: {},
      themes: { default_theme: "default", themes: {} },
      selectedTheme: "default",
      locale: { language: "fr", number_format: "comma_period" },
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
          const jsCode = field.substring(field.indexOf('[[[') + 3, field.lastIndexOf(']]]'));
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
    alert("Code copié dans le presse-papier !");
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="breadcrumb">
            <Link to="/" className="logo">
              <span className="logoEmoji">🏠</span>
              <span>Accueil</span>
            </Link>
            <span>/</span>
            <span>Template Rugby</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="builder-grid">
          {/* WIDGET CONFIGURATION - À GAUCHE */}
          <div className="config-widget widget">
            <h2 className="widget-title">⚙️ Configuration</h2>
            <h3>Equipes</h3>
            
            <div className="form-group">
              <label>fond</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.mhaut} 
                  onChange={e => setColors({...colors, mhaut: e.target.value})} 
                />
                <span className="color-value">{colors.mhaut}</span>              
              <input
                  type="color"
                  value={colors.mbas}
                  onChange={e => setColors({...colors, mbas: e.target.value})}
                />
                <span className="color-value">{colors.mbas}</span>
              </div>
            </div>
            <div className="form-group">
              <label>border</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.mborder} 
                  onChange={e => setColors({...colors, mborder: e.target.value})} 
                />
                <span className="color-value">{colors.mborder}</span>
              </div>
            </div>
            <h3>Chaîne</h3>
            <div className="form-group">
              <label>fond</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.chaut} 
                  onChange={e => setColors({...colors, chaut: e.target.value})} 
                />
                <span className="color-value">{colors.chaut}</span>
                <input
                  type="color"
                  value={colors.cbas}
                  onChange={e => setColors({...colors, cbas: e.target.value})}
                />
                <span className="color-value">{colors.cbas}</span>
              </div>
            </div>           

            <div className="form-group">
              <label>border</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.cborder} 
                  onChange={e => setColors({...colors, cborder: e.target.value})} 
                />
                <span className="color-value">{colors.cborder}</span>
              </div>
            </div>
            <h3>Date et Heure</h3>
            <div className="form-group">
              <label>Fond</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.hhaut} 
                  onChange={e => setColors({...colors, hhaut: e.target.value})} 
                />
                <span className="color-value">{colors.hhaut}</span>
                <input
                  type="color"
                  value={colors.hbas}
                  onChange={e => setColors({...colors, hbas: e.target.value})}
                />
                <span className="color-value">{colors.hbas}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Border</label>
              <div className="color-picker-row">
                <input 
                  type="color" 
                  value={colors.hborder} 
                  onChange={e => setColors({...colors, hborder: e.target.value})} 
                />
                <span className="color-value">{colors.hborder}</span>
              </div>
            </div>

            <h3>Texte</h3>
            <div className="form-group">
              <div className="color-picker-row">
                <input
                  type="color"
                  value={colors.textColor}
                  onChange={e => setColors({...colors, textColor: e.target.value})}
                />
                <span className="color-value">{colors.textColor}</span>
              </div>
            </div>
          </div>

          {/* WIDGET PREVIEW - AU CENTRE */}
          <div className="preview-widget">
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Preview type="button-card" config={previewConfig} hass={mockHass} />
            </div>
          </div>

          {/* WIDGET INFO - EN HAUT À DROITE */}
          <div className="info-widget widget">
            <h2 className="widget-title">ℹ️ Informations</h2>
            
            <div className="info-section">
              <h4>📋 Pré-requis</h4>
              <ul>
                <li>Home Assistant</li>
                <li>HACS installé</li>
                <li>
                  <a href="https://github.com/custom-cards/button-card" target="_blank" rel="noopener noreferrer">
                    Button Card
                  </a> (via HACS)
                </li>
                <li>Un calendrier Rugby configuré</li>
              </ul>
            </div>

            <div className="info-section">
              <h4>🖼️ Images</h4>
              <ul>
                <li>Placez vos images dans <code>/local/images/rugby/</code></li>
                <li>Structure :
                  <ul>
                    <li><code>teams/</code> : logos des équipes</li>
                    <li><code>competitions/</code> : logs des compétitions</li>
                    <li><code>chaines/</code> : logos des chaînes TV</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          {/* WIDGET CODE - EN BAS À DROITE */}
          <div className="code-widget widget">
            <h2 className="widget-title">💻 Code YAML</h2>
            <textarea className="code-editor" readOnly value={yamlCode} />
            <button className="copy-btn" onClick={copyCode}>📋 Copier le Code</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default RugbyTemplate;
