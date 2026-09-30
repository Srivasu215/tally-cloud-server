export function renderBatchOnlyFilterLabel(labelId, labelFact, itemsWithBatches) {
    const label = document.getElementById(labelId);
    if (label) label.textContent = `${labelFact} (${itemsWithBatches.toLocaleString()})`;
}
