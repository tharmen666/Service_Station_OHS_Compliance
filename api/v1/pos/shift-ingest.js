import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);

// server/posIngestHandler.ts
import { createHash } from "node:crypto";

// src/lib/pos-ingestion-adapter.ts
var DEFAULT_COLUMN_MAP = {
  recordTypeCol: "RECORD_TYPE",
  tankIdCol: "TANK_ID",
  gradeCol: "GRADE",
  capacityCol: "CAPACITY_L",
  openingStockCol: "OPEN_L",
  deliveryCol: "DELIVERY_L",
  closingAtgCol: "CLOSE_ATG_L",
  closingDipMmCol: "CLOSE_DIP_MM",
  waterMmCol: "WATER_MM",
  tempCol: "TEMP_C",
  nozzleIdCol: "NOZZLE_ID",
  pumpNumberCol: "PUMP_NO",
  openMeterCol: "OPEN_METER",
  closeMeterCol: "CLOSE_METER",
  pumpTestCol: "TEST_RETURN_L",
  unitPriceCol: "UNIT_PRICE",
  posLitresCol: "POS_LITRES",
  posValueCol: "POS_VALUE",
  driveOffLitresCol: "DRIVE_OFF_L",
  driveOffValueCol: "DRIVE_OFF_VALUE",
  shopConvCol: "SHOP_CONV_VALUE",
  shopQsrCol: "SHOP_QSR_VALUE",
  shopLubesCol: "SHOP_LUBES_VALUE",
  cashDropsCol: "CASH_DROPS",
  cashOnHandCol: "CASH_ON_HAND",
  speedpointCol: "SPEEDPOINT_CARD",
  fleetCardCol: "FLEET_CARD",
  eftCol: "EFT_SETTLED",
  vouchersCol: "VOUCHERS"
};
var POS_COLUMN_PRESETS = {
  WINBRANCH: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: "REC_TYPE",
    gradeCol: "PRODUCT_CODE",
    openingStockCol: "OPENING_VOL",
    deliveryCol: "RECEIPTS_VOL",
    closingAtgCol: "CLOSING_ATG_VOL",
    openMeterCol: "OPEN_TOT",
    closeMeterCol: "CLOSE_TOT",
    posLitresCol: "FUEL_POS_L",
    posValueCol: "FUEL_POS_ZAR",
    speedpointCol: "CARD_SPEEDPOINT"
  },
  ISIS: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: "SECTION",
    gradeCol: "GRADE_CODE",
    openingStockCol: "START_STOCK_L",
    deliveryCol: "DROP_L",
    closingAtgCol: "END_ATG_L",
    openMeterCol: "METER_START",
    closeMeterCol: "METER_END",
    posLitresCol: "DISPENSED_POS_L",
    posValueCol: "DISPENSED_POS_AMT",
    shopConvCol: "BONJOUR_SHOP_AMT",
    shopQsrCol: "BONJOUR_CAFE_AMT"
  },
  NAMOS: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: "LINE_KIND",
    gradeCol: "FUEL_GRADE",
    openingStockCol: "OPEN_STOCK_L",
    deliveryCol: "BOL_DELIVERY_L",
    closingAtgCol: "CLOSE_ATG_L",
    openMeterCol: "NOZZLE_OPEN",
    closeMeterCol: "NOZZLE_CLOSE",
    posLitresCol: "FORECOURT_POS_L",
    posValueCol: "FORECOURT_POS_AMT"
  },
  SYMPHONY: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: "SYMPHONY_TYPE",
    shopConvCol: "FRESHSTOP_RETAIL",
    shopQsrCol: "FRESHSTOP_QSR",
    shopLubesCol: "FORECOURT_LUBES",
    cashDropsCol: "SAFE_DROPS",
    cashOnHandCol: "TILL_CASH",
    speedpointCol: "BANK_CARD"
  },
  SMARTFUEL: {
    ...DEFAULT_COLUMN_MAP,
    gradeCol: "FUEL_PRODUCT",
    openingStockCol: "OPEN_TANK_L",
    closingAtgCol: "CLOSE_TANK_L",
    openMeterCol: "PUMP_OPEN",
    closeMeterCol: "PUMP_CLOSE"
  },
  GILBARCO: { ...DEFAULT_COLUMN_MAP },
  TOKHEIM: { ...DEFAULT_COLUMN_MAP },
  GENERIC_CSV: { ...DEFAULT_COLUMN_MAP },
  GENERIC_XML: { ...DEFAULT_COLUMN_MAP },
  MANUAL_QUICK_ENTRY: { ...DEFAULT_COLUMN_MAP }
};
function normalizeFuelGrade(raw) {
  const s = String(raw || "").trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (s.includes("93") || s === "LRP93" || s === "ULP93" || s === "UNLEADED_93") {
    return "ULP_93";
  }
  if (s.includes("95") || s === "ULP95" || s === "UNLEADED_95" || s.includes("SUPER") || s.includes("PETROL")) {
    return "ULP_95";
  }
  if (s.includes("10") || s.includes("LSD10") || s.includes("ULS") || s.includes("AGO_10")) {
    return "DIESEL_10PPM";
  }
  if (s.includes("50") || s.includes("DIESEL") || s.includes("AGO")) {
    return "DIESEL_50PPM";
  }
  if (s.includes("PARAFFIN") || s === "IP" || s.includes("KEROSENE")) {
    return "ILLUMINATING_PARAFFIN";
  }
  return "ULP_95";
}
function splitCsvLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}
function parseCsvRows(csvText) {
  const clean = csvText.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = clean.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith("#"));
  if (lines.length === 0) return { headers: [], rows: [] };
  const headerLine = lines[0];
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semiCount = (headerLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ";" : ",";
  const headers = splitCsvLine(headerLine, delimiter).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i], delimiter);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}
function numVal(row, colName, fallback = 0) {
  const raw = row[colName];
  if (raw === void 0 || raw === null || raw === "") return fallback;
  const parsed = Number(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}
function strVal(row, colName, fallback = "") {
  const raw = row[colName];
  return raw !== void 0 && raw !== null && String(raw).trim() !== "" ? String(raw).trim() : fallback;
}
function finalizeTotals(payload) {
  const fuelExpected = payload.fuelSalesByGrade.reduce(
    (sum, g) => sum + (g.posSalesValueLocal - g.driveOffValueLocal),
    0
  );
  const expectedTotalLocal = Math.round((fuelExpected + payload.shopSales.totalShopSalesLocal) * 100) / 100;
  const t = payload.tenders;
  const totalTenderedLocal = Math.round(
    (t.cashDropsLocal + t.cashOnHandLocal + t.speedpointCardLocal + t.fleetCardLocal + t.eftLocal + t.vouchersLocal) * 100
  ) / 100;
  const cashVarianceLocal = Math.round((totalTenderedLocal - expectedTotalLocal) * 100) / 100;
  return {
    ...payload,
    expectedTotalLocal,
    totalTenderedLocal,
    cashVarianceLocal
  };
}
function parseCsvShiftExport(csvText, vendor = "GENERIC_CSV", options) {
  const map = {
    ...POS_COLUMN_PRESETS[vendor] || DEFAULT_COLUMN_MAP,
    ...options?.columnOverrides || {}
  };
  const { rows } = parseCsvRows(csvText);
  const now = /* @__PURE__ */ new Date();
  const dateIso = options?.shiftDateIso || now.toISOString().split("T")[0];
  const tankReadings = [];
  const nozzleTotalizers = [];
  const fuelGradeMap = /* @__PURE__ */ new Map();
  let shopConv = 0;
  let shopQsr = 0;
  let shopLubes = 0;
  const tenders = {
    cashDropsLocal: 0,
    cashOnHandLocal: 0,
    speedpointCardLocal: 0,
    fleetCardLocal: 0,
    eftLocal: 0,
    vouchersLocal: 0
  };
  let detectedSite = options?.siteCode || "";
  let detectedShiftId = options?.shiftId || "";
  let detectedCashier = options?.cashierOrSupervisor || "";
  for (const row of rows) {
    if (!detectedSite && row.SITE_CODE) detectedSite = row.SITE_CODE;
    if (!detectedShiftId && row.SHIFT_ID) detectedShiftId = row.SHIFT_ID;
    if (!detectedCashier && (row.CASHIER || row.SUPERVISOR)) {
      detectedCashier = row.CASHIER || row.SUPERVISOR;
    }
    const recType = strVal(row, map.recordTypeCol, "").toUpperCase();
    if (recType === "TANK" || !recType && row[map.tankIdCol] && !row[map.nozzleIdCol]) {
      tankReadings.push({
        tankId: strVal(row, map.tankIdCol, `TK-0${tankReadings.length + 1}`),
        fuelGrade: normalizeFuelGrade(strVal(row, map.gradeCol, "ULP_95")),
        tankCapacityLitres: numVal(row, map.capacityCol, 3e4),
        openingLitres: numVal(row, map.openingStockCol, 0),
        deliveryLitres: numVal(row, map.deliveryCol, 0),
        closingAtgLitres: row[map.closingAtgCol] !== void 0 && row[map.closingAtgCol] !== "" ? numVal(row, map.closingAtgCol, 0) : void 0,
        closingManualDipMm: row[map.closingDipMmCol] !== void 0 && row[map.closingDipMmCol] !== "" ? numVal(row, map.closingDipMmCol, 0) : void 0,
        waterLevelMm: numVal(row, map.waterMmCol, 0),
        temperatureC: numVal(row, map.tempCol, 15)
      });
    } else if (recType === "NOZZLE" || !recType && row[map.nozzleIdCol]) {
      const grade = normalizeFuelGrade(strVal(row, map.gradeCol, "ULP_95"));
      const openTot = numVal(row, map.openMeterCol, 0);
      const closeTot = numVal(row, map.closeMeterCol, openTot);
      const testRet = numVal(row, map.pumpTestCol, 0);
      const unitPrice = numVal(row, map.unitPriceCol, 22.5);
      nozzleTotalizers.push({
        nozzleId: strVal(row, map.nozzleIdCol, `NZ-0${nozzleTotalizers.length + 1}`),
        pumpNumber: numVal(row, map.pumpNumberCol, nozzleTotalizers.length + 1),
        tankId: strVal(row, map.tankIdCol, "TK-01"),
        fuelGrade: grade,
        openingTotalizerLitres: openTot,
        closingTotalizerLitres: closeTot,
        pumpTestReturnLitres: testRet,
        unitPriceLocal: unitPrice
      });
      const posL = numVal(row, map.posLitresCol, 0);
      const posV = numVal(row, map.posValueCol, 0);
      if (posL > 0 || posV > 0) {
        const existing = fuelGradeMap.get(grade) || {
          fuelGrade: grade,
          posLitresSold: 0,
          posSalesValueLocal: 0,
          driveOffLitres: 0,
          driveOffValueLocal: 0
        };
        existing.posLitresSold += posL;
        existing.posSalesValueLocal += posV;
        existing.driveOffLitres += numVal(row, map.driveOffLitresCol, 0);
        existing.driveOffValueLocal += numVal(row, map.driveOffValueCol, 0);
        fuelGradeMap.set(grade, existing);
      }
    } else if (recType === "FUEL_SALE" || recType === "GRADE_SALE") {
      const grade = normalizeFuelGrade(strVal(row, map.gradeCol, "ULP_95"));
      const existing = fuelGradeMap.get(grade) || {
        fuelGrade: grade,
        posLitresSold: 0,
        posSalesValueLocal: 0,
        driveOffLitres: 0,
        driveOffValueLocal: 0
      };
      existing.posLitresSold += numVal(row, map.posLitresCol, 0);
      existing.posSalesValueLocal += numVal(row, map.posValueCol, 0);
      existing.driveOffLitres += numVal(row, map.driveOffLitresCol, 0);
      existing.driveOffValueLocal += numVal(row, map.driveOffValueCol, 0);
      fuelGradeMap.set(grade, existing);
    } else if (recType === "SHOP" || recType === "QSR" || recType === "FRESHSTOP") {
      shopConv += numVal(row, map.shopConvCol, 0);
      shopQsr += numVal(row, map.shopQsrCol, 0);
      shopLubes += numVal(row, map.shopLubesCol, 0);
    } else if (recType === "TENDER" || recType === "CASHUP") {
      tenders.cashDropsLocal += numVal(row, map.cashDropsCol, 0);
      tenders.cashOnHandLocal += numVal(row, map.cashOnHandCol, 0);
      tenders.speedpointCardLocal += numVal(row, map.speedpointCol, 0);
      tenders.fleetCardLocal += numVal(row, map.fleetCardCol, 0);
      tenders.eftLocal += numVal(row, map.eftCol, 0);
      tenders.vouchersLocal += numVal(row, map.vouchersCol, 0);
    }
  }
  if (fuelGradeMap.size === 0 && nozzleTotalizers.length > 0) {
    for (const nz of nozzleTotalizers) {
      const dispensed = Math.max(0, nz.closingTotalizerLitres - nz.openingTotalizerLitres - nz.pumpTestReturnLitres);
      const existing = fuelGradeMap.get(nz.fuelGrade) || {
        fuelGrade: nz.fuelGrade,
        posLitresSold: 0,
        posSalesValueLocal: 0,
        driveOffLitres: 0,
        driveOffValueLocal: 0
      };
      existing.posLitresSold += dispensed;
      existing.posSalesValueLocal += Math.round(dispensed * nz.unitPriceLocal * 100) / 100;
      fuelGradeMap.set(nz.fuelGrade, existing);
    }
  }
  const totalShopSalesLocal = Math.round((shopConv + shopQsr + shopLubes) * 100) / 100;
  return finalizeTotals({
    schemaVersion: "1.0",
    ingestionId: `ING-${vendor}-${Date.now().toString(36).toUpperCase()}`,
    siteCode: detectedSite || "STN-ALPHA",
    currency: options?.currency || "ZAR",
    shiftId: detectedShiftId || `SHF-${dateIso}-01`,
    shiftDateIso: dateIso,
    shiftStartIso: `${dateIso}T06:00:00.000Z`,
    shiftEndIso: `${dateIso}T14:00:00.000Z`,
    cashierOrSupervisor: detectedCashier || "Shift Supervisor A",
    sourceVendor: vendor,
    sourceVendors: [vendor],
    tankReadings,
    nozzleTotalizers,
    fuelSalesByGrade: Array.from(fuelGradeMap.values()),
    shopSales: {
      convenienceSalesLocal: Math.round(shopConv * 100) / 100,
      qsrFoodSalesLocal: Math.round(shopQsr * 100) / 100,
      lubricantsAndGasLocal: Math.round(shopLubes * 100) / 100,
      totalShopSalesLocal
    },
    tenders
  });
}
function readXmlTag(block, tagNames) {
  for (const tag of tagNames) {
    const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
    if (match) return match[1].trim();
  }
  return "";
}
function readXmlBlocks(xml, tagName) {
  const blocks = [];
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, "gi");
  let m;
  while ((m = regex.exec(xml)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}
function parseXmlShiftExport(xmlText, vendor = "GENERIC_XML", options) {
  const now = /* @__PURE__ */ new Date();
  const dateIso = readXmlTag(xmlText, ["ShiftDate", "Date"]) || options?.shiftDateIso || now.toISOString().split("T")[0];
  const siteCode = readXmlTag(xmlText, ["SiteCode", "StationId"]) || options?.siteCode || "STN-ALPHA";
  const shiftId = readXmlTag(xmlText, ["ShiftId", "ShiftNumber"]) || options?.shiftId || `SHF-${dateIso}-01`;
  const cashier = readXmlTag(xmlText, ["Supervisor", "Cashier"]) || options?.cashierOrSupervisor || "Shift Supervisor A";
  const tankReadings = readXmlBlocks(xmlText, "Tank").map((blk, i) => ({
    tankId: readXmlTag(blk, ["Id", "TankId"]) || `TK-0${i + 1}`,
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ["Grade", "Product", "FuelGrade"]) || "ULP_95"),
    tankCapacityLitres: Number(readXmlTag(blk, ["CapacityLitres", "Capacity"]) || 3e4),
    openingLitres: Number(readXmlTag(blk, ["OpeningLitres", "Opening"]) || 0),
    deliveryLitres: Number(readXmlTag(blk, ["DeliveryLitres", "Deliveries"]) || 0),
    closingAtgLitres: readXmlTag(blk, ["ClosingAtgLitres", "ClosingAtg", "ClosingLitres"]) ? Number(readXmlTag(blk, ["ClosingAtgLitres", "ClosingAtg", "ClosingLitres"])) : void 0,
    closingManualDipMm: readXmlTag(blk, ["ClosingDipMm"]) ? Number(readXmlTag(blk, ["ClosingDipMm"])) : void 0,
    waterLevelMm: Number(readXmlTag(blk, ["WaterMm", "WaterLevelMm"]) || 0),
    temperatureC: Number(readXmlTag(blk, ["TempC", "TemperatureC"]) || 15)
  }));
  const nozzleTotalizers = readXmlBlocks(xmlText, "Nozzle").map((blk, i) => ({
    nozzleId: readXmlTag(blk, ["Id", "NozzleId"]) || `NZ-0${i + 1}`,
    pumpNumber: Number(readXmlTag(blk, ["Pump", "PumpNumber"]) || i + 1),
    tankId: readXmlTag(blk, ["TankId"]) || "TK-01",
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ["Grade", "Product", "FuelGrade"]) || "ULP_95"),
    openingTotalizerLitres: Number(readXmlTag(blk, ["OpeningTotalizer", "OpeningMeter"]) || 0),
    closingTotalizerLitres: Number(readXmlTag(blk, ["ClosingTotalizer", "ClosingMeter"]) || 0),
    pumpTestReturnLitres: Number(readXmlTag(blk, ["TestReturnLitres", "PumpTest"]) || 0),
    unitPriceLocal: Number(readXmlTag(blk, ["UnitPrice", "Price"]) || 22.5)
  }));
  const fuelSalesByGrade = readXmlBlocks(xmlText, "FuelSale").map((blk) => ({
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ["Grade", "Product", "FuelGrade"]) || "ULP_95"),
    posLitresSold: Number(readXmlTag(blk, ["Litres", "PosLitresSold"]) || 0),
    posSalesValueLocal: Number(readXmlTag(blk, ["Value", "PosSalesValue"]) || 0),
    driveOffLitres: Number(readXmlTag(blk, ["DriveOffLitres"]) || 0),
    driveOffValueLocal: Number(readXmlTag(blk, ["DriveOffValue"]) || 0)
  }));
  const shopConv = Number(readXmlTag(xmlText, ["ConvenienceSales", "ShopSales"]) || 0);
  const shopQsr = Number(readXmlTag(xmlText, ["QsrSales", "FoodSales"]) || 0);
  const shopLubes = Number(readXmlTag(xmlText, ["LubricantsSales", "Lubes"]) || 0);
  const tenders = {
    cashDropsLocal: Number(readXmlTag(xmlText, ["CashDrops"]) || 0),
    cashOnHandLocal: Number(readXmlTag(xmlText, ["CashOnHand", "Cash"]) || 0),
    speedpointCardLocal: Number(readXmlTag(xmlText, ["SpeedpointCard", "Card"]) || 0),
    fleetCardLocal: Number(readXmlTag(xmlText, ["FleetCard"]) || 0),
    eftLocal: Number(readXmlTag(xmlText, ["Eft", "EFT"]) || 0),
    vouchersLocal: Number(readXmlTag(xmlText, ["Vouchers"]) || 0)
  };
  return finalizeTotals({
    schemaVersion: "1.0",
    ingestionId: `ING-${vendor}-${Date.now().toString(36).toUpperCase()}`,
    siteCode,
    currency: options?.currency || "ZAR",
    shiftId,
    shiftDateIso: dateIso,
    shiftStartIso: `${dateIso}T06:00:00.000Z`,
    shiftEndIso: `${dateIso}T14:00:00.000Z`,
    cashierOrSupervisor: cashier,
    sourceVendor: vendor,
    sourceVendors: [vendor],
    tankReadings,
    nozzleTotalizers,
    fuelSalesByGrade,
    shopSales: {
      convenienceSalesLocal: shopConv,
      qsrFoodSalesLocal: shopQsr,
      lubricantsAndGasLocal: shopLubes,
      totalShopSalesLocal: Math.round((shopConv + shopQsr + shopLubes) * 100) / 100
    },
    tenders
  });
}
function mergeShiftReconciliationStreams(forecourtPayload, shopPayload) {
  const combinedVendors = Array.from(
    /* @__PURE__ */ new Set([...forecourtPayload.sourceVendors, ...shopPayload.sourceVendors])
  );
  const mergedTenders = {
    cashDropsLocal: forecourtPayload.tenders.cashDropsLocal + shopPayload.tenders.cashDropsLocal,
    cashOnHandLocal: forecourtPayload.tenders.cashOnHandLocal + shopPayload.tenders.cashOnHandLocal,
    speedpointCardLocal: forecourtPayload.tenders.speedpointCardLocal + shopPayload.tenders.speedpointCardLocal,
    fleetCardLocal: forecourtPayload.tenders.fleetCardLocal + shopPayload.tenders.fleetCardLocal,
    eftLocal: forecourtPayload.tenders.eftLocal + shopPayload.tenders.eftLocal,
    vouchersLocal: forecourtPayload.tenders.vouchersLocal + shopPayload.tenders.vouchersLocal
  };
  const mergedShop = {
    convenienceSalesLocal: forecourtPayload.shopSales.convenienceSalesLocal + shopPayload.shopSales.convenienceSalesLocal,
    qsrFoodSalesLocal: forecourtPayload.shopSales.qsrFoodSalesLocal + shopPayload.shopSales.qsrFoodSalesLocal,
    lubricantsAndGasLocal: forecourtPayload.shopSales.lubricantsAndGasLocal + shopPayload.shopSales.lubricantsAndGasLocal,
    totalShopSalesLocal: Math.round(
      (forecourtPayload.shopSales.totalShopSalesLocal + shopPayload.shopSales.totalShopSalesLocal) * 100
    ) / 100
  };
  return finalizeTotals({
    schemaVersion: "1.0",
    ingestionId: `ING-DUAL-${Date.now().toString(36).toUpperCase()}`,
    siteCode: forecourtPayload.siteCode || shopPayload.siteCode,
    currency: forecourtPayload.currency,
    shiftId: forecourtPayload.shiftId || shopPayload.shiftId,
    shiftDateIso: forecourtPayload.shiftDateIso,
    shiftStartIso: forecourtPayload.shiftStartIso,
    shiftEndIso: forecourtPayload.shiftEndIso,
    cashierOrSupervisor: forecourtPayload.cashierOrSupervisor || shopPayload.cashierOrSupervisor,
    sourceVendor: forecourtPayload.sourceVendor,
    sourceVendors: combinedVendors,
    tankReadings: forecourtPayload.tankReadings.length > 0 ? forecourtPayload.tankReadings : shopPayload.tankReadings,
    nozzleTotalizers: forecourtPayload.nozzleTotalizers.length > 0 ? forecourtPayload.nozzleTotalizers : shopPayload.nozzleTotalizers,
    fuelSalesByGrade: forecourtPayload.fuelSalesByGrade.length > 0 ? forecourtPayload.fuelSalesByGrade : shopPayload.fuelSalesByGrade,
    shopSales: mergedShop,
    tenders: mergedTenders
  });
}
function validateWebhookPayload(body) {
  const errors = [];
  if (!body || typeof body !== "object") {
    return { valid: false, errors: ["Request body must be a JSON object."] };
  }
  const obj = body;
  if (typeof obj.rawContent === "string") {
    const vendor = obj.vendor || "GENERIC_CSV";
    const primary = obj.format === "XML" || obj.rawContent.trim().startsWith("<") ? parseXmlShiftExport(obj.rawContent, vendor, { siteCode: obj.siteCode }) : parseCsvShiftExport(obj.rawContent, vendor, { siteCode: obj.siteCode });
    if (obj.secondaryShopStream && typeof obj.secondaryShopStream.rawContent === "string") {
      const secVendor = obj.secondaryShopStream.vendor || "SYMPHONY";
      const secondary = obj.secondaryShopStream.format === "XML" || obj.secondaryShopStream.rawContent.trim().startsWith("<") ? parseXmlShiftExport(obj.secondaryShopStream.rawContent, secVendor, {
        siteCode: obj.siteCode
      }) : parseCsvShiftExport(obj.secondaryShopStream.rawContent, secVendor, {
        siteCode: obj.siteCode
      });
      return { valid: true, payload: mergeShiftReconciliationStreams(primary, secondary), errors: [] };
    }
    return { valid: true, payload: primary, errors: [] };
  }
  if (!obj.siteCode || typeof obj.siteCode !== "string") errors.push("siteCode is required.");
  if (!obj.shiftId || typeof obj.shiftId !== "string") errors.push("shiftId is required.");
  if (!Array.isArray(obj.tankReadings)) errors.push("tankReadings array is required.");
  if (!Array.isArray(obj.nozzleTotalizers)) errors.push("nozzleTotalizers array is required.");
  if (!obj.tenders || typeof obj.tenders !== "object") errors.push("tenders object is required.");
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  const shopSales = obj.shopSales || {
    convenienceSalesLocal: 0,
    qsrFoodSalesLocal: 0,
    lubricantsAndGasLocal: 0,
    totalShopSalesLocal: 0
  };
  const payload = finalizeTotals({
    schemaVersion: "1.0",
    ingestionId: obj.ingestionId || `ING-API-${Date.now().toString(36).toUpperCase()}`,
    siteCode: obj.siteCode,
    currency: obj.currency || "ZAR",
    shiftId: obj.shiftId,
    shiftDateIso: obj.shiftDateIso || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    shiftStartIso: obj.shiftStartIso || (/* @__PURE__ */ new Date()).toISOString(),
    shiftEndIso: obj.shiftEndIso || (/* @__PURE__ */ new Date()).toISOString(),
    cashierOrSupervisor: obj.cashierOrSupervisor || "POS Webhook",
    sourceVendor: obj.sourceVendor || "GENERIC_CSV",
    sourceVendors: Array.isArray(obj.sourceVendors) ? obj.sourceVendors : [obj.sourceVendor || "GENERIC_CSV"],
    tankReadings: obj.tankReadings,
    nozzleTotalizers: obj.nozzleTotalizers,
    fuelSalesByGrade: Array.isArray(obj.fuelSalesByGrade) ? obj.fuelSalesByGrade : [],
    shopSales,
    tenders: obj.tenders
  });
  return { valid: true, payload, errors: [] };
}

// src/lib/wetstock-engine.ts
var TANK_STRAPPING_TABLES = {
  23e3: [
    { mm: 0, litres: 0 },
    { mm: 250, litres: 1250 },
    { mm: 500, litres: 3650 },
    { mm: 750, litres: 6750 },
    { mm: 1e3, litres: 10200 },
    { mm: 1250, litres: 13700 },
    { mm: 1500, litres: 17050 },
    { mm: 1750, litres: 19950 },
    { mm: 2e3, litres: 22100 },
    { mm: 2200, litres: 23e3 }
  ],
  3e4: [
    { mm: 0, litres: 0 },
    { mm: 300, litres: 1850 },
    { mm: 600, litres: 5200 },
    { mm: 900, litres: 9600 },
    { mm: 1200, litres: 14600 },
    { mm: 1500, litres: 19650 },
    { mm: 1800, litres: 24300 },
    { mm: 2100, litres: 27950 },
    { mm: 2400, litres: 3e4 }
  ],
  35e3: [
    { mm: 0, litres: 0 },
    { mm: 300, litres: 2100 },
    { mm: 600, litres: 6100 },
    { mm: 900, litres: 11200 },
    { mm: 1200, litres: 17050 },
    { mm: 1500, litres: 22950 },
    { mm: 1800, litres: 28350 },
    { mm: 2100, litres: 32600 },
    { mm: 2400, litres: 35e3 }
  ],
  45e3: [
    { mm: 0, litres: 0 },
    { mm: 350, litres: 2950 },
    { mm: 700, litres: 8300 },
    { mm: 1050, litres: 15250 },
    { mm: 1400, litres: 22800 },
    { mm: 1750, litres: 30350 },
    { mm: 2100, litres: 37200 },
    { mm: 2450, litres: 42400 },
    { mm: 2700, litres: 45e3 }
  ]
};
function convertDipMmToLitres(dipMm, tankCapacityLitres = 3e4, customTable) {
  if (dipMm <= 0) return 0;
  const availableCaps = Object.keys(TANK_STRAPPING_TABLES).map(Number);
  const nearestCap = availableCaps.reduce(
    (prev, curr) => Math.abs(curr - tankCapacityLitres) < Math.abs(prev - tankCapacityLitres) ? curr : prev
  );
  const table = customTable && customTable.length >= 2 ? customTable : TANK_STRAPPING_TABLES[nearestCap];
  const scale = customTable ? 1 : tankCapacityLitres / nearestCap;
  const maxPoint = table[table.length - 1];
  if (dipMm >= maxPoint.mm) {
    return Math.round(maxPoint.litres * scale * 10) / 10;
  }
  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];
    if (dipMm >= p1.mm && dipMm <= p2.mm) {
      const ratio = (dipMm - p1.mm) / Math.max(p2.mm - p1.mm, 1);
      const interpolated = p1.litres + ratio * (p2.litres - p1.litres);
      return Math.round(interpolated * scale * 10) / 10;
    }
  }
  return 0;
}
function evaluateWaterInterface(waterMm, fuelGrade) {
  const isPetrol = fuelGrade === "ULP_93" || fuelGrade === "ULP_95";
  const warnThresholdMm = isPetrol ? 10 : 15;
  const maxAllowedMm = isPetrol ? 15 : 25;
  if (waterMm > maxAllowedMm) {
    return {
      status: "CRITICAL",
      waterMm,
      warnThresholdMm,
      maxAllowedMm,
      alertMessage: `CRITICAL WATER INGRESS: ${waterMm}mm exceeds ${maxAllowedMm}mm limit for ${fuelGrade}. Lock dispenser & drain water bottom immediately.`
    };
  }
  if (waterMm >= warnThresholdMm) {
    return {
      status: "WARNING",
      waterMm,
      warnThresholdMm,
      maxAllowedMm,
      alertMessage: `Water interface rising (${waterMm}mm). Schedule suction pump water purge before ${maxAllowedMm}mm cutoff.`
    };
  }
  return {
    status: "OK",
    waterMm,
    warnThresholdMm,
    maxAllowedMm,
    alertMessage: `Water-paste check clear (${waterMm}mm \u2264 ${maxAllowedMm}mm limit).`
  };
}
function reconcileShift(payload, options) {
  const dailyTolPct = options?.dailyVarianceTolerancePct ?? 0.5;
  const rolling30TolPct = options?.rolling30DayTolerancePct ?? 1;
  const cashTolLocal = options?.cashToleranceLocal ?? 50;
  const sirAlerts = [];
  const generatedNcrs = [];
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const nozzleResults = payload.nozzleTotalizers.map((nz) => {
    const grossDeltaLitres = Math.max(0, Math.round((nz.closingTotalizerLitres - nz.openingTotalizerLitres) * 10) / 10);
    const netDispensedLitres = Math.max(0, Math.round((grossDeltaLitres - nz.pumpTestReturnLitres) * 10) / 10);
    const expectedSalesValueLocal = Math.round(netDispensedLitres * nz.unitPriceLocal * 100) / 100;
    return {
      nozzleId: nz.nozzleId,
      pumpNumber: nz.pumpNumber,
      tankId: nz.tankId,
      fuelGrade: nz.fuelGrade,
      grossDeltaLitres,
      pumpTestReturnLitres: nz.pumpTestReturnLitres,
      netDispensedLitres,
      expectedSalesValueLocal
    };
  });
  const gradeSet = /* @__PURE__ */ new Set([
    ...nozzleResults.map((n) => n.fuelGrade),
    ...payload.fuelSalesByGrade.map((f) => f.fuelGrade)
  ]);
  const gradeMeterComparison = Array.from(gradeSet).map((grade) => {
    const nozzleNetDispensedLitres = Math.round(
      nozzleResults.filter((n) => n.fuelGrade === grade).reduce((s, n) => s + n.netDispensedLitres, 0) * 10
    ) / 10;
    const posEntry = payload.fuelSalesByGrade.find((f) => f.fuelGrade === grade);
    const posSoldLitres = posEntry ? posEntry.posLitresSold : nozzleNetDispensedLitres;
    const meterDriftLitres = Math.round((posSoldLitres - nozzleNetDispensedLitres) * 10) / 10;
    const meterDriftPercent = nozzleNetDispensedLitres > 0 ? Math.round(meterDriftLitres / nozzleNetDispensedLitres * 1e4) / 100 : 0;
    const driftFlagged = Math.abs(meterDriftPercent) > 0.3 && Math.abs(meterDriftLitres) > 15;
    if (driftFlagged) {
      sirAlerts.push({
        code: "NOZZLE_METER_DRIFT",
        severity: Math.abs(meterDriftPercent) > 0.75 ? "CRITICAL" : "WARNING",
        targetId: grade,
        message: `Nozzle totalizers (${nozzleNetDispensedLitres}L) vs POS sales (${posSoldLitres}L) drifted by ${meterDriftLitres}L (${meterDriftPercent}%).`
      });
      generatedNcrs.push({
        id: `NCR-NOZ-${payload.shiftId}-${grade}`.replace(/[^A-Z0-9-]/gi, ""),
        siteCode: payload.siteCode,
        category: "NOZZLE_METER_DRIFT",
        severity: Math.abs(meterDriftPercent) > 0.75 ? "CRITICAL" : "WARNING",
        title: `Nozzle Meter vs POS Drift on ${grade}`,
        description: `Discrepancy of ${meterDriftLitres}L (${meterDriftPercent}%) between electronic/mechanical nozzle totalizers and POS fuel sales.`,
        statutoryReference: "SANS 10089-3 / Legal Metrology Calibration",
        measuredValue: `${meterDriftLitres} L (${meterDriftPercent}%)`,
        thresholdValue: "\xB10.30%",
        status: "OPEN",
        createdAtIso: nowIso,
        slaHours: 12
      });
    }
    return {
      fuelGrade: grade,
      nozzleNetDispensedLitres,
      posSoldLitres,
      meterDriftLitres,
      meterDriftPercent,
      driftFlagged
    };
  });
  const tankResults = payload.tankReadings.map((tk) => {
    const linkedNozzles = nozzleResults.filter((n) => n.tankId === tk.tankId);
    const netDispensedLitres = linkedNozzles.length > 0 ? Math.round(linkedNozzles.reduce((s, n) => s + n.netDispensedLitres, 0) * 10) / 10 : payload.fuelSalesByGrade.filter((f) => f.fuelGrade === tk.fuelGrade).reduce((s, f) => s + f.posLitresSold, 0);
    const bookStockLitres = Math.round((tk.openingLitres + tk.deliveryLitres - netDispensedLitres) * 10) / 10;
    const actualClosingLitres = typeof tk.closingAtgLitres === "number" ? tk.closingAtgLitres : typeof tk.closingManualDipLitres === "number" ? tk.closingManualDipLitres : typeof tk.closingManualDipMm === "number" ? convertDipMmToLitres(tk.closingManualDipMm, tk.tankCapacityLitres) : bookStockLitres;
    const varianceLitres = Math.round((actualClosingLitres - bookStockLitres) * 10) / 10;
    const throughputBase = Math.max(netDispensedLitres, 1);
    const variancePercent = Math.round(varianceLitres / throughputBase * 1e4) / 100;
    const hist = options?.rolling30DayHistory?.find((h) => h.tankId === tk.tankId);
    const rollingVar = (hist?.cumulative30DayVarianceLitres ?? 0) + varianceLitres;
    const rollingThroughput = Math.max(
      (hist?.cumulative30DayThroughputLitres ?? 0) + netDispensedLitres,
      1
    );
    const rolling30DayDriftPercent = Math.round(rollingVar / rollingThroughput * 1e4) / 100;
    const dailyThresholdBreached = Math.abs(variancePercent) > dailyTolPct;
    const rolling30DayBreached = Math.abs(rolling30DayDriftPercent) > rolling30TolPct;
    const waterStatus = evaluateWaterInterface(tk.waterLevelMm, tk.fuelGrade);
    if (dailyThresholdBreached) {
      sirAlerts.push({
        code: "DAILY_VARIANCE",
        severity: "CRITICAL",
        targetId: tk.tankId,
        message: `Tank ${tk.tankId} daily variance ${varianceLitres}L (${variancePercent}%) exceeds \xB1${dailyTolPct}% limit.`
      });
      generatedNcrs.push({
        id: `NCR-WET-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ""),
        siteCode: payload.siteCode,
        category: "WETSTOCK_VARIANCE",
        severity: "CRITICAL",
        title: `Daily Wetstock Variance Breach on ${tk.tankId} (${tk.fuelGrade})`,
        description: `Book Stock (${bookStockLitres}L) vs Physical Closing (${actualClosingLitres}L) variance of ${varianceLitres}L (${variancePercent}%) breached \xB1${dailyTolPct}%.`,
        statutoryReference: "SANS 10089-3 / NEMA Section 30",
        measuredValue: `${varianceLitres} L (${variancePercent}%)`,
        thresholdValue: `\xB1${dailyTolPct}%`,
        status: "OPEN",
        createdAtIso: nowIso,
        slaHours: 4
      });
    }
    if (rolling30DayBreached) {
      sirAlerts.push({
        code: "SIR_30DAY_DRIFT",
        severity: "CRITICAL",
        targetId: tk.tankId,
        message: `Tank ${tk.tankId} 30-day rolling cumulative SIR drift ${rolling30DayDriftPercent}% exceeds \xB1${rolling30TolPct}% leak threshold.`
      });
      generatedNcrs.push({
        id: `NCR-SIR-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ""),
        siteCode: payload.siteCode,
        category: "SIR_30DAY_DRIFT",
        severity: "CRITICAL",
        title: `30-Day Rolling SIR Leak Drift on ${tk.tankId}`,
        description: `Cumulative 30-day SIR variance reached ${rolling30DayDriftPercent}% (${Math.round(rollingVar)}L across ${Math.round(rollingThroughput)}L throughput). Initiate line tightness & sump inspection.`,
        statutoryReference: "SANS 10089-3 SIR Trend Governance",
        measuredValue: `${rolling30DayDriftPercent}%`,
        thresholdValue: `\xB1${rolling30TolPct}%`,
        status: "OPEN",
        createdAtIso: nowIso,
        slaHours: 4
      });
    }
    if (waterStatus.status === "CRITICAL") {
      sirAlerts.push({
        code: "WATER_INGRESS",
        severity: "CRITICAL",
        targetId: tk.tankId,
        message: waterStatus.alertMessage
      });
      generatedNcrs.push({
        id: `NCR-H2O-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ""),
        siteCode: payload.siteCode,
        category: "WATER_INGRESS",
        severity: "CRITICAL",
        title: `Water Interface Ingress on ${tk.tankId} (${tk.fuelGrade})`,
        description: waterStatus.alertMessage,
        statutoryReference: "SANS 10089-3 Tank Integrity",
        measuredValue: `${tk.waterLevelMm} mm`,
        thresholdValue: `${waterStatus.maxAllowedMm} mm`,
        status: "OPEN",
        createdAtIso: nowIso,
        slaHours: 2
      });
    }
    const status = dailyThresholdBreached || rolling30DayBreached || waterStatus.status === "CRITICAL" ? "CRITICAL_BREACH" : waterStatus.status === "WARNING" ? "WARNING" : "COMPLIANT";
    return {
      tankId: tk.tankId,
      fuelGrade: tk.fuelGrade,
      openingLitres: tk.openingLitres,
      deliveryLitres: tk.deliveryLitres,
      netDispensedLitres,
      bookStockLitres,
      actualClosingLitres,
      varianceLitres,
      variancePercent,
      rolling30DayDriftPercent,
      waterStatus,
      dailyThresholdBreached,
      rolling30DayBreached,
      status
    };
  });
  const grossFuel = payload.fuelSalesByGrade.reduce((s, f) => s + f.posSalesValueLocal, 0);
  const driveOffDeductionLocal = Math.round(payload.fuelSalesByGrade.reduce((s, f) => s + f.driveOffValueLocal, 0) * 100) / 100;
  const expectedFuelRevenueLocal = Math.round((grossFuel - driveOffDeductionLocal) * 100) / 100;
  const expectedShopRevenueLocal = Math.round(payload.shopSales.totalShopSalesLocal * 100) / 100;
  const expectedTotalLocal = Math.round((expectedFuelRevenueLocal + expectedShopRevenueLocal) * 100) / 100;
  const td = payload.tenders;
  const totalTenderedLocal = Math.round(
    (td.cashDropsLocal + td.cashOnHandLocal + td.speedpointCardLocal + td.fleetCardLocal + td.eftLocal + td.vouchersLocal) * 100
  ) / 100;
  const cashVarianceLocal = Math.round((totalTenderedLocal - expectedTotalLocal) * 100) / 100;
  const withinTolerance = Math.abs(cashVarianceLocal) <= cashTolLocal;
  if (!withinTolerance) {
    const severity = Math.abs(cashVarianceLocal) > cashTolLocal * 4 ? "CRITICAL" : "WARNING";
    sirAlerts.push({
      code: "CASH_UP_VARIANCE",
      severity,
      targetId: payload.shiftId,
      message: `Shift cash-up ${cashVarianceLocal < 0 ? "SHORT" : "OVER"} of ${payload.currency} ${cashVarianceLocal} exceeds \xB1${cashTolLocal}.`
    });
    generatedNcrs.push({
      id: `NCR-CSH-${payload.shiftId}`.replace(/[^A-Z0-9-]/gi, ""),
      siteCode: payload.siteCode,
      category: "CASH_UP_VARIANCE",
      severity,
      title: `Shift Cash-Up ${cashVarianceLocal < 0 ? "Shortage" : "Overage"} (${payload.shiftId})`,
      description: `Expected ${payload.currency} ${expectedTotalLocal.toLocaleString()} vs Tendered ${payload.currency} ${totalTenderedLocal.toLocaleString()} (Variance: ${cashVarianceLocal}).`,
      statutoryReference: "Forecourt Cash Control & Till Audit SOP",
      measuredValue: `${payload.currency} ${cashVarianceLocal}`,
      thresholdValue: `\xB1${payload.currency} ${cashTolLocal}`,
      status: "OPEN",
      createdAtIso: nowIso,
      slaHours: 8
    });
  }
  const hasCritical = tankResults.some((t) => t.status === "CRITICAL_BREACH") || sirAlerts.some((a) => a.severity === "CRITICAL");
  const hasWarning = tankResults.some((t) => t.status === "WARNING") || sirAlerts.length > 0;
  return {
    ingestionId: payload.ingestionId,
    siteCode: payload.siteCode,
    shiftId: payload.shiftId,
    sourceVendors: payload.sourceVendors,
    tankResults,
    nozzleResults,
    gradeMeterComparison,
    cashUpSummary: {
      expectedFuelRevenueLocal,
      expectedShopRevenueLocal,
      driveOffDeductionLocal,
      expectedTotalLocal,
      totalTenderedLocal,
      cashVarianceLocal,
      withinTolerance
    },
    sirAlerts,
    generatedNcrs,
    overallStatus: hasCritical ? "CRITICAL_BREACH" : hasWarning ? "WARNING" : "COMPLIANT"
  };
}

// server/posIngestHandler.ts
function send(res, status, payload) {
  if (res && typeof res.status === "function") {
    return res.status(status).json(payload);
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function getHeader(req, name) {
  const headers = req?.headers || {};
  const direct = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(direct)) return String(direct[0] || "").trim();
  return direct ? String(direct).trim() : "";
}
function isAuthorizedApiKey(apiKey, tenantId) {
  if (!apiKey) return { ok: false, authMode: "sandbox-demo" };
  const configuredJson = process.env.POS_INGEST_API_KEYS;
  const singleConfiguredKey = process.env.POS_INGEST_API_KEY;
  if (configuredJson) {
    try {
      const map = JSON.parse(configuredJson);
      if (map[tenantId] && map[tenantId] === apiKey) {
        return { ok: true, authMode: "configured-key" };
      }
      return { ok: false, authMode: "configured-key" };
    } catch {
      return { ok: false, authMode: "configured-key" };
    }
  }
  if (singleConfiguredKey) {
    return { ok: apiKey === singleConfiguredKey, authMode: "configured-key" };
  }
  const expectedDemoKey = `DEMO-POS-KEY-${(tenantId || "STN-ALPHA").toUpperCase()}`;
  if (apiKey === expectedDemoKey || apiKey === "DEMO-POS-KEY-STN-ALPHA") {
    return { ok: true, authMode: "sandbox-demo" };
  }
  return { ok: false, authMode: "sandbox-demo" };
}
async function posIngestHandler(req, res) {
  if (req.method !== "POST") {
    return send(res, 405, { success: false, error: "Method Not Allowed. Use POST." });
  }
  const tenantId = getHeader(req, "x-tenant-id") || "STN-ALPHA";
  const bearer = getHeader(req, "authorization").replace(/^Bearer\s+/i, "").trim();
  const apiKey = getHeader(req, "x-api-key") || bearer;
  const auth = isAuthorizedApiKey(apiKey, tenantId);
  if (!auth.ok) {
    return send(res, 401, {
      success: false,
      error: "Unauthorized: valid x-api-key (or Bearer token) for tenant is required."
    });
  }
  try {
    let body = req.body;
    if (typeof body === "string") {
      body = body.trim() ? JSON.parse(body) : {};
    }
    const validation = validateWebhookPayload(body);
    if (!validation.valid || !validation.payload) {
      return send(res, 400, {
        success: false,
        error: "Invalid POS shift ingestion payload.",
        errors: validation.errors
      });
    }
    const canonicalPayload = {
      ...validation.payload,
      siteCode: tenantId || validation.payload.siteCode
    };
    const reconciliation = reconcileShift(canonicalPayload);
    const sha256Digest = createHash("sha256").update(JSON.stringify({ canonicalPayload, reconciliation })).digest("hex");
    return send(res, 200, {
      success: true,
      ingestionId: canonicalPayload.ingestionId,
      tenantId: canonicalPayload.siteCode,
      authMode: auth.authMode,
      sha256Digest,
      receivedAt: (/* @__PURE__ */ new Date()).toISOString(),
      payload: canonicalPayload,
      reconciliation
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return send(res, 400, { success: false, error: "Request body must be valid JSON." });
    }
    return send(res, 500, {
      success: false,
      error: "Failed to process POS shift ingestion payload."
    });
  }
}
export {
  posIngestHandler as default
};
