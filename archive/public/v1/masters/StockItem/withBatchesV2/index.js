import screenDefinition from "./json/stockItemWithBatches.mock.json" with { type: "json" };
import { initializeStockItemPage } from "./page/initializeStockItemPage.js";

initializeStockItemPage(screenDefinition);
