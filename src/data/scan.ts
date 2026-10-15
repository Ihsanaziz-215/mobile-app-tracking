export interface ScannedPO {
  po: string;
  lines: string;
  description: string;
  count: number;
}

export interface ScanResult {
  vendor: string;
  items: ScannedPO[];
}

/** Mock result returned after the (simulated) label scan finishes. */
export const MOCK_SCAN: ScanResult = {
  vendor: 'Vendor A',
  items: [
    { po: 'PO-2026-4521', lines: 'lines 1 to 3', description: 'Hydraulic hose, fittings, clamps', count: 3 },
    { po: 'PO-2026-4530', lines: 'lines 1 to 3', description: 'Filter elements', count: 3 },
  ],
};

export const MILESTONES = [
  'Picked up by Abel',
  'Ready at vendor',
  'Departed from vendor',
  'Arrived at port',
  'Received at Abel warehouse',
  'Handed over',
] as const;

/** How long the simulated scan runs before results appear. */
export const MOCK_SCAN_MS = 3200;
