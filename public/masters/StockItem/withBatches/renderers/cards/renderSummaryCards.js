import { escapeHtml } from "../escapeHtml.js";

export function renderSummaryCards(schemaIds, cardFacts, metrics) {
    const container = document.getElementById(schemaIds.container);
    if (!container) return;

    container.innerHTML = cardFacts.map((card) => {
        const valueId = schemaIds.metrics[card.metric];
        const value = metrics[card.metric] ?? 0;

        return `
          <div class="stat-card">
            <div class="stat-icon ${escapeHtml(card.toneClass)}">
              <i class="bi ${escapeHtml(card.iconClass)}"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">${escapeHtml(card.fact)}</div>
              <div class="stat-value" id="${escapeHtml(valueId)}">${value.toLocaleString()}</div>
            </div>
          </div>
        `;
    }).join("");
}
