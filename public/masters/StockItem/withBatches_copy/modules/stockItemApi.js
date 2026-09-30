import { normalizeStockItems } from "./stockItemData.js";

const STOCK_ITEMS_ENDPOINT = "/v2/ws/StockItem.withBatches";

function getRawItems(payload) {
    if (Array.isArray(payload)) return payload;
    return Array.isArray(payload?.data) ? payload.data : [];
}

/** Fetch a company's items and return the original payload plus canonical items. */
export async function fetchStockItems(companyName) {
    const company = String(companyName ?? "").trim();
    const url = `${STOCK_ITEMS_ENDPOINT}?company=${encodeURIComponent(company)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    const items = normalizeStockItems(getRawItems(payload));

    return { payload, items };
}
