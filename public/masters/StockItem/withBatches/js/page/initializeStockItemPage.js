import { filterStockItems } from "../data/filterStockItems.js";
import { fetchStockItems } from "../data/fetchStockItems.js";
import { summarizeStockItems } from "../data/summarizeStockItems.js";
import { renderStockItemScreen } from "../renderers/renderStockItemScreen.js";
import { setFetchButtonLoading } from "../renderers/controls/setFetchButtonLoading.js";
import { bindStockItemPageEvents } from "./bindStockItemPageEvents.js";

/** Coordinate page state, data operations, and the screen renderer. */
export function initializeStockItemPage(screenDefinition) {
    const { schemaIds, facts } = screenDefinition;
    const state = {
        items: facts.items,
        status: facts.status,
        jsonPayload: screenDefinition,
        jsonSourceFact: facts.jsonSourceFact,
        filters: { searchQuery: "", hasBatchesOnly: false }
    };

    function renderPage() {
        const metrics = summarizeStockItems(state.items);
        const visibleItems = filterStockItems(state.items, state.filters);

        renderStockItemScreen({
            schemaIds,
            facts,
            metrics,
            allItems: state.items,
            visibleItems,
            status: state.status,
            jsonPayload: state.jsonPayload,
            jsonSourceFact: state.jsonSourceFact
        });
    }

    async function fetchLiveItems(companyName) {
        const company = String(companyName ?? "").trim();
        console.log("company : ", company);

        setFetchButtonLoading(schemaIds.controls.fetch, true);
        state.status = { state: "loading", message: `Fetching for "${company}"...` };
        renderPage();

        try {
            const { payload, items } = await fetchStockItems(company);
            state.items = items;
            state.jsonPayload = payload;
            state.jsonSourceFact = "/v2/ws/masters.StockItem.withBatches response";
            state.status = {
                state: "ready",
                message: `Loaded ${items.length} items (${new Date().toLocaleTimeString()})`
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Fetch failed:", error);
            state.status = {
                state: "error",
                message: `Fetch failed: ${message}; showing current screen content`
            };
        } finally {
            setFetchButtonLoading(schemaIds.controls.fetch, false);
            renderPage();
        }
    }

    renderPage();
    bindStockItemPageEvents({
        screenDefinition,
        onFiltersChange(filters) {
            state.filters = filters;
            renderPage();
        },
        onFetch: fetchLiveItems
    });
}
