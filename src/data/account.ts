/** Mock signed-in user. Replace with the real session once login exists. */
export const ACCOUNT = {
  name: 'Ihsan Aziz',
  role: 'Procurement Officer',
  company: 'Abel Group',
  email: 'ihsan.aziz@abelgroup.example',
  phone: '+62 812 0000 0000',
  site: 'Jakarta HQ',
  odooUser: 'ihsan.aziz',
  lastSynced: 'Today, 09:38',
} as const;

export const NOTIFICATION_PREFS = [
  { key: 'push', label: 'Push notifications', hint: 'Status changes and new follow-ups', defaultOn: true },
  { key: 'atRisk', label: 'At-risk alerts', hint: 'When a PO may miss vessel closing', defaultOn: true },
  { key: 'digest', label: 'Daily digest', hint: 'One summary every morning', defaultOn: false },
] as const;
