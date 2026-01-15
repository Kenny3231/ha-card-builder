// On injecte les variables CSS de base de Home Assistant dans le body
export const injectHaStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      /* Couleurs Dark Mode par défaut (exemple) */
      --primary-text-color: #e1e1e1;
      --secondary-text-color: #9b9b9b;
      --text-primary-color: #ffffff;
      --disabled-text-color: #6f6f6f;
      --primary-color: #03a9f4;
      --accent-color: #ff9800;
      --paper-item-icon-color: #44739e;
      --paper-item-icon-active-color: #fdd835;
      --ha-card-background: #1c1c1c;
      --ha-card-box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
      --ha-card-border-radius: 12px;
      
      background-color: #111; /* Fond de ta page */
      color: var(--primary-text-color);
      font-family: Roboto, sans-serif;
    }
  `;
  document.head.appendChild(style);
};