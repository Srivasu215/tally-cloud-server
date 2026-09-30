import { escapeHtml } from "../escapeHtml.js";

/** Render one row per top-level stock item without its batch allocations. */
export function renderRootStockItemsTable(schemaIds, tableFacts, items) {
    const headerRow = document.getElementById(schemaIds.headerRow);
    if (headerRow) headerRow.innerHTML = `<th>${escapeHtml(tableFacts.headerFact)}</th>`;

    const tableBody = document.getElementById(schemaIds.body);
    if (!tableBody) return;

    if (items.length === 0) {
        tableBody.innerHTML = `<tr><td>${escapeHtml(tableFacts.emptyFact)}</td></tr>`;
        return;
    }

    tableBody.innerHTML = items
        .map((item) => `<tr><td>${escapeHtml(item.name)}</td></tr>`)
        .join("");
}
