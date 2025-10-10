// BEFORE
// export const theme = ` ... `;

// AFTER
import { css } from "lit";

export const theme = css`
  :host, :root {
    --bg: #0b1020;
    --panel: #121832;
    --panel-2: #11192e;
    --text: #e6e9f5;
    --muted: #9aa4bf;
    --primary: #7cc6ff;
    --accent: #90a0ff;
    --danger: #ff6b6b;

    --radius: 16px;
    --shadow: 0 10px 30px rgba(0,0,0,.35);
    --border: 1px solid rgba(255,255,255,.06);
  }

  * { box-sizing: border-box; }

  html, body {
    height: 100%;
    margin: 0;
    background: radial-gradient(1200px 800px at 80% -20%, #1a2350 0%, transparent 60%) var(--bg);
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .card {
    background: linear-gradient(180deg, #141b36 0%, #0f1530 100%);
    border: var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .glow {
    box-shadow: 0 0 40px #7cc6ff33, inset 0 0 0 1px #7cc6ff22;
  }

  .row { display:flex; gap:.75rem; align-items:center; }
  .col { display:flex; flex-direction:column; gap:.75rem; }
`;
