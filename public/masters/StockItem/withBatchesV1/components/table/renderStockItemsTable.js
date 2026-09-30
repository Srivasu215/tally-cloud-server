import { escapeHtml } from "../escapeHtml.js";
import { renderStockItemRow } from "./renderStockItemRow.js";

export function renderStockItemsTable(schemaIds, tableFacts, items) {
    const headerRow = document.getElementById(schemaIds.headerRow);
    if (headerRow) {
        headerRow.innerHTML = tableFacts.headers.map((header) => {
            const headerId = schemaIds.headers[header.schemaKey];
            const width = header.width ? ` style="width: ${escapeHtml(header.width)};"` : "";

            return `<th id="${escapeHtml(headerId)}"${width}>${escapeHtml(header.fact)}</th>`;
        }).join("");
    }

    const tableBody = document.getElementById(schemaIds.body);
    if (!tableBody) return;

    if (items.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="${tableFacts.headers.length}">
              <div class="empty-state">
                <i class="bi bi-search"></i>
                <p>${escapeHtml(tableFacts.emptyFact)}</p>
              </div>
            </td>
          </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map(renderStockItemRow).join("");
}
