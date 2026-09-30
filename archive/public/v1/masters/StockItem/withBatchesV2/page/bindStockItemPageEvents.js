import { getJsonText, setCopyButtonState } from "../renderers/json/renderJsonExplorer.js";

/** Connect user actions to page callbacks; renderers remain data-in, DOM-out. */
export function bindStockItemPageEvents({ screenDefinition, onFiltersChange, onFetch }) {
    const { schemaIds, facts } = screenDefinition;
    const { controls, tabs, json } = schemaIds;
    const searchInput = document.getElementById(controls.search);
    const batchesOnlyInput = document.getElementById(controls.hasBatchesOnly);

    const readFilters = () => ({
        searchQuery: searchInput?.value ?? "",
        hasBatchesOnly: batchesOnlyInput?.checked ?? false
    });

    searchInput?.addEventListener("input", () => onFiltersChange(readFilters()));
    batchesOnlyInput?.addEventListener("change", () => onFiltersChange(readFilters()));

    document.getElementById(controls.fetch)?.addEventListener("click", () => {
        const company = document.getElementById(controls.companyValue)?.value ?? facts.company.default;
        onFetch(company);
    });

    bindViewTabs(tabs);
    bindJsonCopy(json);
}

function bindViewTabs({ tableButton, jsonButton, tableView, jsonView }) {
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

function bindJsonCopy({ content, copyButton }) {
    document.getElementById(copyButton)?.addEventListener("click", async () => {
        const jsonText = getJsonText(content);
        if (!jsonText) return;

        try {
            await navigator.clipboard.writeText(jsonText);
            setCopyButtonState(copyButton, true);
            setTimeout(() => setCopyButtonState(copyButton, false), 2000);
        } catch (error) {
            console.warn("Clipboard copy error:", error);
        }
    });
}
