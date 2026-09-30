import { escapeHtml } from "../escapeHtml.js";

export function renderBatchCards(batches) {
    if (batches.length === 0) {
        return '<span class="no-batch-muted"><i class="bi bi-dash-circle me-1"></i>No batch allocations</span>';
    }

    const cards = batches.map((batch) => {
        const value = typeof batch.value === "number"
            ? batch.value.toLocaleString()
            : (batch.value || "-");

        return `
          <div class="batch-card">
            <div class="batch-title">
              <i class="bi bi-tag-fill"></i>
              <span>${escapeHtml(batch.name)}</span>
            </div>
            <div class="batch-godown">
              <i class="bi bi-geo-alt-fill text-secondary me-1"></i>${escapeHtml(batch.godown)}
            </div>
            <div class="batch-balance">${escapeHtml(batch.balance)}</div>
            <div class="batch-rate">${escapeHtml(batch.rate)}</div>
            <div class="batch-val">₹ ${escapeHtml(value)}</div>
          </div>
        `;
    }).join("");

    return `<div class="batch-container">${cards}</div>`;
}
