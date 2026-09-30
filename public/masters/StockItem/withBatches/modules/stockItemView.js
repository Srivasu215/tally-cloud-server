/** DOM rendering only: pass content in, and these functions update the page. */

function escapeHtml(value) {
    const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value ?? "").replace(/[&<>"']/g, (character) => replacements[character]);
}

export function renderConnectionStatus(state, message) {
    const status = document.getElementById("connectionStatus");
    const statusText = document.getElementById("statusText");
    const statusDot = status?.querySelector(".status-dot");

    if (statusText) statusText.textContent = message;
    if (!statusDot) return;

    statusDot.className = "status-dot";
    if (state === "loading") statusDot.classList.add("loading");
    if (state === "error") statusDot.classList.add("error");
}

export function renderStockItemStats(stats) {
    const values = {
        statTotalItems: stats.totalItems,
        statItemsWithBatches: stats.itemsWithBatches,
        statTotalBatches: stats.totalBatches,
        statTotalGodowns: stats.totalGodowns
    };

    Object.entries(values).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value.toLocaleString();
    });

    const batchLabel = document.getElementById("lblHasBatches");
    if (batchLabel) {
        batchLabel.textContent = `Only items with batches (${stats.itemsWithBatches.toLocaleString()})`;
    }
}

function renderBatchAllocations(batches) {
    if (batches.length === 0) {
        return '<span class="no-batch-muted"><i class="bi bi-dash-circle me-1"></i>No batch allocations</span>';
    }

    const cards = batches.map((batch) => {
        const value = typeof batch.value === "number"
            ? batch.value.toLocaleString()
            : (batch.value || "-");

        return `
          <div class="batch-card">
            <div class="batch-title">
              <i class="bi bi-tag-fill"></i>
              <span>${escapeHtml(batch.name)}</span>
            </div>
            <div class="batch-godown">
              <i class="bi bi-geo-alt-fill text-secondary me-1"></i>${escapeHtml(batch.godown)}
            </div>
            <div class="batch-balance">${escapeHtml(batch.balance)}</div>
            <div class="batch-rate">${escapeHtml(batch.rate)}</div>
            <div class="batch-val">₹ ${escapeHtml(value)}</div>
          </div>
        `;
    }).join("");

    return `<div class="batch-container">${cards}</div>`;
}

export function renderStockItems(items) {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    if (items.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="empty-state">
                <i class="bi bi-search"></i>
                <p>No matching stock items found for current filter.</p>
              </div>
            </td>
          </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map((item, index) => {
        const batchCount = item.batches.length > 0
            ? `<small class="badge-tag" style="display:inline-block; margin-top:0.25rem;">${item.batches.length} batch(es)</small>`
            : "";

        return `
          <tr>
            <td style="color: var(--text-muted); font-family: monospace;">${index + 1}</td>
            <td class="item-name-cell">
              <div>${escapeHtml(item.name)}</div>
              ${batchCount}
            </td>
            <td><span class="uom-chip">${escapeHtml(item.baseUnit)}</span></td>
            <td>${renderBatchAllocations(item.batches)}</td>
          </tr>
        `;
    }).join("");
}

export function renderJsonPayload(payload) {
    const jsonViewer = document.getElementById("jsonViewerContent");
    if (jsonViewer) jsonViewer.textContent = JSON.stringify(payload, null, 2);
}

export function getJsonText() {
    return document.getElementById("jsonViewerContent")?.textContent ?? "";
}

export function setFetchButtonLoading(isLoading) {
    const button = document.getElementById("btnFetch");
    if (!button) return;

    button.disabled = isLoading;
    button.innerHTML = isLoading
        ? '<span class="spinner"></span> <span>Fetching...</span>'
        : '<i class="bi bi-arrow-repeat"></i> <span>Fetch Batches</span>';
}

export function renderFetchError() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <i class="bi bi-exclamation-triangle" style="color: #ef4444;"></i>
            <p style="color: #fca5a5; font-weight: 600;">Failed to fetch from Cloud Server</p>
            <p style="font-size:0.85rem; max-width: 500px; margin: 0 auto 1rem;">
              Ensure <code>tally-cloud-server</code> is running on port 9011 and <code>tally-local-server</code> is connected via WebSocket to Tally Prime.
            </p>
            <button id="btnLoadSampleData" class="btn-docs-link" style="margin: 0 auto;">
              <i class="bi bi-file-earmark-code"></i> Load Sample Cached Batch Data
            </button>
          </div>
        </td>
      </tr>
    `;
}

export function setCopyJsonButtonCopied(isCopied) {
    const button = document.getElementById("btnCopyJson");
    if (!button) return;

    button.innerHTML = isCopied
        ? '<i class="bi bi-check2"></i> Copied!'
        : '<i class="bi bi-clipboard"></i> Copy JSON';
}
