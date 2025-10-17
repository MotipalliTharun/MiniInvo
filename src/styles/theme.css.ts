import { css } from "lit";

export const theme = css`
  :host,
  :root {
    /* 🌈 Brand Palette */
    --bg: #fafbfd;               /* overall background */
    --panel: #ffffff;            /* main panel background */
    --panel-2: #f8fafc;          /* secondary card tone */
    --text: #1e293b;             /* primary text */
    --muted: #6b7280;            /* secondary text */
    --primary: #00bcd4;          /* aqua accent */
    --accent: #00acc1;           /* slightly darker accent */
    --danger: #ef4444;           /* bright red for alerts */

    /* 🧩 Layout & Depth */
    --radius: 16px;
    --shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    --border: 1px solid #e5e7eb;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    margin: 0;
    background: linear-gradient(180deg, #f3faff 0%, #ffffff 100%);
    color: var(--text);
    font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .card {
    background: var(--panel);
    border: var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .glow {
    box-shadow: 0 0 25px rgba(0, 188, 212, 0.25),
                inset 0 0 0 1px rgba(0, 188, 212, 0.15);
  }

  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Buttons, links, etc. */
  a,
  button {
    color: var(--primary);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  a:hover,
  button:hover {
    color: var(--accent);
  }
`;
