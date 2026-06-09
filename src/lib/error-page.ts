export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        font: 15px/1.5 system-ui, -apple-system, sans-serif;
        background:
          radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 26%),
          radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 22%),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 72px),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 72px),
          #090909;
        color: #f7f4ef;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .grain::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.5;
        background:
          linear-gradient(transparent, transparent),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.035), transparent 60%);
      }
      .card { max-width: 34rem; width: 100%; text-align: center; }
      .eyebrow { letter-spacing: 0.3em; text-transform: uppercase; font-size: 0.65rem; color: rgba(247,244,239,0.55); margin-bottom: 1.25rem; }
      h1 { font-size: clamp(2.75rem, 8vw, 5rem); line-height: 0.95; margin: 0; font-family: Georgia, "Times New Roman", serif; font-weight: 400; }
      p { color: rgba(247,244,239,0.7); margin: 1.25rem auto 0; max-width: 28rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
      a, button {
        padding: 0.8rem 1.2rem;
        border-radius: 999px;
        font: inherit;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
      }
      .primary { background: #f7f4ef; color: #090909; }
      .secondary { background: transparent; color: #f7f4ef; border-color: rgba(247,244,239,0.14); }
    </style>
  </head>
  <body class="grain">
    <div class="card">
      <div class="eyebrow">Something went wrong</div>
      <h1>This page didn't load</h1>
      <p>We hit a snag on our end. You can try again or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
