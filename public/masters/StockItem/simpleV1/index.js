function escapeHtml({ inValue }) {
    const localValue = inValue;
    return String(localValue ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderTable({ inItems, inTableBodyId }) {
    const localItems = inItems;
    const localTableBodyId = inTableBodyId;
    const localTableBody = document.getElementById(localTableBodyId);

    if (!localTableBody) return;

    if (!localItems || localItems.length === 0) {
        localTableBody.innerHTML = `<tr><td colspan="2">No stock items available.</td></tr>`;
        return;
    }

    localTableBody.innerHTML = localItems
        .map((item) => {
            const itemName = escapeHtml({ inValue: item.itemName ?? item.name ?? "" });
            const baseUnit = escapeHtml({ inValue: item.baseUnit ?? "" });
            return `<tr><td>${itemName}</td><td>${baseUnit}</td></tr>`;
        })
        .join("");
}

async function loadStockItems({ inJsonUrl }) {
    const localJsonUrl = inJsonUrl;
    const response = await fetch(localJsonUrl);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function initSimpleStockItemsPage({ inTableBodyId, inJsonUrl }) {
    const localTableBodyId = inTableBodyId;
    const localJsonUrl = inJsonUrl;

    try {
        const items = await loadStockItems({ inJsonUrl: localJsonUrl });
        renderTable({ inItems: items, inTableBodyId: localTableBodyId });
    } catch (error) {
        const localTableBody = document.getElementById(localTableBodyId);
        if (localTableBody) {
            localTableBody.innerHTML = `<tr><td colspan="2">Failed to load stock items: ${escapeHtml({ inValue: error.message })}</td></tr>`;
        }
    }
}

initSimpleStockItemsPage({
    inTableBodyId: "rootItemsBody",
    inJsonUrl: "./stockItems.json"
});
