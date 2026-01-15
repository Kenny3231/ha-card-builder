import React, { useState, useEffect } from 'react';
import Preview from '../components/Preview';
import jsyaml from 'js-yaml';

const RugbyTemplate = () => {
  // 1. Données du match
  const [form, setForm] = useState({
    teamA: 'Toulouse',
    teamB: 'Bordeaux',
    competition: 'Top14',
    channel: 'BeIn Sport 1',
    date: '2026-01-20',
    time: '21:00'
  });

  // 2. Couleurs personnalisables (Valeurs par défaut)
  const [colors, setColors] = useState({
    cardBgTop: '#333333',
    cardBgBottom: '#1a1a1a',
    borderColor: '#f1c40f', // Jaune Top14
    textColor: '#ffffff',
    timeColor: '#2ecc71',
    channelColor: '#e67e22'
  });

  const [mockHass, setMockHass] = useState(null);

  // 3. Construction dynamique de la config en fonction des couleurs choisies
  const getCardConfig = () => {
    return {
      type: 'custom:button-card',
      entity: 'calendar.calendrier_allrugby', // Entité fictive pour l'exemple
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
          // --- LOGIQUE JS ---
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
  
          // --- RENDU HTML avec couleurs injectées ---
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
  };

  // Mise à jour de MockHass
  useEffect(() => {
    const message = `${form.competition} - ${form.teamA} vs ${form.teamB}`;
    const fullDate = new Date(`${form.date}T${form.time}:00`);

    setMockHass({
      states: {
        "calendar.calendrier_allrugby": {
          state: "on",
          attributes: {
            message: message,
            location: form.channel,
            start_time: fullDate.toISOString(),
          }
        },
        "binary_sensor.match_rugby_cette_semaine": { state: "on" }
      },
      language: "fr",
      locale: { language: "fr" },
      themes: { darkMode: true },
    });
  }, [form]);

  const copyCode = () => {
    const yaml = jsyaml.dump(getCardConfig());
    navigator.clipboard.writeText(yaml);
    alert("Code copié dans le presse-papier !");
  };

  return (
    <div className="builder-container">
      
      {/* 1. GAUCHE : Paramètres */}
      <div className="sidebar">
        <h2>Configuration</h2>
        
        <h3>Données</h3>
        <div className="form-group"><label>Compétition</label><input type="text" value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} /></div>
        <div className="form-group"><label>Équipe A</label><input type="text" value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})} /></div>
        <div className="form-group"><label>Équipe B</label><input type="text" value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})} /></div>
        <div className="form-group"><label>Chaîne</label><input type="text" value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} /></div>
        <div className="form-group"><label>Date & Heure</label>
          <div style={{display:'flex', gap:'5px'}}>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
        </div>

        <h3>Design & Couleurs</h3>
        <div className="form-group">
          <label>Fond Carte (Haut)</label>
          <div className="color-picker-row">
            <input type="color" value={colors.cardBgTop} onChange={e => setColors({...colors, cardBgTop: e.target.value})} />
            <span>{colors.cardBgTop}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Fond Carte (Bas)</label>
          <div className="color-picker-row">
            <input type="color" value={colors.cardBgBottom} onChange={e => setColors({...colors, cardBgBottom: e.target.value})} />
            <span>{colors.cardBgBottom}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Bordure Principale</label>
          <div className="color-picker-row">
            <input type="color" value={colors.borderColor} onChange={e => setColors({...colors, borderColor: e.target.value})} />
            <span>{colors.borderColor}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Couleur Heure</label>
          <div className="color-picker-row">
            <input type="color" value={colors.timeColor} onChange={e => setColors({...colors, timeColor: e.target.value})} />
            <span>{colors.timeColor}</span>
          </div>
        </div>
      </div>

      {/* 2. CENTRE : Preview */}
      <div className="preview-area">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {mockHass && (
            <Preview 
              type="button-card" 
              config={getCardConfig()} 
              hass={mockHass} 
            />
          )}
        </div>
      </div>

      {/* 3. DROITE : Code */}
      <div className="code-area">
        <div style={{padding: '20px 20px 0 20px'}}>
          <h2 style={{border: 'none', color: 'white'}}>Code YAML</h2>
          <p style={{fontSize: '0.8rem', color:'#aaa'}}>Copie ce code dans une carte manuelle.</p>
        </div>
        <textarea 
          className="code-editor"
          readOnly 
          value={jsyaml.dump(getCardConfig())} 
        />
        <button className="copy-btn" onClick={copyCode}>
          COPIER LE CODE
        </button>
      </div>

    </div>
  );
};

export default RugbyTemplate;