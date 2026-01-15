export const createMockHass = () => {
  return {
    // 1. Les entités simulées (tu pourras les modifier via ton interface plus tard)
    states: {
      "light.salon": {
        state: "on",
        attributes: { friendly_name: "Lumière Salon", brightness: 255, icon: "mdi:sofa" },
        last_changed: new Date().toISOString(),
      },
      "sensor.temperature": {
        state: "21.5",
        attributes: { unit_of_measurement: "°C", friendly_name: "Température" },
      },
      "sun.sun": {
        state: "above_horizon",
        attributes: {},
      }
    },
    
    // 2. Info utilisateur
    user: {
      is_owner: true,
      name: "Utilisateur Démo"
    },

    // 3. Configuration système
    config: {
      unit_system: { temperature: "°C" },
      state: "RUNNING"
    },

    // 4. Langue et traduction
    language: "fr",
    resources: {},
    localize: (key) => `[${key}]`, // Fonction bidon pour la traduction

    // 5. Interception des services (quand on clique sur un bouton)
    callService: async (domain, service, serviceData) => {
      console.log(`📡 Service appelé : ${domain}.${service}`, serviceData);
      alert(`Action simulée : ${domain}.${service}`);
      // Astuce : Tu pourrais ici modifier l'état dans "states" pour simuler le ON/OFF visuel
    },
    
    // 6. Gestion des connexions (obligatoire pour éviter les erreurs JS)
    connection: {
      subscribeEvents: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    }
  };
};