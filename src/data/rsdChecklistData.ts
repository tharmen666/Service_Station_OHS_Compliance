// Extracted Forecourt & Convenience Store RSD 26 Risk Assessment Checklists
// Standard Compliance Framework: RSD 26 Risk Assessments

export interface ChecklistItem {
  id: string;
  category: string;
  referenceCode: string;
  item: string;
  weighting: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  guidance: string;
}

export const dailyChecklists: ChecklistItem[] = [
  {
    "id": "DAILY-01",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.1.",
    "item": "All entries on the SDN auto receipts report are valid and correct.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Not sure which reports are available as a tool for Retail Store deliveries."
  },
  {
    "id": "DAILY-02",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.2.",
    "item": "All DUs awaiting despatch are despatched within 2 days.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "RTVs processed. Not sure if there is any reporting tool available."
  },
  {
    "id": "DAILY-03",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.3.",
    "item": "Stock reflected as \u201coverdue despatch notifications\u201d on SIMS still in the store.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "RTVs processed. Not sure if there is any reporting tool available."
  },
  {
    "id": "DAILY-04",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.4.",
    "item": "Shrinkage adjustment transaction created on SIMS where there are lug discrepancies.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Shortage of lugs received and not a full dolley. Not sure how this is processed in a Service Station environment."
  },
  {
    "id": "DAILY-05",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.5.",
    "item": "Stock rotation disciplines in place.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 20 items across all disciplines (i.e. perishables and long life). Floor walk-about."
  },
  {
    "id": "DAILY-06",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.6.",
    "item": "No outdated stock on display.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Floor walk-about."
  },
  {
    "id": "DAILY-07",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.7.",
    "item": "Confirmed waste reports were checked and signed off by management.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample period for review."
  },
  {
    "id": "DAILY-08",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.8.",
    "item": "Confirmed waste was recorded against the correct reason codes.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Verify daily operational hygiene and stock freshness disciplines."
  },
  {
    "id": "DAILY-09",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.9.",
    "item": "Unsold waste, agreed to the captured confirmed waste.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Perform a sample review of the day of the audit."
  },
  {
    "id": "DAILY-10",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.10.",
    "item": "SIMS Despatched SDN report is attached to the relevant RTV as evidence of the Sasko bread being despatched.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "RTV transactions for our bread supplier. Select a sample period for review."
  },
  {
    "id": "DAILY-11",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.11.",
    "item": "SIMS Despatched SDN report is signed by the driver collecting the magazines and bread.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "RTV transactions for our bread supplier. As above."
  },
  {
    "id": "DAILY-12",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.12.",
    "item": "TOOS information reflected on the RF scanner agrees to the TOOS SELs on display in long life i.e. TOOS SEL disciplines in place and TOOS process adhered to.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 10 items. On the day of the audit."
  },
  {
    "id": "DAILY-13",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "1.13.",
    "item": "TOOS information reflected on the RF scanner agrees to the TOOS SELs on display in perishables i.e. TOOS SEL disciplines in place and TOOS process adhered to.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 10 items. On the day of the audit."
  },
  {
    "id": "DAILY-14",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.1.",
    "item": "Stock is securely stored and locked in the back area i.e. hot items, magazines.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Walk-about on the day of the audit."
  },
  {
    "id": "DAILY-15",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.2.",
    "item": "High shrinkage food items (as per the stock loss plan) are tagged.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Not sure if tagging of high priced merchandise is done. Select a sample of 10 items to verify."
  },
  {
    "id": "DAILY-16",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.3.",
    "item": "The seal number on the truck is verified to the seal number recorded on the LCS.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample period for review."
  },
  {
    "id": "DAILY-17",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.4.",
    "item": "Process for dealing with broken, mismatched or altered seals is in place and adhered to.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Based on the sample of LCSs reviewed above."
  },
  {
    "id": "DAILY-18",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.5.",
    "item": "Stores are counting the lugs when off loaded from the truck and annotated on the LCS. Where there are shortages annotated ensure that a call was logged with the DC.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Based on the sample of LCSs reviewed above."
  },
  {
    "id": "DAILY-19",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.6.",
    "item": "Claim raised for stock short delivered i.e. dolley of stock short delivered.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Based on the sample of LCSs reviewed above."
  },
  {
    "id": "DAILY-20",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.7.",
    "item": "The quantities on the supplier delivery note balances to the GRN for Coca Cola / beverage deliveries.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample period for review."
  },
  {
    "id": "DAILY-21",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "2.8.",
    "item": "Price management in place \u2013 price discrepancy report on Matra actioned.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Not sure what pricing tool Service Station has to ensure that there is a detective control in place. Select a sample period for review."
  },
  {
    "id": "DAILY-22",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.1.",
    "item": "Weekly CPA document retention control sheet in place with the relevant reports filed.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a smaple period for review.\n\u2022 Hot food hygiene checklist\n\u2022 Scale calibration sheet\n\u2022 Load control sheets (LCSs)\n\u2022 Food destruction certificates"
  },
  {
    "id": "DAILY-23",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.2.",
    "item": "Adherence to the sale of food waste in respect of the \u201cuse by date\u201d and \u201cbest before date\u201d.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 10 items each for the various food waste categories in terms of shelf life post the sell by date. Perform on day of audit."
  },
  {
    "id": "DAILY-24",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.3.",
    "item": "The Price Changes report has been printed, actioned and new SELs updated and been placed on the shelves.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 20 items across all disciplines. Not sure which reporting / implementation tool available at Service Station."
  },
  {
    "id": "DAILY-25",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.4.",
    "item": "The \u201cOn / Off\u201d promotions report has been actioned and new SELs updated and been placed on the shelves.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 10 items. Not sure which reporting / implementation tool available at Service Station."
  },
  {
    "id": "DAILY-26",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.5.",
    "item": "Products on promotion are valid i.e. promotion ended and relevant stock removed from display.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample of 10 items. Not sure which reporting / implementation tool available at Service Station."
  },
  {
    "id": "DAILY-27",
    "category": "Daily Foodstock & Perishables Audit",
    "referenceCode": "3.6.",
    "item": "For non-price marked products, the price on the SEL matches the system price / RF scanner and for price marked products, the price on the product matches the system price / RF scanner.",
    "weighting": 2,
    "frequency": "Daily",
    "guidance": "Select a sample 20 items across all disciplines. Not sure which tools are available."
  }
];

export const weeklyChecklists: ChecklistItem[] = [
  {
    "id": "WEEKLY-01",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.1",
    "item": "A General Cleaning Standards",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-02",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.2",
    "item": "Produce and Bakery Display Tall Boys Cleaning Standards",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-03",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.3",
    "item": "High Level Cleaning Walls/Ceiling",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-04",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.4",
    "item": "Refrigerated and Freezer Display Units Standard and Frequency of Cleaning",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-05",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.5",
    "item": "Trolley and Basket Cleaning",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-06",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.6",
    "item": "Contract Cleaning Details and assessment of cleaning (capture name of contractor)",
    "weighting": 1,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-07",
    "category": "1. General Cleaning Standards",
    "referenceCode": "1.7",
    "item": "Cleaning inspection conducted and signed off by management.",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-08",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.1",
    "item": "Cleaning Store and Housekeeping",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-09",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.2",
    "item": "Are all chemicals compliant to the Retail Store guidelines for chemical suppliers",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-10",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.3",
    "item": "Only approved food-grade chemical products listed below may be used under SANS 1828 and SANS 1853 guidelines:",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-11",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.4",
    "item": "No mops, wooden brooms, feather dusters",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-12",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.5",
    "item": "All equipment colour",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-13",
    "category": "2. Cleaning Equipment and Chemicals",
    "referenceCode": "2.6",
    "item": "Stored separately, off the floor",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-14",
    "category": "3. Cold Chain",
    "referenceCode": "3.1",
    "item": "Refrigerated Display Units Temp",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-15",
    "category": "3. Cold Chain",
    "referenceCode": "3.2",
    "item": "Black mats (used for produce)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-16",
    "category": "3. Cold Chain",
    "referenceCode": "3.3",
    "item": "Receiving Temp Recording recorded on the LCS Load Control Sheet and",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-17",
    "category": "3. Cold Chain",
    "referenceCode": "3.4",
    "item": "3 x Daily temperature check records",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-18",
    "category": "3. Cold Chain",
    "referenceCode": "3.5",
    "item": "Retail Store Cold Room Temperature Compliance",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-19",
    "category": "3. Cold Chain",
    "referenceCode": "3.6",
    "item": "Thermometer calibration (Testo) -- annual certificate available and valid",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-20",
    "category": "3. Cold Chain",
    "referenceCode": "3.6",
    "item": "Is the thermometer in good working condition?",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-21",
    "category": "4. Stock Management",
    "referenceCode": "4.1",
    "item": "Expired Stock Food,",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-22",
    "category": "4. Stock Management",
    "referenceCode": "4.2",
    "item": "Stock Rotation in place on sales floor and back area's (Take a sample of 10 lines from Sales Floor and 10 from Back area)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-23",
    "category": "4. Stock Management",
    "referenceCode": "4.3",
    "item": "Check that all lines are merchandised on sales floor and not in back area",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-24",
    "category": "4. Stock Management",
    "referenceCode": "4.4",
    "item": "Waste Recorded against correct reason code",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-25",
    "category": "4. Stock Management",
    "referenceCode": "4.5",
    "item": "The seal number on the truck is verified to the seal number recorded on the LCS. (Check 1 day per week from the last 6 weeks)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-26",
    "category": "4. Stock Management",
    "referenceCode": "4.6",
    "item": "Stores are counting the lugs when off loaded from the truck and annotated on the LCS. Where there are shortages annotated ensure that a call was logged with the DC. (Impacts on claims and that the incident number is recorded / available. )",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-27",
    "category": "5. Horticulture ops",
    "referenceCode": "5.1",
    "item": "Number of flowers per bucket, as per product label on bucket (product damage)                    2 = According to label                                        1 = Not According to label(No Product Damaged)                                                        0 = Not According to label (Damaged Product)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-28",
    "category": "5. Horticulture ops",
    "referenceCode": "5.2",
    "item": "Buckets -- all buckets have T-bag or Vitabrick in and the date is no older than 7 days                                                                  2 = All Buckets have and not older than 7 days  1 = 75% of buckets have and not older than 7 days                                                                   0 = No buckets have",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-29",
    "category": "5. Horticulture ops",
    "referenceCode": "5.3",
    "item": "Horti mats in place in front of flower stand          2 = Mats in place                                               1 = Mats not in place                                        0 = Mats not in place and water on the floor",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-30",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.1",
    "item": "A Till Points Standard of cleaning and housekeeping",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-31",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.2",
    "item": "A Cold Room cleaning, housekeeping and separation",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-32",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.3",
    "item": "Ambient Storage WW only housekeeping and separation",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-33",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.4",
    "item": "A Plant and Generator rooms",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-34",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.5",
    "item": "Change rooms and toilets, including customer facilities",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-35",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.6",
    "item": "A Refuse Disposal Frequency of Removal and Bin Skip Condition",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-36",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.7",
    "item": "A General Housekeeping of Yard",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-37",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "6.8",
    "item": "Wash Activities",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-38",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.1",
    "item": "All documentation and certificates present, on file and valid",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-39",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.2",
    "item": "Incidence logging and follow-up",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-40",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.3",
    "item": "Proofing of doors and structure.",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-41",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.4",
    "item": "Light tubes installed once a year inside ILT with tube replacement dates clearly marked on tubes or on sticker in unit",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-42",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.5",
    "item": "All wall indicator plates present for all bait stations. Bait stations in good condition",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-43",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.6",
    "item": "A Pest Activity Rodent",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-44",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "7.7",
    "item": "A Pest Activity Insects",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-45",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "8.1",
    "item": "Weekly CPA document retention control sheet in place with the relevant reports filed.(LCS retention & any food destruction certificate in place and temperature checklists)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-46",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "8.2",
    "item": "Adherence to the sale of food waste in respect of the \u201cuse by date\u201d and \u201cbest before date\u201d.(Check waste for that day to ensure compliance)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-47",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "8.3",
    "item": "Price changes have been printed, actioned and new SELs updated and been placed on the shelves.  (check a sample of 10 lines to ensure price displayed is same price scanned)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-48",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "8.4",
    "item": "New promotions have been actioned and new SELs updated and been placed on the shelves. (Check a sample of 5 promotion and ensure that shelf price is the same as scanned price)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-49",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "8.5",
    "item": "For non-price marked products, the price on the SEL matches the price at the till (check a sample of 10 lines to ensure price displayed is same price scanned)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-50",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.1",
    "item": "Sales floor is layed out according to the Retail Store Floor Plan",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-51",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.2",
    "item": "All products on display have a shelve edge label",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-52",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.3",
    "item": "All products that are out of stock have a tempory out of stock label in place",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-53",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.4",
    "item": "All products are packed according to the shelf edge label(Height, depth and width are correct)check a sample of 10 lines",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-54",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.5",
    "item": "All products are merchendised on the floor and not sitting in the back up cooler (Check for stock in cooler that is not on sales floor)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-55",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.6",
    "item": "All promotional ticketing is up (ask for a copy of the latest trade plan and check lines that are catalogued and appear on the plan are highlighted and at the correct price)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-56",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.6",
    "item": "Sales floor is pulled forward and appears neat and tidy with no gaps (Visual check)",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-57",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.7",
    "item": "No damaged or blown stock is found on the sales floor",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-58",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.8",
    "item": "All poor quality stock has been removed from display and either wasted or an store iniated RTV has been done",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  },
  {
    "id": "WEEKLY-59",
    "category": "6. Hygiene and Housekeeping for front and back areas",
    "referenceCode": "9.9",
    "item": "All Woolworth Head office RTV's have been actioned for that week if the store carries the stock.(Check RTV's on sytem and ensure they have been removed and actioned",
    "weighting": 2,
    "frequency": "Weekly",
    "guidance": "Conduct weekly high-level hygiene, display, and temperature check."
  }
];

export const monthlyChecklists: ChecklistItem[] = [
  {
    "id": "MONTHLY-01",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M01",
    "item": "Sales floor is layed out according to the Retail Store Floor Plan(If floor plan differs there needs to be written confirmation by Regional Management of changes done.)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-02",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M02",
    "item": "Products are faced up (To load lines) & fronted (Name/ labels facing forward)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-03",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M03",
    "item": "Approved price tickets for all products & out of stock labels in use for out of stock items all in good condition and correctly positioned.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-04",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M04",
    "item": "Stacking disciplines adhered to (Height) and two finger rule to apply",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-05",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M05",
    "item": "Category flow/ blocked correctly (Planogram implementation)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-06",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M06",
    "item": "Stock pressure maintained across category ( 85% full) & No gaps between products (OOS disciplines applied)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-07",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M07",
    "item": "No expired, stale or damaged stock is found on the sales floor",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-08",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M08",
    "item": "Stock Rotation in place on sales floor and back area's (Take a sample of 10 lines from Sales Floor and 10 from Back area)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-09",
    "category": "1. Merchandising Standards & Disciplines Perishables (Dairy,Partyfoods,Takeaways,Recipe Dishes,Desserts,Prepared Salads,Protein ,Deli Meats & Frozens))",
    "referenceCode": "RSD26-M09",
    "item": "Check that all lines are merchandised on sales floor and not in back area(No stock in back area that is not represented on sales floor )",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-10",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M10",
    "item": "Sales floor is layed out according to the Retail Store Floor Plan(If floor plan differs there needs to be written confirmation by Regional Management of changes done.)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-11",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M11",
    "item": "Products are faced up (To load lines) & fronted (Name/ labels facing forward)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-12",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M12",
    "item": "Approved price tickets for all products & out of stock labels in use for out of stock items all in good condition and correctly positioned.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-13",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M13",
    "item": "Stacking disciplines adhered to (Height) and two finger rule to apply",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-14",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M14",
    "item": "Category flow/ blocked correctly (Planogram implementation)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-15",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M15",
    "item": "Stock pressure maintained across category ( 85% full) & No gaps between products (OOS disciplines applied)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-16",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M16",
    "item": "No expired, stale or damaged stock is found on the sales floor",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-17",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M17",
    "item": "Stock Rotation in place on sales floor and back area's (Take a sample of 10 lines from Sales Floor and 10 from Back area)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-18",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M18",
    "item": "Check that all lines are merchandised on sales floor and not in back area(No stock in back area that is not represented on sales floor )",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-19",
    "category": "2. Merchandising Standards & Disciplines Ambient ( Bakery,Fruit &Veg)",
    "referenceCode": "RSD26-M19",
    "item": "Equipment - Gondolas, Ambients etc. - WW products merchandising in WW area and not QS and vice versa",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-20",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M20",
    "item": "Sales floor is layed out according to the Retail Store Floor Plan(If floor plan differs there needs to be written confirmation by Regional Management of changes done.)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-21",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M21",
    "item": "Products are faced up (To load lines) & fronted (Name/ labels facing forward)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-22",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M22",
    "item": "Approved price tickets for all products & out of stock labels in use for out of stock items all in good condition and correctly positioned.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-23",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M23",
    "item": "Stacking disciplines adhered to (Height) and two finger rule to apply",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-24",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M24",
    "item": "Stock pressure maintained across category ( 85% full) & No gaps between products (OOS disciplines applied)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-25",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M25",
    "item": "Category flow/ blocked correctly (Planogram implementation)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-26",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M26",
    "item": "No expired, stale or damaged stock is found on the sales floor",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-27",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M27",
    "item": "Stock Rotation in place on sales floor and back area's (Take a sample of 10 lines from Sales Floor and 10 from Back area)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-28",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M28",
    "item": "Check that all lines are merchandised on sales floor and not in back area(No stock in back area that is not represented on sales floor )",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-29",
    "category": "3. Merchandising Standards & Disciplines Snacks & Confectionery ( Chips , Biltong, Nuts, Dry Fruit & Impulse Run)",
    "referenceCode": "RSD26-M29",
    "item": "Impulse Drops merchandised 50/50 with WW & QS range on either side",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-30",
    "category": "4. Merchandising Standards & Disciplines Long Life ( Edibles & Non Edibles)",
    "referenceCode": "RSD26-M30",
    "item": "WW Longlife positioned in designated allocation that was agreed on",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-31",
    "category": "5. Merchandising Standards & Disciplines Horticulture (Flowers)",
    "referenceCode": "RSD26-M31",
    "item": "Buckets -- all buckets have T-bag or Vitabrick in and the date is no older than 7 days",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-32",
    "category": "5. Merchandising Standards & Disciplines Horticulture (Flowers)",
    "referenceCode": "RSD26-M32",
    "item": "Horti mats in place in front of flower stand & check buckets have clean water (15cm)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-33",
    "category": "5. Merchandising Standards & Disciplines Horticulture (Flowers)",
    "referenceCode": "RSD26-M33",
    "item": "Stock pressure maintained across category and no expired, stale or damaged stock - (Rotation evident)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-34",
    "category": "5. Merchandising Standards & Disciplines Horticulture (Flowers)",
    "referenceCode": "RSD26-M34",
    "item": "Horti Check sheet completed",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-35",
    "category": "6. Merchandising Standards & Disciplines Promotion & Special Offers Compliance",
    "referenceCode": "RSD26-M35",
    "item": "Promotions & Special Offers  - Promotions and Special offers identified by shelf talkers or 3x8 tickets",
    "weighting": 10,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-36",
    "category": "6. Merchandising Standards & Disciplines Promotion & Special Offers Compliance",
    "referenceCode": "RSD26-M36",
    "item": "Promotions & Special Offers  - Site participating in National / Advertised promotion(s) with all relavent point of Sale (Posters etc) on display",
    "weighting": 15,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-37",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M37",
    "item": "A General Cleaning Standards :Frequency of cleaning is cleaning roster in place for current week and followed.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-38",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M38",
    "item": "Standard and depth of cleaning :Cleaning of floor surface areas, no spillages, smear marks or waste.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-39",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M39",
    "item": "Produce and Bakery Display Tall Boys Cleaning Standards:Surface areas underneath ambient display racks are free from excessive dust build-up and loose products, Area clean and free from excessive dust build-up Visual inspection of hygiene standards Product free from dust Auditors to inspect under racks, baskets.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-40",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M40",
    "item": "High Level Cleaning Walls/Ceiling: No smear marks against high level walls where maintenance took place. Walls free from cobwebs and visible dust and fluff",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-41",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M41",
    "item": "Refrigerated and Freezer Display Units Standard and Frequency of Cleaning :Auditors assess casing shelves and rear shelves for build-up, unpack product at bottom level and open display plate to assess interior condition of well for water/ice build-up, product residue, pest activity Open kick plates and assess cleaning standard underneath unit.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-42",
    "category": "7.Operating Disciplines General Cleaning Standards",
    "referenceCode": "RSD26-M42",
    "item": "Trolley and Basket Cleaning: Clean and free of foreign objects ( Check Cleaning check list for frequency of cleaning)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-43",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M43",
    "item": "Clean and in good condition Visual hygiene and housekeeping inspection: (Check walls, roof, light fittings, chiller fans, floors and edges)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-44",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M44",
    "item": "Food products separate from chemicals and oils.( Longlife Store room)",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-45",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M45",
    "item": "Visual inspection of hygiene standards. Auditors to inspect under racks free from excessive dust build-up and loose products.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-46",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M46",
    "item": "Clean, no equipment stored",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-47",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M47",
    "item": "Area clean and free from debris not to be used as miscellaneous storage area",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-48",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M48",
    "item": "Standards of hygiene and housekeeping maintained",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-49",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M49",
    "item": "Waste removal times, Frequency of removal dependent on store size/waste output disciplines.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-50",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M50",
    "item": "Dustbins and waste bins covered/lidded and no excessive papers or plastic fragments.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-51",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M51",
    "item": "Court yard and receiving area clean and no visible food spillages or residue",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-52",
    "category": "8.Operating Disciplines Hygiene and Housekeeping for front and back areas",
    "referenceCode": "RSD26-M52",
    "item": "Standards of hygiene and housekeeping maintenance :Check method of washing baskets, trolleys and equipment if applicable in rear area, not using fire hoses to wash",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-53",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M53",
    "item": "All chemicals clearly labelled and correctly stored in cleaning cage. (No pine-scented chemicals in use).",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-54",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M54",
    "item": "Cleaning chemicals compliant to the Retail Store guidelines for chemical suppliers:",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-55",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M55",
    "item": "Are all chemicals compliant to the Retail Store guidelines for chemical suppliers SABS approved and food graded for food market and related areas (SANS 1828 and/or 1853) All cleaning chemicals on premises to be SABS or EU / USA approved and labelled accordingly.  Spray bottled to be correctly labelled.",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-56",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M56",
    "item": "Store to ensure that chemical charts are on file.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-57",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M57",
    "item": "Only approved food-grade chemical products listed below may be used under SANS 1828 and SANS 1853 guidelines:All guard 10 (multipurpose cleaner)  Oasis Enforce or Floor Guard 30 (floor cleaner)  Dish guard 71 (dishwashing liquid)  Greenpro (glass cleaner)  Ecoshine (stainless steel polish for non-food contact areas  Actichlor (all-purpose sanitizer)    Epivera E (antibacterial soap) Sanitizer Plus (hand sanitizer) . Approved product range:Exceed Multi Surface & Glass Cleaner (general purpose hard surface cleaner),Kadet Quarry Tile Floor Cleaner,Conquest Anti-Bacterial Hand Soap (washing hands)",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-58",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M58",
    "item": "No mops, wooden brooms, feather dusters  ( Only WW approved cleaning equipment to be used)",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-59",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M59",
    "item": "All equipment colour to be colour coded",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-60",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M60",
    "item": "Is colour-coding chart available to demonstrate that system is in place?",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-61",
    "category": "9.Operating Disciplines Cleaning Equipment and Chemicals",
    "referenceCode": "RSD26-M61",
    "item": "WW approved cleaning equipment  to be stored separately, off the floor",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-62",
    "category": "10.Operating Disciplines Cold Chain",
    "referenceCode": "RSD26-M62",
    "item": "Actual product temperatures recorded must be between 0\u00b0C to 5\u00b0C, test at least one product per case to be probed and the temperature recorded.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-63",
    "category": "10.Operating Disciplines Cold Chain",
    "referenceCode": "RSD26-M63",
    "item": "Actual frozen / freezer product temperatures recorded must be -18\u00b0C or colder,test at least one product per case to be probed and the temperature recorded.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-64",
    "category": "10.Operating Disciplines Cold Chain",
    "referenceCode": "RSD26-M64",
    "item": "Black mats (used for produce :Black mats must be present for bagged apples, pillow packs and herbs, clean and in good condition)",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-65",
    "category": "10.Operating Disciplines Cold Chain",
    "referenceCode": "RSD26-M65",
    "item": "Lift mats to assess cleaning.",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-66",
    "category": "10.Operating Disciplines Cold Chain",
    "referenceCode": "RSD26-M66",
    "item": "Actual product temperatures recorded must be between 0\u00b0C to 5\u00b0C, at least one product to be probed and the temperature recorded.",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-67",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M67",
    "item": "Receiving Temp Recording recorded on the LCS Load Control Sheet and Receiving temperature recording (regime for cold chain temp regime 0\u00b0C to 5 \u00b0 C and frozen -18 \u00b0 C or colder)",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-68",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M68",
    "item": "3 x Daily temperature check recorded ,temperatures recorded for each case the temperatures must be between 0\u00b0C to 5\u00b0C.Corrective action or second temperature reading to be in place for temperatures out of specification. ( Check Temp check list )",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-69",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M69",
    "item": "Thermometer calibration (Testo) -- annual certificate available and valid",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-70",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M70",
    "item": "Is the thermometer in good working condition?",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-71",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M71",
    "item": "Frequency of cleaning detailing captured in roster , check that Cleaning inspection conducted and signed off by management.( Cleaning Check list)",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-72",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M72",
    "item": "Waste Recorded against correct reason code(All waste to be captured on branch daily)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-73",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M73",
    "item": "The seal number on the truck is verified to the seal number recorded on the LCS. (Check 1 day per week from the last 6 weeks)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-74",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M74",
    "item": "Stores are counting the lugs when off loaded from the truck and annotated on the LCS. Where there are shortages annotated ensure that a call was logged with the DC. (Impacts on claims and that the incident number is recorded / available. )",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-75",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M75",
    "item": "Waste - Designated waste area in the Cooler Room & must be clean/ tidy/ well maintained (Cooler Room)",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-76",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M76",
    "item": "Waste - Indemnity Forms for waste removal of charities available and relevant",
    "weighting": 1,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-77",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M77",
    "item": "Waste - No waste past its \"use by\" date in Fridge or Freezer & waste to be removed daily by local charity/staff",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-78",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M78",
    "item": "Systems - R.T.V's recorded correctly on the system",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-79",
    "category": "11. Operating Disciplines Back Office Admin",
    "referenceCode": "RSD26-M79",
    "item": "Systems - Previous Discussion sheet & RSD 26 Filed and Available",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-80",
    "category": "12.Operating Disciplines  Pest Control Admin",
    "referenceCode": "RSD26-M80",
    "item": "Check that Sanitation compliance file is updated on a monthly basis by the certified technician and audited on a quarterly basis by the regional manager.",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-81",
    "category": "13.Operating Disciplines Customer Protection Act Compliance",
    "referenceCode": "RSD26-M81",
    "item": "Weekly CPA document retention control sheet in place with the relevant reports filed.(LCS retention & any food destruction certificate in place and temperature checklists)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-82",
    "category": "13.Operating Disciplines Customer Protection Act Compliance",
    "referenceCode": "RSD26-M82",
    "item": "Adherence to the sale of food waste in respect of no waste past its \"use by\" date in Fridge or Freezer.(Check waste for that day to ensure compliance)",
    "weighting": 5,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-83",
    "category": "13.Operating Disciplines Customer Protection Act Compliance",
    "referenceCode": "RSD26-M83",
    "item": "Price changes have been printed, actioned and new SELs updated and been placed on the shelves.  (check a sample of 10 lines to ensure price displayed is same price scanned)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-84",
    "category": "13.Operating Disciplines Customer Protection Act Compliance",
    "referenceCode": "RSD26-M84",
    "item": "New promotions have been actioned and new SELs updated and been placed on the shelves. (Check a sample of 5 promotion and ensure that shelf price is the same as scanned price)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  },
  {
    "id": "MONTHLY-85",
    "category": "13.Operating Disciplines Customer Protection Act Compliance",
    "referenceCode": "RSD26-M85",
    "item": "For non-price marked products, the price on the SEL matches the price at the till (check a sample of 10 lines to ensure price displayed is same price scanned)",
    "weighting": 2,
    "frequency": "Monthly",
    "guidance": "Verify full monthly SANS & Retail RSD 26 compliance audit."
  }
];

export const allRsdChecklists: ChecklistItem[] = [
  ...dailyChecklists,
  ...weeklyChecklists,
  ...monthlyChecklists
];
