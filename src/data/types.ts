export type Risk = 'at-risk' | 'watching' | 'on-track';

export interface POItem {
  name: string;
  qty: number;
  unit: string;
  received: boolean;
}

export interface HistoryEntry {
  title: string;
  meta: string;
}

export interface ActionOption {
  id: string;
  title: string;
  cost: string;
  recommended?: boolean;
  schedule: string;
  note?: string;
}

export interface Contact {
  name: string;
  /** Free-form line under the name, e.g. "PT Sinar Pompa Mandiri, vendor". */
  role: string;
  phone?: string;
}

export interface FollowUp {
  /** One-line reason shown on the Follow-up list card. */
  listNote: string;
  itemLabel: string;
  headline: string;
  cause: string;
  aiSummary: string;
  contacts: Contact[];
  options: ActionOption[];
  chosenOptionId?: string;
}

export interface PurchaseOrder {
  id: string;
  risk: Risk;
  /** Short status text shown on the list card. */
  statusLabel: string;
  /** Zero-based index into STAGES. */
  stage: number;
  itemsSummary: string;
  vessel: string;
  closing: string;
  vendorPromise: string;
  estimatedReady: string;
  /** Positive when behind the vendor promise, 0 when on schedule. */
  daysLate: number;
  /** Days relative to the vessel closing: positive = past closing, negative = days to spare. */
  closingDelta: number;
  summary: string;
  items: POItem[];
  orderInfo: { label: string; value: string }[];
  history: HistoryEntry[];
  /** Present only for POs that need a decision. */
  followUp: FollowUp | null;
}

export interface Vessel {
  id: string;
  name: string;
  risk: Risk;
  /** e.g. "Jakarta → Timika" */
  route: string;
  /** Long form used in the detail sheet. */
  routeLong: string;
  closing: string;
  departs: string;
  /** Percent of cargo slots filled, 0-100. */
  filled: number;
  /** Number of items on this vessel that are ready to load. */
  ready: number;
  poIds: string[];
}
