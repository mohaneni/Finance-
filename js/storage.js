// Client-side storage for GitHub Pages static deployment (leads + autosave draft + CSV export)

const LEADS_KEY = 'mlf_static_leads_v1';
const DRAFT_KEY = 'mlf_static_apply_draft_v1';
const ADMIN_AUTH_KEY = 'mlf_static_admin_auth';
const LANG_KEY = 'mlf_lang';

const SEED_LEADS = [
  {
    id: 'sample-1',
    ref: 'MLF-20261113-A104',
    created_at: new Date().toISOString(),
    loan_type: 'Business Loan',
    amount: 500000,
    tenure: 36,
    purpose: 'Textile machinery & shop working capital',
    name: 'Karthik Rajendran',
    mobile: '9842211045',
    email: 'karthik.r@example.com',
    city: 'R.S. Puram, Coimbatore',
    employment: 'Business',
    income_range: '₹50,000 – ₹1,00,000',
    call_time: 'Morning (10:00–13:00)',
    language: 'en',
    status: 'New',
    notes: 'Prefers Tamil callback',
  },
  {
    id: 'sample-2',
    ref: 'MLF-20261112-B392',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    loan_type: 'Gold Loan',
    amount: 200000,
    tenure: 12,
    purpose: 'Family education fee',
    name: 'Meenakshi Sundaram',
    mobile: '9894055123',
    email: '',
    city: 'Saibaba Colony, Coimbatore',
    employment: 'Self-employed',
    income_range: '₹25,000 – ₹50,000',
    call_time: 'Afternoon (13:00–16:30)',
    language: 'ta',
    status: 'Contacted',
    notes: 'Scheduled R.S. Puram visit',
  },
  {
    id: 'sample-3',
    ref: 'MLF-20261110-C718',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    loan_type: 'Personal Loan',
    amount: 350000,
    tenure: 48,
    purpose: 'Home interior renovation',
    name: 'Aravind Krishnan',
    mobile: '9789033412',
    email: 'aravind.k@example.com',
    city: 'Peelamedu, Coimbatore',
    employment: 'Salaried',
    income_range: '₹50,000 – ₹1,00,000',
    call_time: 'Evening (16:30–19:30)',
    language: 'en',
    status: 'Converted',
    notes: 'Completed offline verification at W Sambandam Rd',
  },
];

export function sanitizeText(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim();
}

export function getSavedLanguage() {
  try {
    return window.localStorage.getItem(LANG_KEY) === 'ta' ? 'ta' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(lang) {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Ignore
  }
}

export function readDraft() {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDraft(draft) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore
  }
}

function readAllLeads() {
  try {
    const raw = window.localStorage.getItem(LEADS_KEY);
    if (!raw) {
      window.localStorage.setItem(LEADS_KEY, JSON.stringify(SEED_LEADS));
      return [...SEED_LEADS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...SEED_LEADS];
  } catch {
    return [...SEED_LEADS];
  }
}

function writeAllLeads(leads) {
  try {
    window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch {
    // Ignore
  }
}

export function saveNewLead(values) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const ref = `MLF-${y}${m}${d}-${rand}`;

  const lead = {
    id: `lead-${Date.now()}`,
    ref,
    created_at: now.toISOString(),
    loan_type: sanitizeText(values.loanType),
    amount: Math.round(Number(values.amount) || 0),
    tenure: Math.round(Number(values.tenure) || 12),
    purpose: sanitizeText(values.purpose),
    name: sanitizeText(values.name),
    mobile: sanitizeText(values.mobile),
    email: sanitizeText(values.email),
    city: sanitizeText(values.city),
    employment: sanitizeText(values.employment),
    income_range: sanitizeText(values.incomeRange),
    call_time: sanitizeText(values.callTime),
    language: values.language === 'ta' ? 'ta' : 'en',
    status: 'New',
    notes: '',
  };

  const leads = readAllLeads();
  writeAllLeads([lead, ...leads]);
  return lead;
}

export function queryLeads({ search = '', status = 'All', loanType = 'All', dateFrom = '', dateTo = '' } = {}) {
  const all = readAllLeads().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  let filtered = [...all];

  if (status && status !== 'All') filtered = filtered.filter((l) => l.status === status);
  if (loanType && loanType !== 'All') filtered = filtered.filter((l) => l.loan_type === loanType);
  if (dateFrom) filtered = filtered.filter((l) => l.created_at.slice(0, 10) >= dateFrom);
  if (dateTo) filtered = filtered.filter((l) => l.created_at.slice(0, 10) <= dateTo);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.ref.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.loan_type.toLowerCase().includes(q)
    );
  }

  const now = new Date();
  const todayPrefix = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const converted = all.filter((l) => l.status === 'Converted').length;

  return {
    leads: filtered,
    stats: {
      today: all.filter((l) => l.created_at.startsWith(todayPrefix)).length,
      week: all.filter((l) => l.created_at >= weekAgo).length,
      total: all.length,
      conversionRate: all.length > 0 ? Math.round((converted / all.length) * 1000) / 10 : 0,
    },
  };
}

export function updateLeadRecord(id, patch) {
  const leads = readAllLeads();
  const next = leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
  writeAllLeads(next);
}

export function exportLeadsCsv(leads) {
  const safe = (v) => {
    const raw = String(v ?? '');
    const guarded = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${guarded.replace(/"/g, '""')}"`;
  };
  const headers = [
    'Ref',
    'Created At',
    'Loan Type',
    'Amount',
    'Tenure (Months)',
    'Purpose',
    'Name',
    'Mobile',
    'Email',
    'City',
    'Employment',
    'Income Range',
    'Call Time',
    'Language',
    'Status',
    'Notes',
  ];
  const rows = leads.map((l) =>
    [
      l.ref,
      l.created_at,
      l.loan_type,
      l.amount,
      l.tenure,
      l.purpose,
      l.name,
      l.mobile,
      l.email || '',
      l.city,
      l.employment,
      l.income_range,
      l.call_time,
      l.language,
      l.status,
      l.notes,
    ]
      .map(safe)
      .join(',')
  );
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'money-line-finance-leads.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function isAdminLoggedIn() {
  try {
    return window.sessionStorage.getItem(ADMIN_AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(flag) {
  try {
    if (flag) window.sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
    else window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
  } catch {
    // Ignore
  }
}
