import { escapeHtml } from "../escapeHtml.js";

export function renderCompanySelector(containerId, selectId, companyFacts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const options = companyFacts.options.map((company) => {
        const selected = company === companyFacts.default ? " selected" : "";
        return `<option value="${escapeHtml(company)}"${selected}>${escapeHtml(company)}</option>`;
    }).join("");

    container.innerHTML = `<select id="${escapeHtml(selectId)}" class="control-select">${options}</select>`;
}
