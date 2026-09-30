import { initCompanyDropdown } from "/js/companyDropdown.js";
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

    initCompanyDropdown({
        inSelectElementId: controls.companyValue,
        inDefaultCompany: facts.company.default,
        inOnChange: ({ inCompany }) => onFetch(inCompany)
    }).then((selectedCompany) => {
        onFetch(selectedCompany);
    }).catch((error) => {
        console.warn("Could not load live company options; the mock company remains available:", error);
    });

    bindViewTabs(tabs.views);
    bindJsonCopy(json);
}

function bindViewTabs(viewDefinitions) {
    const views = viewDefinitions.map(({ button, panel }) => ({
        button: document.getElementById(button),
        panel: document.getElementById(panel)
    }));

    if (views.some(({ button, panel }) => !button || !panel)) return;

    views.forEach((activeView) => {
        activeView.button.addEventListener("click", () => {
            views.forEach(({ button, panel }) => {
                const isActive = button === activeView.button;
                button.classList.toggle("active", isActive);
                panel.style.display = isActive ? "block" : "none";
            });
        });
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
