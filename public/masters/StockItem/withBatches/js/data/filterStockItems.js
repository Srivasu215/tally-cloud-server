/** Filter normalized stock item content without reading or changing the DOM. */
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
