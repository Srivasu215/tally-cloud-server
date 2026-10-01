import { render } from "https://keshavsoft.github.io/json-render-table/dist/v8/min.js";

import stockItems from './stockItems.json' with {type: 'json'};

async function startFunc({ inTargetHtmlId, inJsonUrl }) {
    const localTargetHtmlId = inTargetHtmlId;
    const localJsonUrl = inJsonUrl;

    try {
        render({
            flavor: "simple",
            data: stockItems,
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
    inTargetHtmlId: "rootItemsTable"
}).then();
