import { normalizeStockItems } from "./normalizeStockItems.js";

const STOCK_ITEMS_ENDPOINT = "/v2/ws/masters.StockItem.withBatches";

function getRawItems(payload) {
    if (Array.isArray(payload)) return payload;
    return Array.isArray(payload?.data) ? payload.data : [];
}

/** The API boundary returns the original payload and normalized screen content. */
export async function fetchStockItems(companyName) {
    const company = String(companyName ?? "").trim();
    const url = `${STOCK_ITEMS_ENDPOINT}?company=${encodeURIComponent(company)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return {
        payload,
        items: normalizeStockItems(getRawItems(payload))
    };
}
