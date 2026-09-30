export function setFetchButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = isLoading;
    button.innerHTML = isLoading
        ? '<span class="spinner"></span> <span>Fetching...</span>'
        : '<i class="bi bi-arrow-repeat"></i> <span>Fetch Batches</span>';
}
