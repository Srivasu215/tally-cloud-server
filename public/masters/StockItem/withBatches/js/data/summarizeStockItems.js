/** Calculate the metric facts displayed by the summary cards. */
export function summarizeStockItems(items) {
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
