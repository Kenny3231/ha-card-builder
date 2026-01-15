import React, { useState, useEffect } from 'react';
import Preview from '../components/Preview'; // Ton composant Preview existant
import jsyaml from 'js-yaml';

const RugbyTemplate = () => {
  // 1. L'état du formulaire (Les valeurs par défaut que tu voulais)
  const [form, setForm] = useState({
    teamA: 'Toulouse',
    teamB: 'Bordeaux',
    competition: 'Top14',
    channel: 'BeIn Sport 1',
    date: '2026-01-20',
    time: '21:00'
  });

  // 2. L'état de l'objet HASS simulé
  const [mockHass, setMockHass] = useState(null);

  // 3. La configuration FIXE de la carte (celle que tu m'as donnée)
  // Note: J'ai corrigé les indentations YAML pour que ça passe en JS
  const cardConfig = {
    type: 'custom:button-card',
    entity: 'calendar.calendrier_allrugby',
    show_name: false,
    show_icon: false,
    tap_action: { action: 'none' },
    styles: {
      card: [{ padding: '0px' }, { background: 'none' }, { border: 'none' }, { 'box-shadow': 'none' }],
      grid: [
        { 'grid-template-areas': '"match" "channel" "time"' },
        { 'grid-template-columns': '1fr' },
        { 'grid-template-rows': 'auto auto auto' },
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
            background: linear-gradient(180deg, #333333 60%, #1a1a1a 100%);
            border-left: 5px solid #f1c40f;
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
            background: linear-gradient(180deg, #3a2d22 0%, #1a1a1a 100%);
            border-left: 5px solid #e67e22;
            border-radius: 10px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="font-size: 9px; color: #e67e22; margin-bottom: 4px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Diffusion</div>
            <img src="\${channelLogo}" style="height: 70px; max-width: 90%; object-fit: contain;" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; font-weight:bold; color:white; font-size: 12px;">\${location}</div>
          </div>
        \`;
      ]]]`,
      time: `[[[
        var start = new Date(entity.attributes.start_time);
        var dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        var timeStr = start.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}).replace(':','h');
        
        return \`
          <div style="
            background: linear-gradient(180deg, #223328 0%, #1a1a1a 100%);
            border-left: 5px solid #2ecc71;
            border-radius: 10px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
             <div style="font-size: 9px; color: #2ecc71; margin-bottom: 2px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Coup d'envoi</div>
             <div style="font-size: 13px; color: #fff; font-weight: 600; text-transform: capitalize;">\${start.toLocaleDateString('fr-FR', dateOptions)}</div>
             <div style="font-size: 24px; color: #2ecc71; font-weight: 900; line-height: 1; margin-top: 2px;">\${timeStr}</div>
          </div>
        \`;
      ]]]`
    }
  };

  // 4. Mettre à jour le Mock HASS quand le formulaire change
  useEffect(() => {
    // Reconstruire le format "Competition - TeamA vs TeamB"
    const message = `${form.competition} - ${form.teamA} vs ${form.teamB}`;
    // Reconstruire la date ISO
    const fullDate = new Date(`${form.date}T${form.time}:00`);

    setMockHass({
      states: {
        "calendar.calendrier_allrugby": {
          state: "on",
          attributes: {
            message: message,
            location: form.channel,
            start_time: fullDate.toISOString(),
            friendly_name: "Match de Rugby"
          }
        },
        // On garde le binary sensor au cas où tu en aurais besoin dans 'conditions'
        "binary_sensor.match_rugby_cette_semaine": { state: "on" }
      },
      // Helpers minimums
      language: "fr",
      locale: { language: "fr" }, 
      themes: { darkMode: true },
    });
  }, [form]);

  // Fonction pour copier le code
  const copyCode = () => {
    const yaml = jsyaml.dump(cardConfig);
    navigator.clipboard.writeText(yaml);
    alert("Code copié !");
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', height: '100vh', gap: '20px', padding: '20px' }}>
      
      {/* GAUCHE : Customisation */}
      <div className="sidebar" style={{ background: '#222', padding: '20px', borderRadius: '10px' }}>
        <h2>Customisation</h2>
        <div className="form-group">
          <label>Compétition</label>
          <input type="text" value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Équipe A (Domicile)</label>
          <input type="text" value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Équipe B (Extérieur)</label>
          <input type="text" value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Chaîne TV</label>
          <input type="text" value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Date du match</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Heure</label>
          <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
        </div>
      </div>

      {/* CENTRE : Visuel */}
      <div className="preview-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: '10px' }}>
        <h3>Visuel en direct</h3>
        <p style={{color: '#666', fontSize: '0.8em'}}>Assurez-vous d'avoir les images dans /public/local/images/...</p>
        <div style={{ width: '300px' }}> {/* Largeur typique d'une colonne de dashboard */}
          {mockHass && (
            <Preview 
              type="button-card" 
              config={cardConfig} 
              hass={mockHass} 
            />
          )}
        </div>
      </div>

      {/* DROITE : Code à copier */}
      <div className="code-area" style={{ background: '#222', padding: '20px', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h2>Code YAML</h2>
        <p>Plugins requis : <code>custom:button-card</code></p>
        <textarea 
          readOnly 
          value={jsyaml.dump(cardConfig)} 
          style={{ flex: 1, background: '#111', color: '#0f0', border: 'none', padding: '10px', fontFamily: 'monospace', resize: 'none' }}
        />
        <button onClick={copyCode} style={{ marginTop: '10px', padding: '10px', background: '#03a9f4', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Copier le code
        </button>
      </div>
    </div>
  );
};

export default RugbyTemplate;