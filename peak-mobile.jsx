// Mobile-only sticky bottom CTA bar.
// Renders on every page; CSS hides it above 768px (see peak-styles.css).

function StickyBottomBar() {
  return (
    <div className="pg-sticky-cta">
      <a href={PG_PHONE_SMS} className="pg-btn pg-btn-ghost" aria-label={`Text ${PG_PHONE}`}>
        ☏ TEXT BENNY
      </a>
      <a href="#quote" className="pg-btn" aria-label="Get a quote">
        QUOTE →
      </a>
    </div>
  );
}

window.StickyBottomBar = StickyBottomBar;
