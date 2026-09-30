/** Pure selectors over the normalized StockItem content. */

export function filterStockItems(items, { searchQuery = "", hasBatchesOnly = false } = {}) {
    const query = String(searchQuery).toLowerCase().trim();

    return items.filter((item) => {
        if (hasBatchesOnly && item.batches.length === 0) return false;
        if (!query) return true;

        const itemMatches = String(item.name).toLowerCase().includes(query)
            || String(item.baseUnit).toLowerCase().includes(query);
        const batchMatches = item.batches.some((batch) => (
            String(batch.name).toLowerCase().includes(query)
            || String(batch.godown).toLowerCase().includes(query)
        ));

        return itemMatches || batchMatches;
    });
}

export function calculateStockItemStats(items) {
    const itemsWithBatches = items.filter((item) => item.batches.length > 0).length;
    const totalBatches = items.reduce((count, item) => count + item.batches.length, 0);
    const godowns = new Set();

    items.forEach((item) => {
        item.batches.forEach((batch) => {
            const godown = String(batch.godown ?? "").trim();
            if (godown && godown !== "-") godowns.add(godown);
        });
    });

    return {
        totalItems: items.length,
        itemsWithBatches,
        totalBatches,
        totalGodowns: godowns.size
    };
}
