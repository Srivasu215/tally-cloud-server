import render from "/json-render-table/src/index.js";

async function loadStockItems({ inJsonUrl }) {
    const localJsonUrl = inJsonUrl;
    const response = await fetch(localJsonUrl);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function startFunc({ inTargetHtmlId, inJsonUrl }) {
    const localTargetHtmlId = inTargetHtmlId;
    const localJsonUrl = inJsonUrl;

    try {
        const localStockItems = await loadStockItems({ inJsonUrl: localJsonUrl });

        render({
            flavor: "simple",
            data: localStockItems,
            columns: ["itemName", "baseUnit"],
            targetHtmlId: localTargetHtmlId
        });
    } catch (err) {
        console.error("Error rendering simple table with json-render-table:", err);
        const localContainer = document.getElementById(localTargetHtmlId);
        if (localContainer) {
            localContainer.innerHTML = `<div class="text-danger p-3">Error rendering table: ${err.message}</div>`;
        }
    }
}

startFunc({
    inTargetHtmlId: "dom-render-container",
    inJsonUrl: "./stockItems.json"
});
