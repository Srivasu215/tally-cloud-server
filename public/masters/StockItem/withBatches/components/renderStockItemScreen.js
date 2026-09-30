import { renderSummaryCards } from "./cards/renderSummaryCards.js";
import { renderCompanySelector } from "./controls/renderCompanySelector.js";
import { renderBatchOnlyFilterLabel } from "./filters/renderBatchOnlyFilterLabel.js";
import { renderJsonExplorer } from "./json/renderJsonExplorer.js";
import { renderConnectionStatus } from "./status/renderConnectionStatus.js";
import { renderStockItemsTable } from "./table/renderStockItemsTable.js";

/** Assemble the page by passing each screen section to its focused renderer. */
export function renderStockItemScreen({
    schemaIds,
    facts,
    metrics,
    visibleItems,
    status,
    jsonPayload,
    jsonSourceFact = facts.jsonSourceFact
}) {
    if (!document.getElementById(schemaIds.controls.companyValue)) {
        renderCompanySelector(
            schemaIds.controls.company,
            schemaIds.controls.companyValue,
            facts.company
        );
    }
    renderConnectionStatus(schemaIds.status, status);
    renderSummaryCards(schemaIds.cards, facts.cards, metrics);
    renderBatchOnlyFilterLabel(
        schemaIds.controls.hasBatchesLabel,
        facts.batchOnlyLabel,
        metrics.itemsWithBatches
    );
    renderStockItemsTable(schemaIds.table, facts.table, visibleItems);
    renderJsonExplorer(schemaIds.json, jsonSourceFact, jsonPayload);
}
