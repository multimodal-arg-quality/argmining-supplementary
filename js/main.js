// ArgMining Supplementary - Shared JavaScript
// Handles chart detail pages, lightbox, and navigation

// ── Lightbox ──
function openLightbox(imgEl) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (lb && lbImg) {
    lbImg.src = imgEl.src;
    lb.classList.add('open');
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

// Close lightbox on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Chart Detail Page Population ──
(function() {
  // Only run on chart detail pages
  if (typeof CHART_ID === 'undefined' || typeof CHARTS === 'undefined') return;

  const chart = CHARTS[CHART_ID];
  if (!chart) return;

  // Helper to safely set text content
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '—';
  }

  // Badges
  const badgeDomain = document.getElementById('badge-domain');
  const badgeType = document.getElementById('badge-type');
  const badgeTier = document.getElementById('badge-tier');
  if (badgeDomain) badgeDomain.textContent = chart.domain;
  if (badgeType) badgeType.textContent = chart.chartType;
  if (badgeTier) {
    badgeTier.textContent = chart.tier;
    badgeTier.className = `badge badge-tier-${chart.tier}`;
  }

  // Main content
  setText('claim-text', chart.claim);

  // Caption and citation
  setText('caption-box', chart.caption);
  setText('citation-box', chart.citation);

  // Scores
  const qgEl = document.getElementById('qg-score');
  if (qgEl) qgEl.textContent = chart.scores.Q.toFixed(2);
  setText('rank-num', chart.rank);

  const scoreBars = document.getElementById('score-bars');
  if (scoreBars) {
    const dims = [
      { key: 'align', label: 'Alignment (L2↔L4)' },
      { key: 'wStr', label: 'Warrant Strength (L1→L4)' },
      { key: 'sRel', label: 'Salience-Relevance (L3↔L4)' }
    ];
    scoreBars.innerHTML = dims.map(d => {
      const val = chart.scores[d.key];
      const pct = (val / 5 * 100).toFixed(0);
      const color = val >= 4 ? '#27ae60' : (val >= 3 ? '#f1c40f' : '#e67e22');
      return `<div class="score-bar-row">
        <div class="score-bar-label">${d.label}</div>
        <div class="score-bar-track"><div class="score-bar-fill" style="width:${pct}%; background:${color}"></div></div>
        <div class="score-bar-val">${val.toFixed(1)}</div>
      </div>`;
    }).join('');
  }

  // Sample claims (no strategy tags)
  const claimsList = document.getElementById('claims-list');
  const totalEl = document.getElementById('total-claims');
  if (totalEl) totalEl.textContent = chart.totalClaims || '—';
  if (claimsList && chart.sampleClaims) {
    claimsList.innerHTML = chart.sampleClaims.map(sc => `
      <div class="claim-item">
        <div class="claim-body">${sc.claim}</div>
        <div class="evidence-body">
          <strong>Evidence:</strong> ${sc.evidence}<br>
          <span style="font-size:0.8rem; color:var(--text-light);">
            Source: ${sc.source} &middot; Generator: ${sc.generator} &middot; Validated by: ${sc.validatedBy}
          </span>
        </div>
      </div>
    `).join('');
  }

  // Prev/Next navigation
  const prevLink = document.getElementById('prev-link');
  const nextLink = document.getElementById('next-link');
  if (prevLink && nextLink && typeof RANKINGS !== 'undefined') {
    const idx = RANKINGS.indexOf(chart.id);
    if (idx > 0) {
      prevLink.href = `${RANKINGS[idx - 1]}.html`;
      prevLink.textContent = `\u2190 Chart ${RANKINGS[idx - 1]}`;
    } else {
      prevLink.style.visibility = 'hidden';
    }
    if (idx < RANKINGS.length - 1) {
      nextLink.href = `${RANKINGS[idx + 1]}.html`;
      nextLink.textContent = `Chart ${RANKINGS[idx + 1]} \u2192`;
    } else {
      nextLink.style.visibility = 'hidden';
    }
  }
})();
