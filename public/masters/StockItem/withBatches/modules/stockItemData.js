/**
 * Converts Tally's different field formats into the one shape used by the page.
 * The renderer and filters only see normalized stock items and batches.
 */

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

    // BILLEDQTY is a display fallback, but does not identify a real allocation.
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
        name: readFirstValue(source, ["name", "@_NAME", "NAME", "@NAME"]) ?? "Unnamed Item",
        baseUnit: readFirstValue(source, ["baseUnits", "BASEUNITS"]) ?? "-",
        batches: batchList.map(normalizeBatch).filter(Boolean)
    };
}

/** Return canonical StockItem objects for both the live API and mock payloads. */
export function normalizeStockItems(rawItems) {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map(normalizeStockItem);
}

/** Raw-shaped sample payload so the demo exercises the same normalization path as Tally. */
export function createDemoPayload() {
    return [
        {
            "@_NAME": "0.09/30mm High Tensile Steel",
            "BASEUNITS": "kgs",
            "BATCHALLOCATIONS.LIST": {
                "MFDON": "01-Apr-2026",
                "GODOWNNAME": "Main Location",
                "BATCHNAME": "Navratan-Rs.1210/-",
                "OPENINGBALANCE": "125.500 kgs",
                "OPENINGVALUE": 151855,
                "OPENINGRATE": "1210.00/kgs",
                "EXPIRYPERIOD": "31-Mar-2027"
            }
        },
        {
            "@_NAME": "0.11/32mm Industrial Wire",
            "BASEUNITS": "kgs",
            "BATCHALLOCATIONS.LIST": [
                {
                    "MFDON": "15-Apr-2026",
                    "GODOWNNAME": "Warehouse A",
                    "BATCHNAME": "Saif-Length-100md-Rs.2120/-",
                    "OPENINGBALANCE": "48.250 kgs",
                    "OPENINGVALUE": 102290,
                    "OPENINGRATE": "2120.00/kgs",
                    "EXPIRYPERIOD": ""
                },
                {
                    "MFDON": "20-Apr-2026",
                    "GODOWNNAME": "Main Location",
                    "BATCHNAME": "Batch-April-SecB",
                    "OPENINGBALANCE": "12.000 kgs",
                    "OPENINGVALUE": 25440,
                    "OPENINGRATE": "2120.00/kgs",
                    "EXPIRYPERIOD": ""
                }
            ]
        },
        {
            "@_NAME": "Copper Rod 10mm Pure",
            "BASEUNITS": "nos",
            "BATCHALLOCATIONS.LIST": {
                "MFDON": "10-May-2026",
                "GODOWNNAME": "Central Store",
                "BATCHNAME": "CR-10MM-LOT9",
                "OPENINGBALANCE": "350 nos",
                "OPENINGVALUE": 297500,
                "OPENINGRATE": "850.00/nos",
                "EXPIRYPERIOD": ""
            }
        },
        {
            "@_NAME": "Standard Fastener M8",
            "BASEUNITS": "box",
            "BATCHALLOCATIONS.LIST": ""
        }
    ];
}
