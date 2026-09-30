export function renderJsonExplorer(schemaIds, sourceFact, payload) {
    const sourceLabel = document.getElementById(schemaIds.sourceLabel);
    const jsonViewer = document.getElementById(schemaIds.content);

    if (sourceLabel) sourceLabel.textContent = sourceFact;
    if (jsonViewer) jsonViewer.textContent = JSON.stringify(payload, null, 2);
}

export function getJsonText(contentId) {
    return document.getElementById(contentId)?.textContent ?? "";
}

export function setCopyButtonState(buttonId, isCopied) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.innerHTML = isCopied
        ? '<i class="bi bi-check2"></i> Copied!'
        : '<i class="bi bi-clipboard"></i> Copy JSON';
}
