import { siteConfig, getLoanProductBySlug } from './site-config.js';
import { translations } from './translations.js';
import { calculateReducingBalanceEmi, formatInr } from './emi.js';
import { mountHero3D } from './hero3d.js';
import { iconSvg } from './icons.js';
import {
  clearDraft,
  exportLeadsCsv,
  getSavedLanguage,
  isAdminLoggedIn,
  queryLeads,
  readDraft,
  saveDraft,
  saveLanguage,
  saveNewLead,
  setAdminLoggedIn,
  updateLeadRecord,
} from './storage.js';

const EMPLOYMENT_OPTIONS = ['Salaried', 'Self-employed', 'Business', 'Other'];
const INCOME_OPTIONS = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
];
const CALL_TIME_OPTIONS = [
  'Morning (10:00–13:00)',
  'Afternoon (13:00–16:30)',
  'Evening (16:30–19:30)',
];
const ADMIN_STATUS_OPTIONS = ['New', 'Contacted', 'In Process', 'Converted', 'Rejected'];

const state = {
  lang: getSavedLanguage(),
  mobileMenuOpen: false,
  categoryFilter: 'all',
  searchQuery: '',
  calc: {
    slug: siteConfig.loanProducts[0].slug,
    amount: siteConfig.loanProducts[0].defaultAmount,
    rate: siteConfig.loanProducts[0].defaultRate,
    tenure: siteConfig.loanProducts[0].defaultTenureMonths,
  },
  testimonialIndex: 0,
  openFaq: 0,
  applyStep: 1,
  applyDraft: null,
  applyError: '',
  adminFilter: {
    search: '',
    status: 'All',
    loanType: 'All',
    dateFrom: '',
    dateTo: '',
  },
  adminLoginError: '',
};

let cleanupHero3D = null;

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getT() {
  return translations[state.lang] || translations.en;
}

function parseRoute() {
  const raw = window.location.hash || '#/';
  const cleaned = raw.startsWith('#') ? raw.slice(1) : raw;
  const [pathPart, queryPart] = cleaned.split('?');
  const path = pathPart || '/';
  const params = new URLSearchParams(queryPart || '');
  return { path, params };
}

function navigate(hashPath) {
  window.location.hash = hashPath.startsWith('#') ? hashPath : `#${hashPath}`;
}

function loanCardHtml(product) {
  const t = getT();
  const title = state.lang === 'ta' ? product.titleTa : product.titleEn;
  const desc = state.lang === 'ta' ? product.shortDescriptionTa : product.shortDescriptionEn;
  const tenure = state.lang === 'ta' ? product.tenureRangeTa : product.tenureRangeEn;
  const catLabel = t.store.filters[product.category] || product.category;

  return `
    <article class="loan-card">
      <div>
        <div class="loan-card-top">
          <div class="loan-icon-box">${iconSvg(product.icon)}</div>
          <span class="loan-cat-label">${esc(catLabel)}</span>
        </div>
        <h3 class="loan-card-title">${esc(title)}</h3>
        <p class="loan-card-desc">${esc(desc)}</p>
        <dl class="loan-specs">
          <div><dt>${esc(t.store.labels.interest)}</dt><dd class="tabular">${esc(product.interestRange)}</dd></div>
          <div><dt>${esc(t.store.labels.amount)}</dt><dd class="tabular">${esc(product.amountRange)}</dd></div>
          <div><dt>${esc(t.store.labels.tenure)}</dt><dd class="tabular">${esc(tenure)}</dd></div>
        </dl>
      </div>
      <div class="loan-card-actions">
        <a href="#/loans/${esc(product.slug)}" class="btn btn-soft">${esc(t.store.labels.viewDetails)}</a>
        <a href="#/apply?loan=${encodeURIComponent(product.slug)}" class="btn btn-gold">
          <span>${esc(t.store.labels.applyNow)}</span>
          ${iconSvg('arrowRight', 'icon-sm')}
        </a>
      </div>
    </article>
  `;
}

function contactBlockHtml() {
  const t = getT();
  const address = state.lang === 'ta' ? siteConfig.addressTa : siteConfig.address;
  const hours = state.lang === 'ta' ? siteConfig.hoursTa : siteConfig.hoursEn;

  return `
    <section class="section section-light" aria-labelledby="contact-block-heading">
      <div class="container">
        <div class="section-head">
          <h2 id="contact-block-heading">${esc(t.contactBlock.sectionTitle)}</h2>
          <p>${esc(t.contactBlock.sectionSubtitle)}</p>
        </div>
        <div class="contact-grid">
          <div class="card contact-card">
            <div class="contact-info-list">
              <div class="contact-item">
                ${iconSvg('mapPin', 'icon contact-icon')}
                <div>
                  <div class="meta-label">${esc(t.contactBlock.addressLabel)}</div>
                  <p>${esc(address)}</p>
                </div>
              </div>
              <div class="contact-item">
                ${iconSvg('clock', 'icon contact-icon')}
                <div>
                  <div class="meta-label">${esc(t.contactBlock.hoursLabel)}</div>
                  <p>${esc(hours)}</p>
                </div>
              </div>
              <div class="contact-item">
                ${iconSvg('phone', 'icon contact-icon')}
                <div>
                  <div class="meta-label">${esc(t.contactBlock.phoneLabel)}</div>
                  <p class="phone-big tabular">${esc(siteConfig.phone)}</p>
                </div>
              </div>
            </div>
            <div class="contact-actions">
              <div class="btn-grid-2">
                <a href="${esc(siteConfig.phoneHref)}" class="btn btn-navy">
                  ${iconSvg('phone', 'icon-sm')}
                  <span>${esc(t.contactBlock.callBtn)}</span>
                </a>
                <a href="${esc(siteConfig.whatsappUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                  ${iconSvg('whatsapp', 'icon-sm')}
                  <span>${esc(t.contactBlock.whatsappBtn)}</span>
                </a>
              </div>
              <a href="${esc(siteConfig.mapDirectionsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-soft btn-full">
                <span>${esc(t.contactBlock.directionsBtn)}</span>
                ${iconSvg('external', 'icon-xs')}
              </a>
            </div>
          </div>
          <div class="map-frame-wrap">
            <iframe
              title="${esc(t.contactBlock.mapTitle)}"
              src="${esc(siteConfig.mapEmbedUrl)}"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  `;
}

function emiCalculatorHtml() {
  const t = getT();
  const { amount, rate, tenure, slug } = state.calc;
  const emi = calculateReducingBalanceEmi(amount, rate, tenure);
  const total = Math.max(1, emi.totalPayable);
  const radius = 74;
  const circ = 2 * Math.PI * radius;
  const principalDash = (emi.principal / total) * circ;
  const interestDash = (emi.totalInterest / total) * circ;

  const presetButtons = siteConfig.loanProducts
    .map((p) => {
      const label = state.lang === 'ta' ? p.titleTa : p.titleEn;
      const active = p.slug === slug ? 'is-active' : '';
      return `<button type="button" class="preset-tab ${active}" data-calc-preset="${esc(p.slug)}">${esc(label)}</button>`;
    })
    .join('');

  return `
    <section id="emi-calculator" class="section section-white border-y" aria-labelledby="emi-calc-heading">
      <div class="container">
        <div class="section-head-row">
          <div class="section-head">
            <h2 id="emi-calc-heading">${esc(t.calculator.sectionTitle)}</h2>
            <p>${esc(t.calculator.sectionSubtitle)}</p>
          </div>
          <div class="preset-tabs" role="group" aria-label="${esc(t.calculator.presetLabel)}">${presetButtons}</div>
        </div>

        <div class="emi-grid">
          <div class="emi-controls">
            <div class="slider-block">
              <div class="slider-header">
                <label for="emi-amount-num">${esc(t.calculator.loanAmount)}</label>
                <div class="num-pill">
                  <span>₹</span>
                  <input id="emi-amount-num" type="number" min="25000" max="10000000" step="5000" value="${amount}" />
                </div>
              </div>
              <input id="emi-amount-range" aria-label="${esc(t.calculator.loanAmount)}" type="range" min="25000" max="5000000" step="25000" value="${Math.min(amount, 5000000)}" />
              <div class="range-scale tabular"><span>₹25,000</span><span>₹50,00,000+</span></div>
            </div>

            <div class="slider-block">
              <div class="slider-header">
                <label for="emi-rate-num">${esc(t.calculator.interestRate)}</label>
                <div class="num-pill">
                  <input id="emi-rate-num" type="number" min="8" max="26" step="0.25" value="${rate}" class="w-short" />
                  <span>%</span>
                </div>
              </div>
              <input id="emi-rate-range" aria-label="${esc(t.calculator.interestRate)}" type="range" min="8" max="26" step="0.25" value="${rate}" />
              <div class="range-scale tabular"><span>8% p.a.</span><span>26% p.a.</span></div>
            </div>

            <div class="slider-block">
              <div class="slider-header">
                <label for="emi-tenure-num">${esc(t.calculator.tenureMonths)}</label>
                <div class="num-pill">
                  <input id="emi-tenure-num" type="number" min="3" max="120" step="1" value="${tenure}" class="w-short" />
                  <span>mo</span>
                </div>
              </div>
              <input id="emi-tenure-range" aria-label="${esc(t.calculator.tenureMonths)}" type="range" min="3" max="120" step="1" value="${tenure}" />
              <div class="range-scale tabular"><span>3 mo</span><span>120 mo (10 yrs)</span></div>
            </div>

            <p class="emi-note">${esc(t.calculator.indicativeNote)}</p>
          </div>

          <div class="emi-summary">
            <div class="emi-summary-top">
              <div class="donut-wrap">
                <svg viewBox="0 0 180 180" class="donut-svg" aria-hidden="true">
                  <circle cx="90" cy="90" r="${radius}" class="donut-track"></circle>
                  <circle id="donut-principal" cx="90" cy="90" r="${radius}" class="donut-principal"
                    stroke-dasharray="${principalDash} ${circ}" stroke-dashoffset="0"></circle>
                  <circle id="donut-interest" cx="90" cy="90" r="${radius}" class="donut-interest"
                    stroke-dasharray="${interestDash} ${circ}" stroke-dashoffset="${-principalDash}"></circle>
                </svg>
                <div class="donut-center">
                  <span class="donut-label">${esc(t.calculator.monthlyEmi)}</span>
                  <span id="emi-monthly-val" class="donut-value tabular">${esc(formatInr(emi.monthlyEmi))}</span>
                </div>
              </div>

              <dl class="emi-breakdown">
                <div>
                  <dt><span class="swatch swatch-blue"></span>${esc(t.calculator.principal)}</dt>
                  <dd id="emi-principal-val" class="tabular">${esc(formatInr(emi.principal))}</dd>
                </div>
                <div>
                  <dt><span class="swatch swatch-gold"></span>${esc(t.calculator.totalInterest)}</dt>
                  <dd id="emi-interest-val" class="tabular gold-text">${esc(formatInr(emi.totalInterest))}</dd>
                </div>
                <div class="emi-total-row">
                  <dt>${esc(t.calculator.totalPayable)}</dt>
                  <dd id="emi-total-val" class="tabular">${esc(formatInr(emi.totalPayable))}</dd>
                </div>
              </dl>
            </div>

            <button type="button" id="emi-apply-btn" class="btn btn-gold btn-full btn-lg">
              <span>${esc(t.calculator.applyThis)}</span>
              ${iconSvg('arrowRight', 'icon-sm')}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFilteredLoansGrid() {
  const t = getT();
  const q = state.searchQuery.trim().toLowerCase();
  const filtered = siteConfig.loanProducts.filter((p) => {
    if (state.categoryFilter !== 'all' && p.category !== state.categoryFilter) return false;
    if (!q) return true;
    return (
      p.titleEn.toLowerCase().includes(q) ||
      p.titleTa.toLowerCase().includes(q) ||
      p.shortDescriptionEn.toLowerCase().includes(q) ||
      p.shortDescriptionTa.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    return `<div class="empty-box">${esc(t.store.labels.noResults)}</div>`;
  }

  const balanced =
    state.categoryFilter === 'all' && state.searchQuery.trim() === '' && filtered.length === 5;

  if (balanced) {
    return `
      <div class="grid-stack">
        <div class="grid-2">${filtered.slice(0, 2).map(loanCardHtml).join('')}</div>
        <div class="grid-3">${filtered.slice(2).map(loanCardHtml).join('')}</div>
      </div>
    `;
  }

  return `<div class="grid-3">${filtered.map(loanCardHtml).join('')}</div>`;
}

function homePageHtml() {
  const t = getT();
  const benefitIcons = ['clock', 'percent', 'users', 'shieldCheck', 'mapPin', 'checkCircle'];
  const currentTestimonial = siteConfig.testimonials[state.testimonialIndex];

  const heroServices = siteConfig.loanProducts
    .map((p) => {
      const title = state.lang === 'ta' ? p.titleTa : p.titleEn;
      return `
        <a href="#/loans/${esc(p.slug)}" class="hero-service-tile">
          <div class="hero-service-main">
            <div class="hero-service-title-row">
              ${iconSvg(p.icon, 'icon-sm gold-text')}
              <span>${esc(title)}</span>
            </div>
            <div class="hero-service-amount tabular">${esc(p.amountRange)}</div>
          </div>
          ${iconSvg('arrowUpRight', 'icon-xs hero-service-arrow')}
        </a>
      `;
    })
    .join('');

  const filterButtons = ['all', 'unsecured', 'business', 'secured']
    .map((cat) => {
      const active = state.categoryFilter === cat ? 'is-active' : '';
      return `<button type="button" class="filter-btn ${active}" data-filter-cat="${cat}">${esc(
        t.store.filters[cat]
      )}</button>`;
    })
    .join('');

  return `
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="hero-kicker">${esc(t.hero.kicker)}</p>
            <h1>${esc(t.hero.headline)}</h1>
            <p class="hero-sub">${esc(t.hero.subheading)}</p>
            <div class="hero-ctas">
              <a href="#loan-store" data-scroll-to="loan-store" class="btn btn-gold btn-lg">${esc(
                t.hero.ctaPrimary
              )}</a>
              <a href="${esc(siteConfig.phoneHref)}" class="btn btn-glass btn-lg">
                ${iconSvg('phone', 'icon-sm gold-text')}
                <span>${esc(t.hero.ctaSecondary)}</span>
              </a>
            </div>
            <div class="hero-trust-line tabular">
              <strong>${esc(t.hero.trustRating)}</strong>
              <span aria-hidden="true">·</span>
              <span>${esc(t.hero.trustYears)}</span>
              <span aria-hidden="true">·</span>
              <span>${esc(t.hero.trustLicense)}</span>
            </div>
          </div>

          <div class="hero-visual" id="hero-3d-stage">
            <img src="./images/hero-vault.jpg" alt="${esc(t.hero.fallbackCaption)}" class="hero-fallback-img" />
            <div class="hero-visual-vignette" aria-hidden="true"></div>
          </div>
        </div>

        <div class="hero-services-strip">
          <div class="hero-services-label">${esc(t.hero.servicesLabel)}</div>
          <div class="hero-services-grid">${heroServices}</div>
        </div>
      </div>
    </section>

    <section class="trust-bar" aria-label="Key business highlights">
      <div class="container">
        <dl class="trust-grid">
          <div><dt>${esc(t.trustBar.ratingLabel)}</dt><dd class="tabular">${esc(t.trustBar.ratingValue)}</dd></div>
          <div><dt>${esc(t.trustBar.customersLabel)}</dt><dd class="tabular">${esc(t.trustBar.customersValue)}</dd></div>
          <div><dt>${esc(t.trustBar.yearsLabel)}</dt><dd class="tabular">${esc(t.trustBar.yearsValue)}</dd></div>
          <div><dt>${esc(t.trustBar.hoursLabel)}</dt><dd class="tabular">${esc(t.trustBar.hoursValue)}</dd></div>
        </dl>
      </div>
    </section>

    <section id="loan-store" class="section section-light" aria-labelledby="loan-store-heading">
      <div class="container">
        <div class="section-head-row">
          <div class="section-head">
            <h2 id="loan-store-heading">${esc(t.store.sectionTitle)}</h2>
            <p>${esc(t.store.sectionSubtitle)}</p>
          </div>
          <div class="search-box">
            ${iconSvg('search', 'icon-sm search-icon')}
            <input id="store-search-input" type="search" value="${esc(state.searchQuery)}" placeholder="${esc(
              t.store.searchPlaceholder
            )}" aria-label="${esc(t.store.searchPlaceholder)}" />
          </div>
        </div>

        <div class="filter-bar" role="group" aria-label="Filter loan category">${filterButtons}</div>
        <div id="loan-store-grid">${renderFilteredLoansGrid()}</div>
      </div>
    </section>

    ${emiCalculatorHtml()}

    <section class="section section-light" aria-labelledby="how-works-heading">
      <div class="container">
        <div class="section-head">
          <h2 id="how-works-heading">${esc(t.howItWorks.sectionTitle)}</h2>
          <p>${esc(t.howItWorks.sectionSubtitle)}</p>
        </div>
        <div class="grid-4">
          ${t.howItWorks.steps
            .map(
              (s) => `
            <div class="card">
              <div class="step-num tabular">${esc(s.num)}</div>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.desc)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section-white border-y" aria-labelledby="why-choose-heading">
      <div class="container">
        <div class="section-head">
          <h2 id="why-choose-heading">${esc(t.whyChoose.sectionTitle)}</h2>
          <p>${esc(t.whyChoose.sectionSubtitle)}</p>
        </div>
        <div class="grid-3">
          ${t.whyChoose.items
            .map(
              (item, idx) => `
            <div class="benefit-card">
              <div class="benefit-icon">${iconSvg(benefitIcons[idx % benefitIcons.length])}</div>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.desc)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section-navy" aria-labelledby="testimonials-heading">
      <div class="container narrow-container">
        <div class="section-head-row">
          <div class="section-head head-light">
            <h2 id="testimonials-heading">${esc(t.testimonials.sectionTitle)}</h2>
            <p>${esc(t.testimonials.sectionSubtitle)}</p>
          </div>
          <div class="carousel-controls">
            <button type="button" id="test-prev" class="btn-icon" aria-label="${esc(t.testimonials.prev)}">${iconSvg(
              'chevronLeft',
              'icon-sm'
            )}</button>
            <button type="button" id="test-next" class="btn-icon" aria-label="${esc(t.testimonials.next)}">${iconSvg(
              'chevronRight',
              'icon-sm'
            )}</button>
          </div>
        </div>

        <div class="testimonial-card">
          <blockquote>“${esc(
            state.lang === 'ta' ? currentTestimonial.quoteTa : currentTestimonial.quoteEn
          )}”</blockquote>
          <div class="testimonial-meta">
            <div><strong>${esc(currentTestimonial.name)}</strong> · ${esc(currentTestimonial.area)}</div>
            <div class="gold-text">${esc(
              state.lang === 'ta' ? currentTestimonial.loanTypeTa : currentTestimonial.loanTypeEn
            )}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white border-b" aria-labelledby="faq-heading">
      <div class="container faq-container">
        <div class="section-head">
          <h2 id="faq-heading">${esc(t.faq.sectionTitle)}</h2>
          <p>${esc(t.faq.sectionSubtitle)}</p>
        </div>
        <div class="faq-list">
          ${t.faq.items
            .map((item, idx) => {
              const open = state.openFaq === idx;
              return `
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="${open}" data-faq-idx="${idx}">
                  <span>${esc(item.q)}</span>
                  ${iconSvg('chevronDown', `icon-sm faq-chevron ${open ? 'is-open' : ''}`)}
                </button>
                ${open ? `<div class="faq-answer">${esc(item.a)}</div>` : ''}
              </div>
            `;
            })
            .join('')}
        </div>
        <div class="center-cta">
          <a href="#/apply" class="btn btn-gold btn-lg">${esc(t.nav.apply)}</a>
        </div>
      </div>
    </section>

    ${contactBlockHtml()}
  `;
}

function loansPageHtml() {
  const t = getT();
  const filterButtons = ['all', 'unsecured', 'business', 'secured']
    .map((cat) => {
      const active = state.categoryFilter === cat ? 'is-active' : '';
      return `<button type="button" class="filter-btn ${active}" data-filter-cat="${cat}">${esc(
        t.store.filters[cat]
      )}</button>`;
    })
    .join('');

  return `
    <section class="section section-light min-h-page">
      <div class="container">
        <div class="section-head-row">
          <div class="section-head">
            <h1>${esc(t.store.sectionTitle)}</h1>
            <p>${esc(t.store.sectionSubtitle)}</p>
          </div>
          <div class="search-box">
            ${iconSvg('search', 'icon-sm search-icon')}
            <input id="store-search-input" type="search" value="${esc(state.searchQuery)}" placeholder="${esc(
              t.store.searchPlaceholder
            )}" aria-label="${esc(t.store.searchPlaceholder)}" />
          </div>
        </div>
        <div class="filter-bar">${filterButtons}</div>
        <div id="loan-store-grid">${renderFilteredLoansGrid()}</div>
      </div>
    </section>
  `;
}

function loanDetailPageHtml(slug) {
  const t = getT();
  const product = getLoanProductBySlug(slug);
  if (!product) return notFoundPageHtml();

  const title = state.lang === 'ta' ? product.titleTa : product.titleEn;
  const overview = state.lang === 'ta' ? product.overviewTa : product.overviewEn;
  const eligibility = state.lang === 'ta' ? product.eligibilityTa : product.eligibilityEn;
  const documents = state.lang === 'ta' ? product.documentsTa : product.documentsEn;

  const sampleRows = [
    {
      amount: product.minAmount * 2 > product.maxAmount ? product.minAmount : product.minAmount * 2,
      tenure: product.minTenureMonths < 12 ? 12 : product.minTenureMonths,
    },
    { amount: product.defaultAmount, tenure: product.defaultTenureMonths },
    { amount: Math.min(product.maxAmount, product.defaultAmount * 2), tenure: product.maxTenureMonths },
  ];

  return `
    <section class="section section-light">
      <div class="container detail-container">
        <a href="#/loans" class="back-link">${iconSvg('arrowLeft', 'icon-sm')} <span>${esc(
          t.loanDetail.backToLoans
        )}</span></a>

        <div class="detail-hero">
          <div class="detail-hero-top">
            <div>
              <h1>${esc(title)}</h1>
              <p>${esc(overview)}</p>
            </div>
            <a href="#/apply?loan=${encodeURIComponent(product.slug)}&amount=${product.defaultAmount}&tenure=${
              product.defaultTenureMonths
            }" class="btn btn-gold btn-lg">
              <span>${esc(t.loanDetail.applyCta)}</span>
              ${iconSvg('arrowRight', 'icon-sm')}
            </a>
          </div>
          <dl class="detail-specs tabular">
            <div><dt>${esc(t.store.labels.interest)}</dt><dd>${esc(product.interestRange)}</dd></div>
            <div><dt>${esc(t.store.labels.amount)}</dt><dd>${esc(product.amountRange)}</dd></div>
            <div><dt>${esc(t.store.labels.tenure)}</dt><dd>${esc(
              state.lang === 'ta' ? product.tenureRangeTa : product.tenureRangeEn
            )}</dd></div>
          </dl>
        </div>

        <div class="grid-2">
          <div class="card">
            <h2>${esc(t.loanDetail.eligibility)}</h2>
            <ul class="check-list">
              ${eligibility.map((x) => `<li>${iconSvg('checkCircle', 'icon-sm green-text')}<span>${esc(x)}</span></li>`).join('')}
            </ul>
          </div>
          <div class="card">
            <h2>${esc(t.loanDetail.documents)}</h2>
            <ul class="check-list">
              ${documents.map((x) => `<li>${iconSvg('fileText', 'icon-sm navy-text')}<span>${esc(x)}</span></li>`).join('')}
            </ul>
            <div class="alert-amber">
              ${iconSvg('shieldAlert', 'icon-sm')}
              <span>${esc(t.loanDetail.noUploadNotice)}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-head-row">
            <div>
              <h2>${esc(t.loanDetail.sampleEmiTitle)}</h2>
              <p class="muted-small">${esc(t.loanDetail.sampleEmiSubtitle)}</p>
            </div>
            <a href="#/" data-jump-calc="${esc(product.slug)}" class="text-link">${esc(t.loanDetail.calcCta)}</a>
          </div>
          <div class="table-wrap">
            <table class="data-table tabular">
              <thead>
                <tr>
                  <th>${esc(t.loanDetail.amountCol)}</th>
                  <th>${esc(t.loanDetail.rateCol)}</th>
                  <th>${esc(t.loanDetail.tenureCol)}</th>
                  <th class="text-right">${esc(t.loanDetail.emiCol)}</th>
                </tr>
              </thead>
              <tbody>
                ${sampleRows
                  .map((r) => {
                    const calc = calculateReducingBalanceEmi(r.amount, product.defaultRate, r.tenure);
                    return `
                    <tr>
                      <td><strong>${esc(formatInr(r.amount))}</strong></td>
                      <td>${product.defaultRate}% p.a.</td>
                      <td>${r.tenure} mo</td>
                      <td class="text-right"><strong>${esc(formatInr(calc.monthlyEmi))}</strong></td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h2>${esc(t.loanDetail.faqsTitle)}</h2>
          <div class="detail-faqs">
            ${product.faqs
              .map(
                (f) => `
              <div>
                <h3>${esc(state.lang === 'ta' ? f.questionTa : f.questionEn)}</h3>
                <p>${esc(state.lang === 'ta' ? f.answerTa : f.answerEn)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function initApplyDraft(params) {
  const saved = readDraft();
  const slugParam = params.get('loan');
  const prod = (slugParam && getLoanProductBySlug(slugParam)) || siteConfig.loanProducts[0];
  const amtParam = Number(params.get('amount'));
  const tenParam = Number(params.get('tenure'));

  state.applyDraft = {
    loanType: slugParam ? prod.titleEn : saved.loanType || prod.titleEn,
    amount: Number.isFinite(amtParam) && amtParam >= 10000 ? amtParam : saved.amount || prod.defaultAmount,
    tenure: Number.isFinite(tenParam) && tenParam >= 3 ? tenParam : saved.tenure || prod.defaultTenureMonths,
    purpose: saved.purpose || '',
    name: saved.name || '',
    mobile: saved.mobile || '',
    email: saved.email || '',
    city: saved.city || 'Coimbatore',
    employment: saved.employment || 'Salaried',
    incomeRange: saved.incomeRange || '₹25,000 – ₹50,000',
    callTime: saved.callTime || 'Morning (10:00–13:00)',
    consent: false,
    website: '',
  };
  state.applyStep = 1;
  state.applyError = '';
}

function applyPageHtml() {
  const t = getT();
  const d = state.applyDraft;
  const pct = state.applyStep === 1 ? 33 : state.applyStep === 2 ? 66 : 100;

  return `
    <section class="section section-light min-h-page">
      <div class="container form-container">
        <div class="section-head">
          <h1>${esc(t.apply.title)}</h1>
          <p>${esc(t.apply.subtitle)}</p>
        </div>

        <div class="alert-amber mb-6">
          ${iconSvg('shieldAlert', 'icon')}
          <span>${esc(t.apply.noSensitiveBanner)}</span>
        </div>

        <div class="card form-card">
          <div class="progress-wrap">
            <div class="progress-labels">
              <span class="${state.applyStep >= 1 ? 'is-done' : ''}">${esc(t.apply.steps.step1)}</span>
              <span class="${state.applyStep >= 2 ? 'is-done' : ''}">${esc(t.apply.steps.step2)}</span>
              <span class="${state.applyStep >= 3 ? 'is-done' : ''}">${esc(t.apply.steps.step3)}</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          </div>

          <form id="apply-form" novalidate>
            <div class="hp-field" aria-hidden="true">
              <label for="f-website">Website</label>
              <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off" value="${esc(d.website)}" />
            </div>

            ${
              state.applyStep === 1
                ? `
              <div class="form-stack">
                <div class="field">
                  <label for="f-loanType">${esc(t.apply.fields.loanType)}</label>
                  <select id="f-loanType" name="loanType">
                    ${siteConfig.loanProducts
                      .map((p) => {
                        const label = state.lang === 'ta' ? `${p.titleTa} (${p.titleEn})` : p.titleEn;
                        return `<option value="${esc(p.titleEn)}" ${
                          d.loanType === p.titleEn ? 'selected' : ''
                        }>${esc(label)}</option>`;
                      })
                      .join('')}
                  </select>
                </div>

                <div class="grid-2">
                  <div class="field">
                    <label for="f-amount">${esc(t.apply.fields.amount)}</label>
                    <input id="f-amount" name="amount" type="number" min="10000" max="50000000" step="5000" value="${esc(
                      d.amount
                    )}" class="tabular" required />
                  </div>
                  <div class="field">
                    <label for="f-tenure">${esc(t.apply.fields.tenure)}</label>
                    <input id="f-tenure" name="tenure" type="number" min="3" max="240" value="${esc(
                      d.tenure
                    )}" class="tabular" required />
                  </div>
                </div>

                <div class="field">
                  <label for="f-purpose">${esc(t.apply.fields.purpose)}</label>
                  <input id="f-purpose" name="purpose" type="text" placeholder="${esc(
                    t.apply.fields.purposePlaceholder
                  )}" value="${esc(d.purpose)}" required />
                </div>

                ${state.applyError ? `<div class="form-error" role="alert">${esc(state.applyError)}</div>` : ''}

                <div class="form-footer">
                  <span class="muted-small">${esc(t.apply.buttons.savedDraft)}</span>
                  <button type="button" id="apply-next-1" class="btn btn-gold">
                    <span>${esc(t.apply.buttons.next)}</span>
                    ${iconSvg('arrowRight', 'icon-sm')}
                  </button>
                </div>
              </div>
            `
                : ''
            }

            ${
              state.applyStep === 2
                ? `
              <div class="form-stack">
                <div class="grid-2">
                  <div class="field">
                    <label for="f-name">${esc(t.apply.fields.name)}</label>
                    <input id="f-name" name="name" type="text" placeholder="${esc(
                      t.apply.fields.namePlaceholder
                    )}" value="${esc(d.name)}" required />
                  </div>
                  <div class="field">
                    <label for="f-mobile">${esc(t.apply.fields.mobile)}</label>
                    <div class="phone-input-group">
                      <span>+91</span>
                      <input id="f-mobile" name="mobile" type="tel" inputmode="numeric" maxlength="10" placeholder="${esc(
                        t.apply.fields.mobilePlaceholder
                      )}" value="${esc(d.mobile)}" class="tabular" required />
                    </div>
                  </div>
                </div>

                <div class="grid-2">
                  <div class="field">
                    <label for="f-email">${esc(t.apply.fields.email)}</label>
                    <input id="f-email" name="email" type="email" placeholder="${esc(
                      t.apply.fields.emailPlaceholder
                    )}" value="${esc(d.email)}" />
                  </div>
                  <div class="field">
                    <label for="f-city">${esc(t.apply.fields.city)}</label>
                    <input id="f-city" name="city" type="text" placeholder="${esc(
                      t.apply.fields.cityPlaceholder
                    )}" value="${esc(d.city)}" required />
                  </div>
                </div>

                <div class="grid-3">
                  <div class="field">
                    <label for="f-employment">${esc(t.apply.fields.employment)}</label>
                    <select id="f-employment" name="employment">
                      ${EMPLOYMENT_OPTIONS.map(
                        (opt) =>
                          `<option value="${esc(opt)}" ${d.employment === opt ? 'selected' : ''}>${esc(
                            t.apply.employmentOptions[opt]
                          )}</option>`
                      ).join('')}
                    </select>
                  </div>
                  <div class="field">
                    <label for="f-incomeRange">${esc(t.apply.fields.incomeRange)}</label>
                    <select id="f-incomeRange" name="incomeRange">
                      ${INCOME_OPTIONS.map(
                        (opt) =>
                          `<option value="${esc(opt)}" ${d.incomeRange === opt ? 'selected' : ''}>${esc(
                            t.apply.incomeOptions[opt]
                          )}</option>`
                      ).join('')}
                    </select>
                  </div>
                  <div class="field">
                    <label for="f-callTime">${esc(t.apply.fields.callTime)}</label>
                    <select id="f-callTime" name="callTime">
                      ${CALL_TIME_OPTIONS.map(
                        (opt) =>
                          `<option value="${esc(opt)}" ${d.callTime === opt ? 'selected' : ''}>${esc(
                            t.apply.callTimeOptions[opt]
                          )}</option>`
                      ).join('')}
                    </select>
                  </div>
                </div>

                ${state.applyError ? `<div class="form-error" role="alert">${esc(state.applyError)}</div>` : ''}

                <div class="form-footer">
                  <button type="button" id="apply-back-2" class="btn btn-soft">
                    ${iconSvg('arrowLeft', 'icon-sm')}
                    <span>${esc(t.apply.buttons.back)}</span>
                  </button>
                  <button type="button" id="apply-next-2" class="btn btn-gold">
                    <span>${esc(t.apply.buttons.next)}</span>
                    ${iconSvg('arrowRight', 'icon-sm')}
                  </button>
                </div>
              </div>
            `
                : ''
            }

            ${
              state.applyStep === 3
                ? `
              <div class="form-stack">
                <div class="review-head">
                  <h2>${esc(t.apply.review.heading)}</h2>
                  <button type="button" id="apply-edit" class="text-link">${esc(t.apply.review.edit)}</button>
                </div>

                <dl class="review-box">
                  <div><dt>${esc(t.apply.fields.loanType)}</dt><dd>${esc(d.loanType)}</dd></div>
                  <div><dt>${esc(t.apply.fields.amount)}</dt><dd class="tabular">${esc(
                    formatInr(d.amount)
                  )} (${esc(d.tenure)} mo)</dd></div>
                  <div><dt>${esc(t.apply.fields.purpose)}</dt><dd>${esc(d.purpose)}</dd></div>
                  <div><dt>${esc(t.apply.fields.name)}</dt><dd>${esc(d.name)}</dd></div>
                  <div><dt>${esc(t.apply.fields.mobile)}</dt><dd class="tabular">+91 ${esc(d.mobile)}</dd></div>
                  <div><dt>${esc(t.apply.fields.city)}</dt><dd>${esc(d.city)}</dd></div>
                  <div><dt>${esc(t.apply.fields.employment)}</dt><dd>${esc(d.employment)} · ${esc(
                    d.incomeRange
                  )}</dd></div>
                  <div><dt>${esc(t.apply.fields.callTime)}</dt><dd>${esc(d.callTime)}</dd></div>
                </dl>

                <label class="consent-check">
                  <input id="f-consent" name="consent" type="checkbox" ${d.consent ? 'checked' : ''} />
                  <span>${esc(t.apply.review.consentLabel)}</span>
                </label>

                ${state.applyError ? `<div class="form-error" role="alert">${esc(state.applyError)}</div>` : ''}

                <div class="form-footer">
                  <button type="button" id="apply-back-3" class="btn btn-soft">
                    ${iconSvg('arrowLeft', 'icon-sm')}
                    <span>${esc(t.apply.buttons.back)}</span>
                  </button>
                  <button type="submit" class="btn btn-gold">
                    ${iconSvg('checkCircle', 'icon-sm')}
                    <span>${esc(t.apply.buttons.submit)}</span>
                  </button>
                </div>
              </div>
            `
                : ''
            }
          </form>
        </div>
      </div>
    </section>
  `;
}

function thankYouPageHtml(params) {
  const t = getT();
  const refId = params.get('ref') || 'MLF-RECORDED';
  const loanType = params.get('loan') || 'Loan';
  const waHref = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `Hello Money Line Finance, I submitted a ${loanType} enquiry. Reference ID: ${refId}`
  )}`;

  return `
    <section class="section section-light min-h-page">
      <div class="container thankyou-container">
        <div class="card thankyou-card">
          <div class="success-badge-icon">${iconSvg('checkCircle', 'icon-lg')}</div>
          <p class="eyebrow-green">${esc(t.thankYou.badge)}</p>
          <h1>${esc(t.thankYou.title)}</h1>
          <p class="lead-muted">${esc(t.thankYou.subtitle)}</p>

          <dl class="review-box">
            <div><dt>${esc(t.thankYou.refLabel)}</dt><dd class="ref-id tabular">${esc(refId)}</dd></div>
            <div><dt>${esc(t.thankYou.callbackLabel)}</dt><dd>${esc(t.thankYou.callbackValue)}</dd></div>
          </dl>

          <div class="next-step-box">
            <strong>${esc(t.thankYou.nextStepTitle)}</strong>
            <p>${esc(t.thankYou.nextStepDesc)}</p>
          </div>

          <div class="thankyou-ctas">
            <a href="${esc(waHref)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
              ${iconSvg('whatsapp', 'icon-sm')}
              <span>${esc(t.thankYou.whatsappBtn)}</span>
            </a>
            <a href="${esc(siteConfig.phoneHref)}" class="btn btn-navy btn-lg">
              ${iconSvg('phone', 'icon-sm gold-text')}
              <span>${esc(t.thankYou.callBtn)}</span>
            </a>
          </div>
          <a href="#/" class="text-link">${esc(t.thankYou.homeBtn)}</a>
        </div>
      </div>
    </section>
  `;
}

function aboutPageHtml() {
  const t = getT();
  const hours = state.lang === 'ta' ? siteConfig.hoursTa : siteConfig.hoursEn;

  return `
    <section class="section section-white border-b">
      <div class="container">
        <div class="section-head">
          <h1>${esc(t.about.title)}</h1>
          <p>${esc(t.about.subtitle)}</p>
        </div>

        <div class="about-grid">
          <div class="about-copy">
            <h2>${esc(t.about.storyHeading)}</h2>
            <p>${esc(t.about.storyP1)}</p>
            <p>${esc(t.about.storyP2)}</p>

            <dl class="about-meta">
              <div><dt>${esc(t.about.licenseLabel)}</dt><dd>${esc(siteConfig.licenseDetails)}</dd></div>
              <div><dt>${esc(t.about.hoursLabel)}</dt><dd>${esc(hours)}</dd></div>
            </dl>
            <a href="#/apply" class="btn btn-gold btn-lg">${esc(t.nav.apply)}</a>
          </div>
          <figure class="about-photo-frame">
            <img src="./images/office-coimbatore.jpg" alt="${esc(t.about.branchCaption)}" />
          </figure>
        </div>
      </div>
    </section>
    ${contactBlockHtml()}
  `;
}

function contactPageHtml() {
  const t = getT();
  return `
    <section class="section-compact section-white border-b">
      <div class="container section-head-row">
        <div class="section-head">
          <h1>${esc(t.contactPage.title)}</h1>
          <p>${esc(t.contactPage.subtitle)}</p>
        </div>
        <a href="#/apply" class="btn btn-gold btn-lg">${esc(t.nav.apply)}</a>
      </div>
    </section>
    ${contactBlockHtml()}
  `;
}

function legalPageHtml(kind) {
  const t = getT();
  if (kind === 'privacy') {
    return `
      <section class="section section-light min-h-page">
        <div class="container legal-container card prose">
          <h1>${esc(t.legal.privacyTitle)}</h1>
          <p>Money Line Finance respects your privacy and follows India's Digital Personal Data Protection (DPDP) Act principles.</p>
          <h2>1. What Information We Collect</h2>
          <p>We collect only basic enquiry contact details (name, 10-digit mobile, optional email, city, employment &amp; income bracket, requested loan type, amount, tenure, purpose, and preferred callback slot). <strong>We never collect Aadhaar, PAN, bank account numbers, or document uploads on this website.</strong></p>
          <h2>2. Why We Collect It</h2>
          <p>Details are used solely to call you back, explain indicative financing terms, and guide offline verification if you choose to proceed.</p>
          <h2>3. Deletion &amp; Contact</h2>
          <p>Request access or deletion anytime via <strong>${esc(siteConfig.grievanceOfficer.email)}</strong> or <strong>${esc(siteConfig.phone)}</strong>.</p>
        </div>
      </section>
    `;
  }
  if (kind === 'terms') {
    return `
      <section class="section section-light min-h-page">
        <div class="container legal-container card prose">
          <h1>${esc(t.legal.termsTitle)}</h1>
          <p><strong>Enquiry-Only Platform:</strong> Submitting an enquiry does not constitute loan approval or a binding credit offer.</p>
          <p><strong>Indicative Figures:</strong> All loans are subject to eligibility, verification, and lender approval. Interest rates and EMIs shown are indicative and may vary.</p>
          <p><strong>No Online Payments:</strong> Money Line Finance never collects fees or repayments through this website.</p>
          <p><strong>Advisory Info:</strong> ${esc(siteConfig.licenseDetails)}</p>
        </div>
      </section>
    `;
  }
  return `
    <section class="section section-light min-h-page">
      <div class="container legal-container card prose">
        <h1>${esc(t.legal.grievanceTitle)}</h1>
        <p>For enquiry concerns or data deletion requests, contact our Grievance Desk:</p>
        <dl class="about-meta">
          <div><dt>Grievance Officer</dt><dd>${esc(siteConfig.grievanceOfficer.name)}</dd></div>
          <div><dt>Email</dt><dd>${esc(siteConfig.grievanceOfficer.email)}</dd></div>
          <div><dt>Phone</dt><dd class="tabular">${esc(siteConfig.grievanceOfficer.phone)}</dd></div>
          <div><dt>Address</dt><dd>${esc(siteConfig.grievanceOfficer.address)}</dd></div>
          <div><dt>Response Window</dt><dd>${esc(
            state.lang === 'ta' ? siteConfig.grievanceOfficer.responseWindowTa : siteConfig.grievanceOfficer.responseWindowEn
          )}</dd></div>
        </dl>
      </div>
    </section>
  `;
}

function adminPageHtml() {
  const t = getT();
  if (!isAdminLoggedIn()) {
    return `
      <section class="section section-light min-h-page center-screen">
        <form id="admin-login-form" class="card login-card">
          <h1>${esc(t.admin.loginTitle)}</h1>
          <p class="muted-small">${esc(t.admin.loginSubtitle)}</p>
          <div class="field">
            <label for="admin-password">${esc(t.admin.passwordLabel)}</label>
            <input id="admin-password" type="password" placeholder="moneyline2026" required />
          </div>
          ${state.adminLoginError ? `<div class="form-error">${esc(state.adminLoginError)}</div>` : ''}
          <button type="submit" class="btn btn-gold btn-full">${esc(t.admin.loginBtn)}</button>
        </form>
      </section>
    `;
  }

  const { leads, stats } = queryLeads(state.adminFilter);

  return `
    <section class="section section-light min-h-page">
      <div class="container">
        <div class="section-head-row mb-6">
          <h1>${esc(t.admin.title)}</h1>
          <div class="admin-head-actions">
            <button type="button" id="admin-export-btn" class="btn btn-soft">
              ${iconSvg('download', 'icon-sm')}
              <span>${esc(t.admin.exportCsv)}</span>
            </button>
            <button type="button" id="admin-logout-btn" class="btn btn-navy">${esc(t.admin.logoutBtn)}</button>
          </div>
        </div>

        <dl class="kpi-grid tabular mb-6">
          <div class="card kpi-card"><dt>${esc(t.admin.todayCount)}</dt><dd>${stats.today}</dd></div>
          <div class="card kpi-card"><dt>${esc(t.admin.weekCount)}</dt><dd>${stats.week}</dd></div>
          <div class="card kpi-card"><dt>${esc(t.admin.totalCount)}</dt><dd>${stats.total}</dd></div>
          <div class="card kpi-card"><dt>${esc(t.admin.conversionRate)}</dt><dd class="green-text">${stats.conversionRate}%</dd></div>
        </dl>

        <div class="card admin-filters mb-6">
          <input id="admin-search" type="search" value="${esc(state.adminFilter.search)}" placeholder="${esc(
            t.admin.searchPlaceholder
          )}" />
          <select id="admin-status">
            <option value="All">${esc(t.admin.allStatuses)}</option>
            ${ADMIN_STATUS_OPTIONS.map(
              (s) => `<option value="${esc(s)}" ${state.adminFilter.status === s ? 'selected' : ''}>${esc(s)}</option>`
            ).join('')}
          </select>
          <select id="admin-loan">
            <option value="All">${esc(t.admin.allLoans)}</option>
            ${siteConfig.loanProducts
              .map(
                (p) =>
                  `<option value="${esc(p.titleEn)}" ${
                    state.adminFilter.loanType === p.titleEn ? 'selected' : ''
                  }>${esc(p.titleEn)}</option>`
              )
              .join('')}
          </select>
          <input id="admin-from" type="date" aria-label="From date" value="${esc(state.adminFilter.dateFrom)}" />
          <input id="admin-to" type="date" aria-label="To date" value="${esc(state.adminFilter.dateTo)}" />
        </div>

        <div class="card table-card">
          ${
            leads.length === 0
              ? `<div class="empty-box">${esc(t.admin.empty)}</div>`
              : `
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ref &amp; Date</th>
                    <th>Applicant</th>
                    <th>Loan Request</th>
                    <th>Call Window</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${leads
                    .map(
                      (l) => `
                    <tr>
                      <td class="tabular">
                        <strong>${esc(l.ref)}</strong><br />
                        <span class="muted-small">${esc(new Date(l.created_at).toLocaleDateString('en-IN'))}</span>
                      </td>
                      <td>
                        <strong>${esc(l.name)}</strong><br />
                        <span class="tabular muted-small">+91 ${esc(l.mobile)}</span><br />
                        <span class="muted-small">${esc(l.city)} · ${esc(l.employment)}</span>
                      </td>
                      <td>
                        <strong>${esc(l.loan_type)}</strong><br />
                        <span class="tabular">${esc(formatInr(l.amount))} · ${esc(l.tenure)} mo</span><br />
                        <span class="muted-small">${esc(l.purpose)}</span>
                      </td>
                      <td>
                        <span>${esc(l.call_time)}</span><br />
                        <span class="muted-small">${esc(l.income_range)}</span>
                      </td>
                      <td>
                        <select class="status-select" data-lead-status="${esc(l.id)}" aria-label="Status for ${esc(l.name)}">
                          ${ADMIN_STATUS_OPTIONS.map(
                            (s) => `<option value="${esc(s)}" ${l.status === s ? 'selected' : ''}>${esc(s)}</option>`
                          ).join('')}
                        </select>
                      </td>
                      <td>
                        <div class="note-row">
                          <input type="text" value="${esc(l.notes)}" data-note-input="${esc(l.id)}" placeholder="Follow-up note..." />
                          <button type="button" class="btn btn-soft btn-xs" data-save-note="${esc(l.id)}">Save</button>
                        </div>
                      </td>
                      <td class="text-right">
                        <div class="row-actions">
                          <a href="tel:+91${esc(l.mobile)}" class="btn-mini btn-navy" aria-label="Call ${esc(l.name)}">${iconSvg(
                            'phone',
                            'icon-xs'
                          )}</a>
                          <a href="https://wa.me/91${esc(l.mobile)}?text=${encodeURIComponent(
                            `Hello ${l.name}, calling from Money Line Finance regarding ${l.loan_type} (${l.ref}).`
                          )}" target="_blank" rel="noopener noreferrer" class="btn-mini btn-whatsapp" aria-label="WhatsApp ${esc(
                            l.name
                          )}">${iconSvg('whatsapp', 'icon-xs')}</a>
                        </div>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `
          }
        </div>
      </div>
    </section>
  `;
}

function notFoundPageHtml() {
  const t = getT();
  return `
    <section class="section section-light min-h-page center-screen">
      <div class="card login-card text-center">
        <p class="step-num tabular">404</p>
        <h1>${esc(t.errors.notFoundTitle)}</h1>
        <p class="muted-small">${esc(t.errors.notFoundDesc)}</p>
        <a href="#/" class="btn btn-gold">${esc(t.errors.backHome)}</a>
      </div>
    </section>
  `;
}

function renderShell() {
  const t = getT();
  const brandTitle = state.lang === 'ta' ? t.brand.name : siteConfig.name;

  document.getElementById('site-header').innerHTML = `
    <div class="container header-inner">
      <a href="#/" class="brand-wordmark">${esc(brandTitle)}</a>
      <nav class="nav-desktop" aria-label="Main navigation">
        <a href="#/loans">${esc(t.nav.loans)}</a>
        <a href="#/" data-jump-calc="default">${esc(t.nav.calculator)}</a>
        <a href="#/about">${esc(t.nav.about)}</a>
        <a href="#/contact">${esc(t.nav.contact)}</a>
        <button type="button" id="lang-toggle-desktop" class="lang-btn">${esc(t.nav.toggleLang)}</button>
      </nav>
      <div class="header-actions">
        <button type="button" id="lang-toggle-mobile" class="lang-btn-mobile">${esc(t.nav.toggleLang)}</button>
        <a href="#/apply" class="btn btn-gold hide-xs">${esc(t.nav.apply)}</a>
        <button type="button" id="mobile-menu-btn" class="menu-btn" aria-expanded="${
          state.mobileMenuOpen
        }" aria-label="Toggle menu">
          ${iconSvg(state.mobileMenuOpen ? 'x' : 'menu', 'icon')}
        </button>
      </div>
    </div>
    ${
      state.mobileMenuOpen
        ? `
      <nav class="nav-mobile" aria-label="Mobile navigation">
        <a href="#/loans">${esc(t.nav.loans)}</a>
        <a href="#/" data-jump-calc="default">${esc(t.nav.calculator)}</a>
        <a href="#/about">${esc(t.nav.about)}</a>
        <a href="#/contact">${esc(t.nav.contact)}</a>
        <a href="#/apply" class="btn btn-gold btn-full">${esc(t.nav.apply)}</a>
      </nav>
    `
        : ''
    }
  `;

  document.getElementById('site-footer').innerHTML = `
    <div class="container footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <h2>${esc(state.lang === 'ta' ? siteConfig.nameTa : siteConfig.name)}</h2>
          <p>${esc(state.lang === 'ta' ? siteConfig.addressTa : siteConfig.address)}</p>
          <p>${esc(state.lang === 'ta' ? siteConfig.hoursTa : siteConfig.hoursEn)}</p>
          <p class="gold-text tabular"><strong>${esc(siteConfig.phone)}</strong></p>
          <p class="muted-footer">${esc(siteConfig.licenseDetails)}</p>
        </div>
        <div class="footer-col">
          <div class="footer-heading">${esc(t.nav.loans)}</div>
          ${siteConfig.loanProducts
            .map(
              (p) =>
                `<a href="#/loans/${esc(p.slug)}">${esc(state.lang === 'ta' ? p.titleTa : p.titleEn)}</a>`
            )
            .join('')}
        </div>
        <div class="footer-col">
          <div class="footer-heading">${esc(t.brand.city)}</div>
          <div class="footer-links-2col">
            <a href="#/loans">${esc(t.footer.links.loans)}</a>
            <a href="#/about">${esc(t.footer.links.about)}</a>
            <a href="#/contact">${esc(t.footer.links.contact)}</a>
            <a href="#/privacy-policy">${esc(t.footer.links.privacy)}</a>
            <a href="#/terms">${esc(t.footer.links.terms)}</a>
            <a href="#/grievance">${esc(t.footer.links.grievance)}</a>
            <a href="#/admin">${esc(t.footer.links.admin)}</a>
          </div>
        </div>
      </div>

      <div class="footer-disclaimer">${esc(t.footer.disclaimer)}</div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(t.footer.rights)}</span>
        <span>${esc(siteConfig.grievanceOfficer.email)}</span>
      </div>
    </div>
  `;

  document.getElementById('mobile-sticky-bar').innerHTML = `
    <a href="${esc(siteConfig.phoneHref)}" class="mbar-btn mbar-navy">
      ${iconSvg('phone', 'icon-sm gold-text')}
      <span>${esc(t.mobileBar.call)}</span>
    </a>
    <a href="${esc(siteConfig.whatsappUrl)}" target="_blank" rel="noopener noreferrer" class="mbar-btn mbar-wa">
      ${iconSvg('whatsapp', 'icon-sm')}
      <span>${esc(t.mobileBar.whatsapp)}</span>
    </a>
    <a href="#/apply" class="mbar-btn mbar-gold">
      ${iconSvg('fileText', 'icon-sm')}
      <span>${esc(t.mobileBar.apply)}</span>
    </a>
  `;
}

function updateEmiDomOnly() {
  const { amount, rate, tenure } = state.calc;
  const emi = calculateReducingBalanceEmi(amount, rate, tenure);
  const total = Math.max(1, emi.totalPayable);
  const radius = 74;
  const circ = 2 * Math.PI * radius;
  const principalDash = (emi.principal / total) * circ;
  const interestDash = (emi.totalInterest / total) * circ;

  const monthlyEl = document.getElementById('emi-monthly-val');
  const prinEl = document.getElementById('emi-principal-val');
  const intEl = document.getElementById('emi-interest-val');
  const totEl = document.getElementById('emi-total-val');
  const pArc = document.getElementById('donut-principal');
  const iArc = document.getElementById('donut-interest');

  if (monthlyEl) monthlyEl.textContent = formatInr(emi.monthlyEmi);
  if (prinEl) prinEl.textContent = formatInr(emi.principal);
  if (intEl) intEl.textContent = formatInr(emi.totalInterest);
  if (totEl) totEl.textContent = formatInr(emi.totalPayable);
  if (pArc) pArc.setAttribute('stroke-dasharray', `${principalDash} ${circ}`);
  if (iArc) {
    iArc.setAttribute('stroke-dasharray', `${interestDash} ${circ}`);
    iArc.setAttribute('stroke-dashoffset', `${-principalDash}`);
  }
}

function bindShellEvents() {
  const toggle = () => {
    state.lang = state.lang === 'en' ? 'ta' : 'en';
    saveLanguage(state.lang);
    document.documentElement.lang = state.lang;
    renderApp(false);
  };

  document.getElementById('lang-toggle-desktop')?.addEventListener('click', toggle);
  document.getElementById('lang-toggle-mobile')?.addEventListener('click', toggle);

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    renderShell();
    bindShellEvents();
  });

  document.querySelectorAll('[data-jump-calc]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = el.getAttribute('data-jump-calc');
      if (slug && slug !== 'default') {
        const prod = getLoanProductBySlug(slug);
        if (prod) {
          state.calc = {
            slug: prod.slug,
            amount: prod.defaultAmount,
            rate: prod.defaultRate,
            tenure: prod.defaultTenureMonths,
          };
        }
      }
      state.mobileMenuOpen = false;
      if (parseRoute().path !== '/') {
        navigate('#/');
        setTimeout(() => {
          document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function bindPageEvents(path) {
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = el.getAttribute('data-scroll-to');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Store filters + search
  document.querySelectorAll('[data-filter-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.categoryFilter = btn.getAttribute('data-filter-cat') || 'all';
      document.querySelectorAll('[data-filter-cat]').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
      });
      const grid = document.getElementById('loan-store-grid');
      if (grid) grid.innerHTML = renderFilteredLoansGrid();
    });
  });

  document.getElementById('store-search-input')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    const grid = document.getElementById('loan-store-grid');
    if (grid) grid.innerHTML = renderFilteredLoansGrid();
  });

  // EMI calculator controls
  document.querySelectorAll('[data-calc-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prod = getLoanProductBySlug(btn.getAttribute('data-calc-preset'));
      if (!prod) return;
      state.calc = {
        slug: prod.slug,
        amount: prod.defaultAmount,
        rate: prod.defaultRate,
        tenure: prod.defaultTenureMonths,
      };
      renderApp(false);
    });
  });

  const amtRange = document.getElementById('emi-amount-range');
  const amtNum = document.getElementById('emi-amount-num');
  const rateRange = document.getElementById('emi-rate-range');
  const rateNum = document.getElementById('emi-rate-num');
  const tenRange = document.getElementById('emi-tenure-range');
  const tenNum = document.getElementById('emi-tenure-num');

  amtRange?.addEventListener('input', (e) => {
    state.calc.amount = Number(e.target.value);
    if (amtNum) amtNum.value = String(state.calc.amount);
    updateEmiDomOnly();
  });
  amtNum?.addEventListener('input', (e) => {
    state.calc.amount = Math.min(10000000, Math.max(25000, Number(e.target.value) || 25000));
    if (amtRange) amtRange.value = String(Math.min(state.calc.amount, 5000000));
    updateEmiDomOnly();
  });

  rateRange?.addEventListener('input', (e) => {
    state.calc.rate = Number(e.target.value);
    if (rateNum) rateNum.value = String(state.calc.rate);
    updateEmiDomOnly();
  });
  rateNum?.addEventListener('input', (e) => {
    state.calc.rate = Math.min(26, Math.max(8, Number(e.target.value) || 8));
    if (rateRange) rateRange.value = String(state.calc.rate);
    updateEmiDomOnly();
  });

  tenRange?.addEventListener('input', (e) => {
    state.calc.tenure = Number(e.target.value);
    if (tenNum) tenNum.value = String(state.calc.tenure);
    updateEmiDomOnly();
  });
  tenNum?.addEventListener('input', (e) => {
    state.calc.tenure = Math.min(120, Math.max(3, Math.round(Number(e.target.value) || 3)));
    if (tenRange) tenRange.value = String(state.calc.tenure);
    updateEmiDomOnly();
  });

  document.getElementById('emi-apply-btn')?.addEventListener('click', () => {
    const qs = new URLSearchParams({
      loan: state.calc.slug,
      amount: String(state.calc.amount),
      tenure: String(state.calc.tenure),
    });
    navigate(`#/apply?${qs.toString()}`);
  });

  // Testimonials carousel
  document.getElementById('test-prev')?.addEventListener('click', () => {
    const len = siteConfig.testimonials.length;
    state.testimonialIndex = (state.testimonialIndex - 1 + len) % len;
    renderApp(false);
  });
  document.getElementById('test-next')?.addEventListener('click', () => {
    const len = siteConfig.testimonials.length;
    state.testimonialIndex = (state.testimonialIndex + 1) % len;
    renderApp(false);
  });

  // FAQ accordion
  document.querySelectorAll('[data-faq-idx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-faq-idx'));
      state.openFaq = state.openFaq === idx ? null : idx;
      renderApp(false);
    });
  });

  // Apply 3-step form
  if (path === '/apply') {
    const form = document.getElementById('apply-form');
    const syncFields = () => {
      if (!form || !state.applyDraft) return;
      const fd = new FormData(form);
      for (const [k, v] of fd.entries()) {
        if (k === 'consent') continue;
        state.applyDraft[k] = v;
      }
      const consentBox = document.getElementById('f-consent');
      if (consentBox) state.applyDraft.consent = consentBox.checked;

      const { consent: _c, website: _w, ...toSave } = state.applyDraft;
      saveDraft(toSave);
    };

    form?.addEventListener('input', syncFields);
    form?.addEventListener('change', syncFields);

    document.getElementById('apply-next-1')?.addEventListener('click', () => {
      syncFields();
      const d = state.applyDraft;
      if (!d.loanType) {
        state.applyError = 'Please choose a loan product.';
      } else if (!(Number(d.amount) >= 10000 && Number(d.amount) <= 50000000)) {
        state.applyError = 'Enter a valid loan amount between ₹10,000 and ₹5,00,00,000.';
      } else if (!(Number(d.tenure) >= 3 && Number(d.tenure) <= 240)) {
        state.applyError = 'Enter a valid tenure between 3 and 240 months.';
      } else if (String(d.purpose).trim().length < 3) {
        state.applyError = 'Please briefly enter the loan purpose.';
      } else {
        state.applyError = '';
        state.applyStep = 2;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      renderApp(false);
    });

    document.getElementById('apply-back-2')?.addEventListener('click', () => {
      syncFields();
      state.applyError = '';
      state.applyStep = 1;
      renderApp(false);
    });

    document.getElementById('apply-next-2')?.addEventListener('click', () => {
      syncFields();
      const d = state.applyDraft;
      if (String(d.name).trim().length < 2) {
        state.applyError = 'Please enter your full name.';
      } else if (!/^[6-9]\d{9}$/.test(String(d.mobile).trim())) {
        state.applyError = 'Enter a valid 10-digit Indian mobile number starting with 6–9.';
      } else if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) {
        state.applyError = 'Enter a valid email address or leave it blank.';
      } else if (String(d.city).trim().length < 2) {
        state.applyError = 'Please enter your city or Coimbatore area.';
      } else {
        state.applyError = '';
        state.applyStep = 3;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      renderApp(false);
    });

    document.getElementById('apply-edit')?.addEventListener('click', () => {
      state.applyStep = 1;
      state.applyError = '';
      renderApp(false);
    });

    document.getElementById('apply-back-3')?.addEventListener('click', () => {
      state.applyStep = 2;
      state.applyError = '';
      renderApp(false);
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      syncFields();
      const d = state.applyDraft;
      if (d.website && d.website.trim().length > 0) {
        navigate('#/thank-you?ref=MLF-RECEIVED');
        return;
      }
      if (!d.consent) {
        state.applyError = getT().apply.review.consentError;
        renderApp(false);
        return;
      }
      const saved = saveNewLead({ ...d, language: state.lang });
      clearDraft();
      navigate(
        `#/thank-you?ref=${encodeURIComponent(saved.ref)}&loan=${encodeURIComponent(saved.loan_type)}`
      );
    });
  }

  // Admin Console
  if (path === '/admin') {
    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = document.getElementById('admin-password')?.value || '';
      if (pw.trim() !== 'moneyline2026') {
        state.adminLoginError = 'Invalid password (use: moneyline2026)';
        renderApp(false);
        return;
      }
      state.adminLoginError = '';
      setAdminLoggedIn(true);
      renderApp(false);
    });

    document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
      setAdminLoggedIn(false);
      renderApp(false);
    });

    document.getElementById('admin-export-btn')?.addEventListener('click', () => {
      const { leads } = queryLeads(state.adminFilter);
      exportLeadsCsv(leads);
    });

    document.getElementById('admin-search')?.addEventListener('input', (e) => {
      state.adminFilter.search = e.target.value;
      renderApp(false);
      const inp = document.getElementById('admin-search');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    });
    document.getElementById('admin-status')?.addEventListener('change', (e) => {
      state.adminFilter.status = e.target.value;
      renderApp(false);
    });
    document.getElementById('admin-loan')?.addEventListener('change', (e) => {
      state.adminFilter.loanType = e.target.value;
      renderApp(false);
    });
    document.getElementById('admin-from')?.addEventListener('change', (e) => {
      state.adminFilter.dateFrom = e.target.value;
      renderApp(false);
    });
    document.getElementById('admin-to')?.addEventListener('change', (e) => {
      state.adminFilter.dateTo = e.target.value;
      renderApp(false);
    });

    document.querySelectorAll('[data-lead-status]').forEach((sel) => {
      sel.addEventListener('change', () => {
        updateLeadRecord(sel.getAttribute('data-lead-status'), { status: sel.value });
        renderApp(false);
      });
    });

    document.querySelectorAll('[data-save-note]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-save-note');
        const input = document.querySelector(`[data-note-input="${id}"]`);
        updateLeadRecord(id, { notes: input ? input.value : '' });
        btn.textContent = getT().admin.saved;
        setTimeout(() => {
          btn.textContent = 'Save';
        }, 1500);
      });
    });
  }

  // Mount Hero 3D Canvas if on home page
  if (path === '/') {
    const stage = document.getElementById('hero-3d-stage');
    if (stage) {
      cleanupHero3D = mountHero3D(stage);
    }
  }
}

function renderApp(resetScroll = true) {
  if (cleanupHero3D) {
    cleanupHero3D();
    cleanupHero3D = null;
  }

  document.documentElement.lang = state.lang;
  const { path, params } = parseRoute();

  if (path === '/apply' && resetScroll) {
    initApplyDraft(params);
  }

  renderShell();
  bindShellEvents();

  let html = '';
  if (path === '/' || path === '') {
    html = homePageHtml();
  } else if (path === '/loans') {
    html = loansPageHtml();
  } else if (path.startsWith('/loans/')) {
    html = loanDetailPageHtml(path.replace('/loans/', ''));
  } else if (path === '/apply') {
    if (!state.applyDraft) initApplyDraft(params);
    html = applyPageHtml();
  } else if (path === '/thank-you') {
    html = thankYouPageHtml(params);
  } else if (path === '/about') {
    html = aboutPageHtml();
  } else if (path === '/contact') {
    html = contactPageHtml();
  } else if (path === '/privacy-policy') {
    html = legalPageHtml('privacy');
  } else if (path === '/terms') {
    html = legalPageHtml('terms');
  } else if (path === '/grievance') {
    html = legalPageHtml('grievance');
  } else if (path === '/admin') {
    html = adminPageHtml();
  } else {
    html = notFoundPageHtml();
  }

  document.getElementById('app-main').innerHTML = html;
  bindPageEvents(path);

  if (resetScroll) {
    window.scrollTo(0, 0);
  }
}

window.addEventListener('hashchange', () => {
  state.mobileMenuOpen = false;
  renderApp(true);
});

window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

renderApp(true);
