import screenDefinition from "./mock/stockItemWithBatches.json" with { type: "json" };
import { initCompanyDropdown } from "/js/companyDropdown.js";
import { fetchStockItems } from "./data/fetchStockItems.js";
import { filterStockItems } from "./data/filterStockItems.js";
import { summarizeStockItems } from "./data/summarizeStockItems.js";
import { renderStockItemScreen } from "./components/renderStockItemScreen.js";
import { renderConnectionStatus } from "./components/status/renderConnectionStatus.js";
import { getJsonText, setCopyButtonState } from "./components/json/renderJsonExplorer.js";
import { setFetchButtonLoading } from "./components/controls/setFetchButtonLoading.js";

let stockItems = screenDefinition.facts.items;
let currentStatus = screenDefinition.facts.status;
let currentJsonPayload = screenDefinition;
let currentJsonSourceFact = screenDefinition.facts.jsonSourceFact;

function renderScreen() {
    const searchQuery = document.getElementById(screenDefinition.schemaIds.controls.search)?.value ?? "";
    const hasBatchesOnly = document.getElementById(screenDefinition.schemaIds.controls.hasBatchesOnly)?.checked ?? false;
    const visibleItems = filterStockItems(stockItems, { searchQuery, hasBatchesOnly });

    renderStockItemScreen({
        schemaIds: screenDefinition.schemaIds,
        facts: screenDefinition.facts,
        metrics: summarizeStockItems(stockItems),
        visibleItems,
        status: currentStatus,
        jsonPayload: currentJsonPayload,
        jsonSourceFact: currentJsonSourceFact
    });
}

async function fetchLiveStockItems(companyName) {
    const company = String(companyName ?? "").trim();
    setFetchButtonLoading(screenDefinition.schemaIds.controls.fetch, true);
    currentStatus = { state: "loading", message: `Fetching for "${company}"...` };
    renderConnectionStatus(screenDefinition.schemaIds.status, currentStatus);

    try {
        const { payload, items } = await fetchStockItems(company);
        stockItems = items;
        currentJsonPayload = payload;
        currentJsonSourceFact = "/v2/ws/StockItem.withBatches response";
        currentStatus = {
            state: "ready",
            message: `Loaded ${items.length} items (${new Date().toLocaleTimeString()})`
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Fetch failed:", error);
        currentStatus = {
            state: "error",
            message: `Fetch failed: ${message}; showing current screen content`
        };
    } finally {
        setFetchButtonLoading(screenDefinition.schemaIds.controls.fetch, false);
        renderScreen();
    }
}

function bindTabs() {
    const { tableButton, jsonButton, tableView, jsonView } = screenDefinition.schemaIds.tabs;
    const tableTab = document.getElementById(tableButton);
    const jsonTab = document.getElementById(jsonButton);
    const tablePanel = document.getElementById(tableView);
    const jsonPanel = document.getElementById(jsonView);

    if (!tableTab || !jsonTab || !tablePanel || !jsonPanel) return;

    tableTab.addEventListener("click", () => {
        tableTab.classList.add("active");
        jsonTab.classList.remove("active");
        tablePanel.style.display = "block";
        jsonPanel.style.display = "none";
    });

    jsonTab.addEventListener("click", () => {
        jsonTab.classList.add("active");
        tableTab.classList.remove("active");
        jsonPanel.style.display = "block";
        tablePanel.style.display = "none";
    });
}

function bindControls() {
    const ids = screenDefinition.schemaIds.controls;

    document.getElementById(ids.search)?.addEventListener("input", renderScreen);
    document.getElementById(ids.hasBatchesOnly)?.addEventListener("change", renderScreen);
    document.getElementById(ids.fetch)?.addEventListener("click", () => {
        const company = document.getElementById(ids.companyValue)?.value ?? screenDefinition.facts.company.default;
        fetchLiveStockItems(company);
    });

    const copyButtonId = screenDefinition.schemaIds.json.copyButton;
    document.getElementById(copyButtonId)?.addEventListener("click", async () => {
        const jsonText = getJsonText(screenDefinition.schemaIds.json.content);
        if (!jsonText) return;

        try {
            await navigator.clipboard.writeText(jsonText);
            setCopyButtonState(copyButtonId, true);
            setTimeout(() => setCopyButtonState(copyButtonId, false), 2000);
        } catch (error) {
            console.warn("Clipboard copy error:", error);
        }
    });

    bindTabs();
}

async function initializeCompanyDropdown() {
    await initCompanyDropdown({
        inSelectElementId: screenDefinition.schemaIds.controls.companyValue,
        inDefaultCompany: screenDefinition.facts.company.default,
        inOnChange: ({ inCompany }) => fetchLiveStockItems(inCompany)
    });
}

renderScreen();
bindControls();
initializeCompanyDropdown().catch((error) => {
    console.warn("Could not load live company options; the mock company remains available:", error);
});
