import { initCompanyDropdown } from "/js/companyDropdown.js";
import { fetchStockItems } from "./modules/stockItemApi.js";
import { createDemoPayload, normalizeStockItems } from "./modules/stockItemData.js";
import { calculateStockItemStats, filterStockItems } from "./modules/stockItemFilters.js";
import {
    getJsonText,
    renderConnectionStatus,
    renderFetchError,
    renderJsonPayload,
    renderStockItemStats,
    renderStockItems,
    setCopyJsonButtonCopied,
    setFetchButtonLoading
} from "./modules/stockItemView.js";

// Page state: keep the complete response here; filtering only changes the view.
let stockItems = [];

function refreshStockItemView() {
    const searchQuery = document.getElementById("searchInput")?.value ?? "";
    const hasBatchesOnly = document.getElementById("chkHasBatchesOnly")?.checked ?? false;
    const visibleItems = filterStockItems(stockItems, { searchQuery, hasBatchesOnly });

    renderStockItems(visibleItems);
}

function displayStockItemContent({ items, payload, statusMessage }) {
    stockItems = items;
    renderJsonPayload(payload);
    renderStockItemStats(calculateStockItemStats(stockItems));
    renderConnectionStatus("ready", statusMessage);
    refreshStockItemView();
}

function loadDemoDataset() {
    const payload = createDemoPayload();

    displayStockItemContent({
        items: normalizeStockItems(payload),
        payload,
        statusMessage: "Loaded Demo Dataset"
    });
}

async function loadStockItems(companyName) {
    const company = companyName.trim();
    setFetchButtonLoading(true);
    renderConnectionStatus("loading", `Fetching for "${company}"...`);

    try {
        const { payload, items } = await fetchStockItems(company);
        displayStockItemContent({
            items,
            payload,
            statusMessage: `Loaded ${items.length} items (${new Date().toLocaleTimeString()})`
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Fetch failed:", error);
        renderConnectionStatus("error", `Fetch failed: ${message}`);
        renderFetchError();
        document.getElementById("btnLoadSampleData")?.addEventListener("click", loadDemoDataset);
    } finally {
        setFetchButtonLoading(false);
    }
}

function switchToView({ activeTab, inactiveTab, activeView, inactiveView }) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activeView.style.display = "block";
    inactiveView.style.display = "none";
}

function bindViewTabs() {
    const tableTab = document.getElementById("tabTable");
    const jsonTab = document.getElementById("tabJson");
    const tableView = document.getElementById("tableView");
    const jsonView = document.getElementById("jsonView");

    if (!tableTab || !jsonTab || !tableView || !jsonView) return;

    tableTab.addEventListener("click", () => {
        switchToView({
            activeTab: tableTab,
            inactiveTab: jsonTab,
            activeView: tableView,
            inactiveView: jsonView
        });
    });

    jsonTab.addEventListener("click", () => {
        switchToView({
            activeTab: jsonTab,
            inactiveTab: tableTab,
            activeView: jsonView,
            inactiveView: tableView
        });
    });
}

function bindControls() {
    document.getElementById("btnFetch")?.addEventListener("click", () => {
        const companySelect = document.getElementById("companySelect");
        if (companySelect) loadStockItems(companySelect.value);
    });

    document.getElementById("searchInput")?.addEventListener("input", refreshStockItemView);
    document.getElementById("chkHasBatchesOnly")?.addEventListener("change", refreshStockItemView);
    bindViewTabs();

    document.getElementById("btnCopyJson")?.addEventListener("click", async () => {
        const jsonText = getJsonText();
        if (!jsonText) return;

        try {
            await navigator.clipboard.writeText(jsonText);
            setCopyJsonButtonCopied(true);
            setTimeout(() => setCopyJsonButtonCopied(false), 2000);
        } catch (error) {
            console.warn("Clipboard copy error:", error);
        }
    });
}

async function initializePage() {
    bindControls();

    const selectedCompany = await initCompanyDropdown({
        inSelectElementId: "companySelect",
        inDefaultCompany: "mani9",
        inOnChange: ({ inCompany }) => loadStockItems(inCompany)
    });

    if (selectedCompany) loadStockItems(selectedCompany);
}

initializePage();
