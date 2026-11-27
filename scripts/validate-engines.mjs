import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

// Bundle the two TypeScript engines to a temporary ESM bundle for Node execution
const tmpBundle = '.tmp-validate-engines.mjs';

try {
  await build({
    stdin: {
      contents: `
        export * from './src/lib/pos-ingestion-adapter.ts';
        export * from './src/lib/wetstock-engine.ts';
      `,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile: tmpBundle,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
  });

  const mod = await import(`${pathToFileURL(path.resolve(tmpBundle)).href}?t=${Date.now()}`);

  // 1. Test WinBranch (BP/Engen) CSV parsing & normalization
  const wbCsv = mod.generateSamplePosExport('WINBRANCH', 'CSV');
  const wbPayload = mod.parseCsvShiftExport(wbCsv, 'WINBRANCH');
  assert.equal(wbPayload.sourceVendor, 'WINBRANCH');
  assert.equal(wbPayload.tankReadings.length, 2);
  assert.equal(wbPayload.nozzleTotalizers.length, 2);
  assert.equal(wbPayload.shopSales.totalShopSalesLocal, 33500);

  // 2. Test ISIS (TotalEnergies) XML parsing & normalization
  const isisXml = mod.generateSamplePosExport('ISIS', 'XML');
  const isisPayload = mod.parseXmlShiftExport(isisXml, 'ISIS');
  assert.equal(isisPayload.sourceVendor, 'ISIS');
  assert.equal(isisPayload.siteCode, 'TOT-ZA-005');
  assert.equal(isisPayload.tankReadings.length, 2);
  assert.equal(isisPayload.fuelSalesByGrade.length, 2);

  // 3. Test Astron Energy Dual-System Merge: NAMOS (Forecourt) + SYMPHONY (FreshStop Shop/QSR)
  const namosCsv = mod.generateSamplePosExport('NAMOS', 'CSV');
  const symphonyCsv = mod.generateSamplePosExport('SYMPHONY', 'CSV');
  const namosPayload = mod.autoDetectVendorAndParse(namosCsv, 'namos_shift.csv');
  const symphonyPayload = mod.autoDetectVendorAndParse(symphonyCsv, 'symphony_freshstop.csv');
  const mergedAstron = mod.mergeShiftReconciliationStreams(namosPayload, symphonyPayload);
  assert.deepEqual(mergedAstron.sourceVendors, ['NAMOS', 'SYMPHONY']);
  assert.equal(mergedAstron.tankReadings.length, 2);
  assert.equal(mergedAstron.shopSales.totalShopSalesLocal, 42500);
  assert.equal(mergedAstron.expectedTotalLocal, 195750 + 42500);
  assert.equal(mergedAstron.cashVarianceLocal, 0);

  // 4. Test SmartFuel, Gilbarco, Tokheim, Generic CSV
  const sfPayload = mod.parseCsvShiftExport(mod.generateSamplePosExport('SMARTFUEL', 'CSV'), 'SMARTFUEL');
  assert.equal(sfPayload.sourceVendor, 'SMARTFUEL');
  const gilPayload = mod.parseXmlShiftExport(mod.generateSamplePosExport('GILBARCO', 'XML'), 'GILBARCO');
  assert.equal(gilPayload.sourceVendor, 'GILBARCO');
  const tokPayload = mod.parseXmlShiftExport(mod.generateSamplePosExport('TOKHEIM', 'XML'), 'TOKHEIM');
  assert.equal(tokPayload.sourceVendor, 'TOKHEIM');

  // 5. Test Tank Strapping Interpolation (mm -> Litres)
  const l0 = mod.convertDipMmToLitres(0, 30000);
  const l900 = mod.convertDipMmToLitres(900, 30000);
  const l1050 = mod.convertDipMmToLitres(1050, 30000);
  const l2400 = mod.convertDipMmToLitres(2400, 30000);
  assert.equal(l0, 0);
  assert.equal(l900, 9600);
  assert.equal(l1050, 12100);
  assert.equal(l2400, 30000);

  // 6. Test 15°C Thermal Expansion Compensation
  const petrolHot = mod.compensateVolumeTo15C(10000, 25, 'ULP_95');
  assert.equal(petrolHot.alpha, 0.0012);
  assert.equal(petrolHot.compensated15CLitres, 9880);
  const dieselCold = mod.compensateVolumeTo15C(10000, 10, 'DIESEL_50PPM');
  assert.equal(dieselCold.alpha, 0.00085);
  assert.equal(dieselCold.compensated15CLitres, 10042.5);

  // 7. Test Pre-Offload Safety Gate & BOL Shortage NCR
  const blockedGate = mod.evaluatePreOffloadSafetyGate({
    tankId: 'TK-01',
    tankGrade: 'ULP_95',
    bolGrade: 'DIESEL_50PPM',
    tankCapacityLitres: 30000,
    preDropLitres: 20000,
    bolLitres: 15000,
    earthingGrounded: false,
    spillKitStaged: true,
    fireExtinguishersPositioned: true,
    drainIsolationClosed: true,
  });
  assert.equal(blockedGate.passed, false);
  assert.ok(blockedGate.blockingReasons.length >= 3);

  const bolShortage = mod.verifyTankerDeliveryBol({
    siteCode: 'STN-ALPHA',
    tankId: 'TK-01',
    bolReference: 'BOL-TEST-99',
    fuelGrade: 'ULP_95',
    tankCapacityLitres: 30000,
    preDropLitres: 5000,
    postDropLitres: 19600,
    salesDuringDropLitres: 0,
    bolLitres: 15000,
    bolTemperatureC: 15,
    tankTemperatureC: 15,
    safetyGate: {
      bolGrade: 'ULP_95',
      earthingGrounded: true,
      spillKitStaged: true,
      fireExtinguishersPositioned: true,
      drainIsolationClosed: true,
    },
  });
  assert.equal(bolShortage.status, 'SHORTAGE_NCR');
  assert.ok(bolShortage.ncr && bolShortage.ncr.category === 'BOL_SHORTAGE');

  // 8. Test Shift Cash-Up, Wetstock Variance, SIR 30-Day Drift, Nozzle Drift, Water Ingress & Auto-NCRs
  const manualBreach = mod.buildManualQuickEntryPayload({
    siteCode: 'STN-ALPHA',
    shiftId: 'SHF-BREACH-01',
    cashierOrSupervisor: 'Tester',
    tankReadings: [
      {
        tankId: 'TK-01',
        fuelGrade: 'ULP_95',
        tankCapacityLitres: 30000,
        openingLitres: 15000,
        deliveryLitres: 5000,
        closingAtgLitres: 14800, // Book = 15000 + 5000 - 5000 = 15000 => -200L (-4.0%)
        waterLevelMm: 18, // > 15mm limit for ULP
        temperatureC: 15,
      },
    ],
    nozzleTotalizers: [
      {
        nozzleId: 'NZ-01',
        pumpNumber: 1,
        tankId: 'TK-01',
        fuelGrade: 'ULP_95',
        openingTotalizerLitres: 100000,
        closingTotalizerLitres: 105000,
        pumpTestReturnLitres: 0,
        unitPriceLocal: 22.5,
      },
    ],
    fuelSalesByGrade: [
      {
        fuelGrade: 'ULP_95',
        posLitresSold: 4950, // -50L (-1.0%) nozzle drift
        posSalesValueLocal: 111375,
        driveOffLitres: 0,
        driveOffValueLocal: 0,
      },
    ],
    shopSales: {
      convenienceSalesLocal: 1000,
      qsrFoodSalesLocal: 0,
      lubricantsAndGasLocal: 0,
      totalShopSalesLocal: 1000,
    },
    tenders: {
      cashDropsLocal: 112000, // Short by 375
      cashOnHandLocal: 0,
      speedpointCardLocal: 0,
      fleetCardLocal: 0,
      eftLocal: 0,
      vouchersLocal: 0,
    },
  });

  const report = mod.reconcileShift(manualBreach, {
    rolling30DayHistory: [
      {
        tankId: 'TK-01',
        cumulative30DayVarianceLitres: -900,
        cumulative30DayThroughputLitres: 80000,
      },
    ],
  });

  assert.equal(report.overallStatus, 'CRITICAL_BREACH');
  assert.equal(report.tankResults[0].bookStockLitres, 15000);
  assert.equal(report.tankResults[0].varianceLitres, -200);
  assert.equal(report.tankResults[0].variancePercent, -4);
  assert.equal(report.tankResults[0].dailyThresholdBreached, true);
  assert.equal(report.tankResults[0].rolling30DayBreached, true);
  assert.equal(report.tankResults[0].waterStatus.status, 'CRITICAL');
  assert.equal(report.gradeMeterComparison[0].driftFlagged, true);
  assert.equal(report.cashUpSummary.withinTolerance, false);

  const ncrCategories = new Set(report.generatedNcrs.map((n) => n.category));
  assert.ok(ncrCategories.has('WETSTOCK_VARIANCE'));
  assert.ok(ncrCategories.has('SIR_30DAY_DRIFT'));
  assert.ok(ncrCategories.has('WATER_INGRESS'));
  assert.ok(ncrCategories.has('NOZZLE_METER_DRIFT'));
  assert.ok(ncrCategories.has('CASH_UP_VARIANCE'));

  console.log('ALL DETERMINISTIC WETSTOCK & POS ADAPTER ENGINE ASSERTIONS PASSED!');
} finally {
  if (fs.existsSync(tmpBundle)) {
    fs.unlinkSync(tmpBundle);
  }
}
