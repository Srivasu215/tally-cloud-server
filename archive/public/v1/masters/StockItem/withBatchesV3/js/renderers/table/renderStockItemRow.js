import { escapeHtml } from "../escapeHtml.js";
import { renderBatchCards } from "./renderBatchCards.js";

export function renderStockItemRow(item, index, tableFacts) {
    const batchCountFact = item.batches.length === 1
        ? tableFacts.batchCountFact
        : tableFacts.batchCountPluralFact;
    const batchCount = item.batches.length > 0
        ? `<small class="badge-tag" style="display:inline-block; margin-top:0.25rem;">${item.batches.length} ${escapeHtml(batchCountFact)}</small>`
        : "";

    return `
      <tr>
        <td style="color: var(--text-muted); font-family: monospace;">${index + 1}</td>
        <td class="item-name-cell">
          <div>${escapeHtml(item.name)}</div>
          ${batchCount}
        </td>
        <td><span class="uom-chip">${escapeHtml(item.baseUnit)}</span></td>
        <td>${renderBatchCards(item.batches, tableFacts)}</td>
      </tr>
    `;
}
