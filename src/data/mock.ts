import type { Contact, HistoryEntry, POItem, PurchaseOrder, Risk } from './types';

export const STAGES = [
  'PO issued',
  'In production',
  'Ready at vendor',
  'Heading to port of entry',
  'In customs',
  'Received at Abel warehouse',
  'Handed over',
] as const;

export const RISK_LABEL: Record<Risk, string> = {
  'at-risk': 'At risk',
  watching: 'Watching',
  'on-track': 'On track',
};

const defaultItems: POItem[] = [
  { name: 'Pompa Flygt 2640', qty: 4, unit: 'unit', received: false },
  { name: 'Kabel pompa submersible', qty: 4, unit: 'roll', received: false },
];

const defaultOrderInfo = (vendor: string) => [
  { label: 'Vendor', value: vendor },
  { label: 'Order date', value: '22 Sep' },
  { label: 'Payment terms', value: 'Net 30' },
  { label: 'Incoterm', value: 'FOB' },
];

const contactsFor = (vendorPerson: string, vendorCompany: string): Contact[] => [
  { name: vendorPerson, role: `${vendorCompany}, vendor` },
  { name: 'Rendi', role: 'Abel Group, purchasing' },
  { name: 'Dewi', role: 'PT Bahari Logistik, forwarder' },
];

const issuedHistory = (date: string): HistoryEntry => ({
  title: 'PO issued',
  meta: `${date} · Odoo`,
});

export const INITIAL_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-0412',
    risk: 'at-risk',
    statusLabel: 'In production',
    stage: 1,
    itemsSummary: 'Pompa Flygt 2640 +1 more',
    vessel: 'KM Nusa Timur',
    closing: '13 Oct',
    vendorPromise: '10 Oct',
    estimatedReady: '15 Oct',
    daysLate: 5,
    closingDelta: 2,
    summary:
      'The vendor pushed production back 5 days, so the estimated ready date is now 15 Oct instead of the promised 10 Oct. Cargo will miss the 13 Oct closing for KM Nusa Timur and has to move to the next sailing unless the vendor can expedite.',
    items: defaultItems,
    orderInfo: defaultOrderInfo('PT Flygt Indonesia'),
    history: [
      { title: 'Vendor pushed production back 5 days', meta: '14 Oct · AI Assistant' },
      issuedHistory('22 Sep'),
    ],
    followUp: {
      listNote: '2 days past closing for KM Nusa Timur',
      itemLabel: 'Pompa Flygt 2640',
      headline: 'Expected to be 2 days past the closing time of KM Nusa Timur in Jakarta.',
      cause: 'Vendor pushed production back 5 days.',
      aiSummary:
        'Waiting for the next vessel is the cheapest, but the goods would only arrive on 9 Nov, about 11 days later than via Surabaya (29 Oct). Moving to Surabaya is the safest for all units, at roughly Rp 18 million extra. Shipping part first only makes sense if Budi confirms that 2 units will definitely be finished before 16 Oct, so call him before deciding.',
      contacts: contactsFor('Budi', 'PT Sinar Pompa Mandiri'),
      options: [
        { id: 'wait', title: 'Wait for the next vessel', cost: 'Rp 0', schedule: 'Departs 30 Oct · Arrives 9 Nov' },
        {
          id: 'surabaya',
          title: 'Move to Surabaya',
          cost: '± Rp 18 million',
          recommended: true,
          schedule: 'Departs 20 Oct · Arrives 29 Oct',
          note: '2 days of trucking to catch KM Bahari Surya.',
        },
        { id: 'split', title: 'Ship part first', cost: '± Rp 18 million', schedule: 'Departs 16 & 20 Oct · Arrives 26 & 29 Oct' },
      ],
    },
  },
  {
    id: 'PO-2026-0427',
    risk: 'at-risk',
    statusLabel: 'In customs',
    stage: 4,
    itemsSummary: 'Valve Actuator Set',
    vessel: 'KM Nusa Timur',
    closing: '13 Oct',
    vendorPromise: '2 Oct',
    estimatedReady: '9 Oct',
    daysLate: 7,
    closingDelta: 1,
    summary:
      'Customs inspection was flagged for a document mismatch. Clearance is waiting on a corrected packing list from the vendor.',
    items: [{ name: 'Valve actuator', qty: 12, unit: 'unit', received: false }],
    orderInfo: defaultOrderInfo('Rotork Asia'),
    history: [
      { title: 'Customs flagged a document mismatch', meta: '12 Oct · AI Assistant' },
      issuedHistory('10 Sep'),
    ],
    followUp: {
      listNote: '1 day past closing for KM Nusa Timur',
      itemLabel: 'Valve Actuator Set',
      headline: 'Expected to be 1 day past the closing time of KM Nusa Timur in Jakarta.',
      cause: 'Customs flagged a document mismatch.',
      aiSummary:
        'The customs hold is only waiting for a corrected packing list. If the vendor sends it today, the cargo can still make the next feeder. Otherwise rebooking on the following vessel costs a week.',
      contacts: contactsFor('Hendra', 'Rotork Asia'),
      options: [
        { id: 'wait', title: 'Wait for the corrected packing list', cost: 'Rp 0', schedule: 'Departs 21 Oct · Arrives 30 Oct' },
        {
          id: 'expedite',
          title: 'Expedite customs clearance',
          cost: '± Rp 6 million',
          recommended: true,
          schedule: 'Departs 14 Oct · Arrives 23 Oct',
          note: 'Needs the vendor to send documents today.',
        },
      ],
    },
  },
  {
    id: 'PO-2026-0405',
    risk: 'watching',
    statusLabel: 'Heading to port',
    stage: 3,
    itemsSummary: 'Steel Pipe 6in',
    vessel: 'KM Nusa Timur',
    closing: '16 Oct',
    vendorPromise: '11 Oct',
    estimatedReady: '12 Oct',
    daysLate: 1,
    closingDelta: -1,
    summary:
      'Goods left the vendor one day later than promised. There is still a 4 day buffer before vessel closing.',
    items: [{ name: 'Steel pipe 6 inch', qty: 80, unit: 'pcs', received: false }],
    orderInfo: defaultOrderInfo('Krakatau Steel'),
    history: [
      { title: 'Shipment picked up by forwarder', meta: '12 Oct · Odoo' },
      issuedHistory('1 Sep'),
    ],
    followUp: {
      listNote: '1 day to spare before KM Nusa Timur closes',
      itemLabel: 'Steel Pipe 6in',
      headline: 'Expected to arrive 1 day before KM Nusa Timur closes.',
      cause: 'Shipment left the vendor 1 day late.',
      aiSummary:
        'The buffer is thin but still positive. No action is needed unless the trucking leg slips again. Ask the forwarder to confirm the pickup time tomorrow morning.',
      contacts: contactsFor('Yanto', 'Krakatau Steel'),
      options: [
        { id: 'monitor', title: 'Keep monitoring', cost: 'Rp 0', recommended: true, schedule: 'Departs 17 Oct · Arrives 26 Oct' },
        { id: 'express', title: 'Use express trucking', cost: '± Rp 3 million', schedule: 'Departs 16 Oct · Arrives 25 Oct' },
      ],
    },
  },
  {
    id: 'PO-2026-0430',
    risk: 'watching',
    statusLabel: 'In production',
    stage: 1,
    itemsSummary: 'Control Panel PLC',
    vessel: 'KM Borneo Jaya',
    closing: '20 Oct',
    vendorPromise: '14 Oct',
    estimatedReady: '16 Oct',
    daysLate: 2,
    closingDelta: -2,
    summary:
      'Production is two days behind the vendor promise but still ahead of the 20 Oct closing.',
    items: [{ name: 'Control panel PLC', qty: 2, unit: 'unit', received: false }],
    orderInfo: defaultOrderInfo('Siemens Indonesia'),
    history: [
      { title: 'Vendor updated estimated ready date', meta: '13 Oct · Vendor' },
      issuedHistory('28 Sep'),
    ],
    followUp: {
      listNote: '2 days to spare before KM Borneo Jaya closes',
      itemLabel: 'Control Panel PLC',
      headline: 'Expected to be ready 2 days before KM Borneo Jaya closes.',
      cause: 'Production is running 2 days behind the vendor promise.',
      aiSummary:
        'Production is slower than promised but there is still a 2 day buffer. A further delay would push the cargo to the next vessel, so ask the vendor for a weekly progress update.',
      contacts: contactsFor('Sari', 'Siemens Indonesia'),
      options: [
        { id: 'monitor', title: 'Keep monitoring', cost: 'Rp 0', recommended: true, schedule: 'Departs 22 Oct · Arrives 31 Oct' },
        { id: 'prebook', title: 'Pre-book the next vessel', cost: '± Rp 2 million', schedule: 'Departs 3 Nov · Arrives 12 Nov' },
      ],
    },
  },
  {
    id: 'PO-2026-0398',
    risk: 'on-track',
    statusLabel: 'Customs cleared',
    stage: 4,
    itemsSummary: 'Bearing Kit SKF',
    vessel: 'KM Nusa Timur',
    closing: '13 Oct',
    vendorPromise: '28 Sep',
    estimatedReady: '28 Sep',
    daysLate: 0,
    closingDelta: -3,
    summary: 'Customs cleared on schedule. Delivery to the Abel warehouse is expected within 2 days.',
    items: [{ name: 'Bearing kit', qty: 30, unit: 'set', received: false }],
    orderInfo: defaultOrderInfo('SKF Indonesia'),
    history: [
      { title: 'Customs cleared', meta: '14 Oct · Odoo' },
      issuedHistory('2 Sep'),
    ],
    followUp: null,
  },
  {
    id: 'PO-2026-0421',
    risk: 'on-track',
    statusLabel: 'Ready at vendor',
    stage: 2,
    itemsSummary: 'Hydraulic Hose',
    vessel: 'KM Karya Mulia',
    closing: '22 Oct',
    vendorPromise: '15 Oct',
    estimatedReady: '15 Oct',
    daysLate: 0,
    closingDelta: -5,
    summary: 'Cargo is ready at the vendor and waiting for pickup. No delays expected.',
    items: [{ name: 'Hydraulic hose 1 inch', qty: 200, unit: 'm', received: false }],
    orderInfo: defaultOrderInfo('Gates Asia'),
    history: [
      { title: 'Vendor marked cargo ready', meta: '14 Oct · Vendor' },
      issuedHistory('20 Sep'),
    ],
    followUp: null,
  },
  {
    id: 'PO-2026-0419',
    risk: 'on-track',
    statusLabel: 'At Abel warehouse',
    stage: 5,
    itemsSummary: 'Gasket Set',
    vessel: 'MV Sinar Bahari',
    closing: '1 Oct',
    vendorPromise: '25 Sep',
    estimatedReady: '25 Sep',
    daysLate: 0,
    closingDelta: -6,
    summary: 'Goods arrived at the Abel warehouse. Waiting for handover to the requesting team.',
    items: [{ name: 'Gasket set', qty: 60, unit: 'set', received: true }],
    orderInfo: defaultOrderInfo('Garlock Asia'),
    history: [
      { title: 'Received at Abel warehouse', meta: '13 Oct · Warehouse' },
      issuedHistory('1 Sep'),
    ],
    followUp: null,
  },
  {
    id: 'PO-2026-0433',
    risk: 'on-track',
    statusLabel: 'PO issued',
    stage: 0,
    itemsSummary: 'Safety Harness',
    vessel: 'KM Nusa Timur',
    closing: '30 Oct',
    vendorPromise: '22 Oct',
    estimatedReady: '22 Oct',
    daysLate: 0,
    closingDelta: -8,
    summary: 'PO was just issued. Waiting for the vendor to confirm the production schedule.',
    items: [{ name: 'Safety harness', qty: 25, unit: 'pcs', received: false }],
    orderInfo: defaultOrderInfo('3M Indonesia'),
    history: [issuedHistory('14 Oct')],
    followUp: null,
  },
];
