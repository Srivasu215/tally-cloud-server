function readFirstValue(record, fieldNames) {
    if (!record || typeof record !== "object") return undefined;

    for (const fieldName of fieldNames) {
        const value = record[fieldName];
        if (value !== undefined && value !== null) return value;
    }

    return undefined;
}

function hasText(value) {
    return String(value ?? "").trim() !== "";
}

function normalizeBatch(batch) {
    if (!batch || typeof batch !== "object") return null;

    const name = readFirstValue(batch, ["BATCHNAME", "batchName", "@_NAME", "NAME", "name"]);
    const godown = readFirstValue(batch, ["GODOWNNAME", "godownName", "godown"]);
    const openingBalance = readFirstValue(batch, ["OPENINGBALANCE", "openingBalance", "balance"]);

    if (![name, godown, openingBalance].some(hasText)) return null;

    return {
        name: name ?? "Primary / Default",
        godown: godown ?? "-",
        balance: readFirstValue(batch, ["OPENINGBALANCE", "openingBalance", "balance", "BILLEDQTY"]) ?? "-",
        rate: readFirstValue(batch, ["OPENINGRATE", "openingRate", "rate"]) ?? "-",
        value: readFirstValue(batch, ["OPENINGVALUE", "openingValue", "value", "AMOUNT"])
    };
}

function normalizeStockItem(item) {
    const source = item && typeof item === "object" ? item : {};
    const rawBatches = readFirstValue(source, [
        "batches",
        "batchAllocations",
        "BATCHALLOCATIONS.LIST",
        "BATCHALLOCATIONS"
    ]);
    const batchList = Array.isArray(rawBatches)
        ? rawBatches
        : rawBatches && typeof rawBatches === "object"
            ? [rawBatches]
            : [];

    return {
        name: readFirstValue(source, ["itemName", "name", "@_NAME", "NAME", "@NAME"]) ?? "Unnamed Item",
        baseUnit: readFirstValue(source, ["baseUnit", "baseUnits", "BASEUNITS"]) ?? "-",
        batches: batchList.map(normalizeBatch).filter(Boolean)
    };
}

/** Convert Tally-shaped items into the canonical content shape used by renderers. */
export function normalizeStockItems(rawItems) {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map(normalizeStockItem);
}
