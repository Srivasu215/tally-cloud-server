export function renderConnectionStatus(schemaIds, status) {
    const statusContainer = document.getElementById(schemaIds.container);
    const statusText = document.getElementById(schemaIds.message);
    const statusDot = statusContainer?.querySelector(".status-dot");

    if (statusText) statusText.textContent = status.message;
    if (!statusDot) return;

    statusDot.className = "status-dot";
    if (status.state === "loading") statusDot.classList.add("loading");
    if (status.state === "error") statusDot.classList.add("error");
}
