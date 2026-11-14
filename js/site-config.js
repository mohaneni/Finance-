// Single source of truth for Money Line Finance
// TODO items are marked in comments for owner confirmation before public launch.

export const siteConfig = {
  name: 'Money Line Finance',
  nameTa: 'மணி லைன் ஃபைனான்ஸ்',
  taglineEn: 'R.S. Puram, Coimbatore',
  taglineTa: 'ஆர்.எஸ். புரம், கோயம்புத்தூர்',
  address: 'New No. 91, Old No. 58, W Sambandam Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
  addressTa: 'புதிய எண். 91, பழைய எண். 58, மேற்கு சம்பந்தம் சாலை, ஆர்.எஸ். புரம், கோயம்புத்தூர், தமிழ்நாடு 641002',
  phone: '+91 99940 44442',
  phoneHref: 'tel:+919994044442',
  whatsappNumber: '919994044442',
  whatsappUrl: 'https://wa.me/919994044442',
  hoursEn: 'Mon–Sat 10:00–19:30, Sunday Closed',
  hoursTa: 'திங்கள்–சனி காலை 10:00 – மாலை 7:30, ஞாயிறு விடுமுறை',
  googleRating: 4.4,
  googleReviewCount: 29,
  mapEmbedUrl:
    'https://www.google.com/maps?q=New+No.+91,+Old+No.+58,+W+Sambandam+Rd,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Money+Line+Finance+W+Sambandam+Rd+RS+Puram+Coimbatore+641002',

  // TODO: Confirm owner email, exact license number, years, and grievance officer with owner
  ownerEmail: 'enquiries@moneylinefinance.in',
  licenseDetails: 'Registered Financial Advisory & Loan Desk · R.S. Puram, Coimbatore',
  yearsInBusiness: '10+ Years',
  customersServed: '2,500+ Enquiries Guided',
  grievanceOfficer: {
    name: 'Customer Support & Grievance Desk',
    email: 'grievance@moneylinefinance.in',
    phone: '+91 99940 44442',
    address: 'New No. 91, Old No. 58, W Sambandam Rd, R.S. Puram, Coimbatore 641002',
    responseWindowEn: 'Within 48 business hours',
    responseWindowTa: '48 வேலை மணி நேரத்திற்குள்',
  },

  // TODO: Confirm indicative rates, tenure, and eligibility ranges with owner
  loanProducts: [
    {
      slug: 'personal-loan',
      category: 'unsecured',
      icon: 'wallet',
      titleEn: 'Personal Loan',
      titleTa: 'தனிநபர் கடன்',
      shortDescriptionEn:
        'Flexible funds for medical needs, family weddings, education, or home renovation with straightforward guidance.',
      shortDescriptionTa:
        'மருத்துவத் தேவைகள், குடும்பத் திருமணம், கல்வி அல்லது வீடு புதுப்பித்தலுக்கான எளிய தனிநபர் கடன் வழிகாட்டுதல்.',
      overviewEn:
        'Designed for salaried employees and self-employed professionals across Coimbatore seeking transparent personal credit options without collateral.',
      overviewTa:
        'கோயம்புத்தூரில் உள்ள மாதச் சம்பளதாரர்கள் மற்றும் சுயதொழில் செய்பவர்களுக்கு பிணையில்லாத தனிநபர் கடன் விருப்பங்களைத் தெளிவாகப் பெற உதவுகிறது.',
      interestRange: '11.5% – 24% p.a. (indicative)',
      tenureRangeEn: '12 – 60 Months',
      tenureRangeTa: '12 – 60 மாதங்கள்',
      amountRange: '₹50,000 – ₹15,00,000',
      minAmount: 50000,
      maxAmount: 1500000,
      defaultAmount: 300000,
      defaultRate: 14,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      defaultTenureMonths: 36,
      documentsEn: [
        'Identity proof (collected later in person or via verified WhatsApp)',
        'Address proof in Coimbatore / Tamil Nadu',
        'Last 3 months salary slips or income proof',
        'Last 6 months bank statement (reviewed during verification)',
      ],
      documentsTa: [
        'அடையாளச் சான்று (நேரில் அல்லது சரிபார்க்கப்பட்ட வாட்ஸ்அப் மூலம் பின்னர் பெறப்படும்)',
        'கோயம்புத்தூர் / தமிழ்நாடு முகவரிச் சான்று',
        'கடந்த 3 மாத சம்பள ரசீது அல்லது வருமானச் சான்று',
        'கடந்த 6 மாத வங்கி கணக்கு அறிக்கை (சரிபார்ப்பின் போது மட்டும்)',
      ],
      eligibilityEn: [
        'Age between 21 and 58 years',
        'Steady monthly income (Salaried or Self-employed)',
        'Resident of Coimbatore or surrounding districts',
      ],
      eligibilityTa: [
        'வயது 21 முதல் 58 வயதுக்குள் இருக்க வேண்டும்',
        'நிலையான மாத வருமானம் (சம்பளதாரர் அல்லது சுயதொழில்)',
        'கோயம்புத்தூர் அல்லது அருகிலுள்ள மாவட்டங்களில் வசிப்பவர்',
      ],
      faqs: [
        {
          questionEn: 'Do I need to upload Aadhaar or PAN on this website?',
          answerEn:
            'No. We never collect Aadhaar, PAN, or bank numbers online. Our executive calls you first and explains what to bring in person or share later.',
          questionTa: 'இணையதளத்தில் ஆதார் அல்லது பான் எண் பதிவேற்ற வேண்டுமா?',
          answerTa:
            'இல்லை. நாங்கள் ஆன்லைனில் ஆதார், பான் அல்லது வங்கி விவரங்களைப் பெறுவதில்லை. எங்கள் அதிகாரி முதலில் உங்களைத் தொடர்பு கொண்டு நேரில் சமர்ப்பிக்க வேண்டிய விவரங்களைத் தெரிவிப்பார்.',
        },
        {
          questionEn: 'How are Personal Loan interest rates decided?',
          answerEn:
            'Rates depend on your income profile, repayment history, loan amount, and lending partner terms after verification.',
          questionTa: 'தனிநபர் கடன் வட்டி விகிதம் எவ்வாறு தீர்மானிக்கப்படுகிறது?',
          answerTa:
            'உங்கள் வருமானம், திருப்பிச் செலுத்தும் வரலாறு, கடன் தொகை மற்றும் கடன் வழங்கும் நிறுவனத்தின் விதிமுறைகளைப் பொறுத்து வட்டி விகிதம் மாறுபடும்.',
        },
      ],
    },
    {
      slug: 'business-loan',
      category: 'business',
      icon: 'briefcase',
      titleEn: 'Business Loan',
      titleTa: 'தொழில் கடன்',
      shortDescriptionEn:
        'Working capital, machinery expansion, and inventory support tailored for Coimbatore MSMEs and traders.',
      shortDescriptionTa:
        'கோயம்புத்தூர் சிறு, குறு தொழில்கள் மற்றும் வியாபாரிகளுக்கான பணி மூலதனம், இயந்திர விரிவாக்கம் மற்றும் சரக்கு கொள்முதல் கடன்.',
      overviewEn:
        'Built for textile units, foundries, retail shops, and service enterprises across Coimbatore looking for structured working capital or expansion finance.',
      overviewTa:
        'கோயம்புத்தூரில் உள்ள ஜவுளி நிறுவனங்கள், தொழிற்சாலைகள், கடைகள் மற்றும் சேவை நிறுவனங்களின் விரிவாக்கம் மற்றும் மூலதனத் தேவைகளுக்காக வடிவமைக்கப்பட்டது.',
      interestRange: '13% – 24% p.a. (indicative)',
      tenureRangeEn: '12 – 48 Months',
      tenureRangeTa: '12 – 48 மாதங்கள்',
      amountRange: '₹1,00,000 – ₹35,00,000',
      minAmount: 100000,
      maxAmount: 3500000,
      defaultAmount: 500000,
      defaultRate: 15.5,
      minTenureMonths: 12,
      maxTenureMonths: 48,
      defaultTenureMonths: 36,
      documentsEn: [
        'Business registration / GST / Udyam certificate (reviewed offline)',
        'Proprietor or partner KYC (collected later in person)',
        'Last 12 months business bank statements',
        'Latest ITR / financial statement if applicable',
      ],
      documentsTa: [
        'தொழில் பதிவு / GST / உத்யம் சான்றிதழ் (நேரில் சரிபார்க்கப்படும்)',
        'உரிமையாளர் அல்லது கூட்டாளர் KYC (பின்னர் நேரில் பெறப்படும்)',
        'கடந்த 12 மாத தொழில் வங்கி கணக்கு அறிக்கை',
        'சமீபத்திய ITR / நிதி அறிக்கை (பொருந்தினால்)',
      ],
      eligibilityEn: [
        'Minimum 1–2 years of business vintage in Tamil Nadu',
        'Active current or business bank account',
        'Verifiable business premises or trade activity',
      ],
      eligibilityTa: [
        'தமிழ்நாட்டில் குறைந்தது 1–2 ஆண்டுகள் தொழில் அனுபவம்',
        'செயலில் உள்ள தொழில் வங்கி கணக்கு',
        'சரிபார்க்கக்கூடிய தொழில் இடம் அல்லது வியாபார செயல்பாடு',
      ],
      faqs: [
        {
          questionEn: 'Can small shop owners without GST apply for an enquiry?',
          answerEn:
            'Yes. Submit an enquiry and our team will discuss available options based on your business turnover and banking record.',
          questionTa: 'GST இல்லாத சிறிய கடை உரிமையாளர்கள் விண்ணப்பிக்கலாமா?',
          answerTa:
            'ஆம். விசாரணைப் படிவத்தைச் சமர்ப்பிக்கவும்; உங்கள் வியாபார வரவு செலவு அடிப்படையில் உள்ள விருப்பங்களை எங்கள் குழு விளக்கும்.',
        },
      ],
    },
    {
      slug: 'vehicle-loan',
      category: 'secured',
      icon: 'car',
      titleEn: 'Vehicle Loan',
      titleTa: 'வாகனக் கடன்',
      shortDescriptionEn:
        'Financing guidance for new and pre-owned two-wheelers, cars, and commercial vehicles in Coimbatore.',
      shortDescriptionTa:
        'கோயம்புத்தூரில் புதிய மற்றும் பழைய இருசக்கர வாகனங்கள், கார்கள் மற்றும் வணிக வாகனங்களுக்கான கடன் வழிகாட்டுதல்.',
      overviewEn:
        'Whether buying a family car, commuter scooter, or commercial carrier, we help you compare repayment terms clearly before you commit.',
      overviewTa:
        'குடும்ப கார், இருசக்கர வாகனம் அல்லது வணிக வாகனம் வாங்கும்போது, தெளிவான மாதத் தவணை மற்றும் விதிமுறைகளை அறிய உதவுகிறோம்.',
      interestRange: '9.5% – 18% p.a. (indicative)',
      tenureRangeEn: '12 – 60 Months',
      tenureRangeTa: '12 – 60 மாதங்கள்',
      amountRange: '₹40,000 – ₹25,00,000',
      minAmount: 40000,
      maxAmount: 2500000,
      defaultAmount: 400000,
      defaultRate: 11.5,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      defaultTenureMonths: 48,
      documentsEn: [
        'Proforma invoice (new vehicle) or RC copy (used vehicle) reviewed offline',
        'Valid driving licence & address proof (collected later)',
        'Income proof & recent bank statement',
      ],
      documentsTa: [
        'வாகன விலைப்பட்டியல் (புதியது) அல்லது RC நகல் (பழைய வாகனம்) — நேரில் சரிபார்க்கப்படும்',
        'ஓட்டுநர் உரிமம் மற்றும் முகவரிச் சான்று (பின்னர் பெறப்படும்)',
        'வருமானச் சான்று மற்றும் சமீபத்திய வங்கி அறிக்கை',
      ],
      eligibilityEn: [
        'Age 21–62 years with valid driving licence',
        'Salaried, self-employed, or commercial operator',
        'Vehicle valuation subject to physical inspection for used vehicles',
      ],
      eligibilityTa: [
        'வயது 21–62 மற்றும் செல்லுபடியாகும் ஓட்டுநர் உரிமம்',
        'சம்பளதாரர், சுயதொழில் அல்லது வாகன உரிமையாளர்',
        'பழைய வாகனங்களுக்கு நேரடி மதிப்பீடு செய்யப்படும்',
      ],
      faqs: [
        {
          questionEn: 'Do you assist with pre-owned car loan enquiries?',
          answerEn:
            'Yes, we handle enquiries for both new and verified pre-owned vehicles subject to valuation and eligibility.',
          questionTa: 'பழைய (Second-hand) கார் கடன்களுக்கும் உதவி செய்கிறீர்களா?',
          answerTa:
            'ஆம், மதிப்பீடு மற்றும் தகுதியின் அடிப்படையில் புதிய மற்றும் பழைய வாகனக் கடன் விசாரணைகளுக்கு உதவுகிறோம்.',
        },
      ],
    },
    {
      slug: 'gold-loan',
      category: 'secured',
      icon: 'coins',
      titleEn: 'Gold Loan',
      titleTa: 'நகைக் கடன்',
      shortDescriptionEn:
        'Quick in-branch evaluation against gold ornaments at our R.S. Puram office with clear per-gram valuation.',
      shortDescriptionTa:
        'ஆர்.எஸ். புரம் அலுவலகத்தில் தங்க நகைகளுக்கு நேரடி மதிப்பீடு மற்றும் தெளிவான வட்டி விதிமுறைகளுடன் கடன்.',
      overviewEn:
        'Unlock immediate liquidity from household gold jewellery with transparent weight & purity appraisal conducted at our R.S. Puram desk.',
      overviewTa:
        'உங்கள் தங்க நகைகளின் எடை மற்றும் தரத்தை வெளிப்படையாக மதிப்பீடு செய்து, அவசர நிதித் தேவைகளுக்கு விரைவான தீர்வு பெறலாம்.',
      interestRange: '9.0% – 16% p.a. (indicative)',
      tenureRangeEn: '3 – 24 Months',
      tenureRangeTa: '3 – 24 மாதங்கள்',
      amountRange: '₹25,000 – ₹25,00,000',
      minAmount: 25000,
      maxAmount: 2500000,
      defaultAmount: 150000,
      defaultRate: 11,
      minTenureMonths: 3,
      maxTenureMonths: 24,
      defaultTenureMonths: 12,
      documentsEn: [
        'Gold ornaments for physical purity & weight assessment at branch',
        'Basic KYC identity & address proof (verified in person)',
      ],
      documentsTa: [
        'கிளையில் நேரடி எடை மற்றும் தர பரிசோதனைக்கான தங்க நகைகள்',
        'அடிப்படை KYC அடையாள மற்றும் முகவரிச் சான்று (நேரில் சரிபார்க்கப்படும்)',
      ],
      eligibilityEn: [
        'Age 18 years and above',
        'Owner of gold jewellery (18K–22K ornaments)',
        'In-person visit to R.S. Puram office for safe appraisal',
      ],
      eligibilityTa: [
        '18 வயது மற்றும் அதற்கு மேற்பட்டவர்',
        'தங்க நகைகளின் உரிமையாளர் (18K–22K ஆபரணங்கள்)',
        'பாதுகாப்பான மதிப்பீட்டிற்கு ஆர்.எஸ். புரம் அலுவலகத்திற்கு நேரில் வருகை',
      ],
      faqs: [
        {
          questionEn: 'How long does Gold Loan valuation take?',
          answerEn:
            'Once you visit our R.S. Puram office after your callback, physical ornament testing and term explanation are typically completed the same day, subject to verification.',
          questionTa: 'நகைக் கடன் மதிப்பீடு எவ்வளவு நேரம் எடுக்கும்?',
          answerTa:
            'தொலைபேசி அழைப்பிற்குப் பிறகு ஆர்.எஸ். புரம் அலுவலகத்திற்கு நேரில் வரும்போது, நகை பரிசோதனை மற்றும் விதிமுறை விளக்கம் பொதுவாக அன்றைய தினமே முடிந்துவிடும்.',
        },
      ],
    },
    {
      slug: 'loan-against-property',
      category: 'secured',
      icon: 'building',
      titleEn: 'Loan Against Property',
      titleTa: 'சொத்து மீதான கடன்',
      shortDescriptionEn:
        'Higher-value funding backed by residential or commercial property in Coimbatore at lower indicative rates.',
      shortDescriptionTa:
        'கோயம்புத்தூரில் உள்ள வீடு அல்லது வணிக சொத்துக்கள் மீது குறைந்த வட்டியில் அதிக தொகை கடன் வழிகாட்டுதல்.',
      overviewEn:
        'Leverage your residential house, commercial building, or approved plot in Coimbatore for business growth, debt consolidation, or major family milestones.',
      overviewTa:
        'உங்கள் குடியிருப்பு, வணிகக் கட்டிடம் அல்லது அங்கீகரிக்கப்பட்ட மனை மீது தொழில் வளர்ச்சி அல்லது பெரிய தேவைகளுக்காக கடன் விருப்பங்களைப் பெறலாம்.',
      interestRange: '9.5% – 15% p.a. (indicative)',
      tenureRangeEn: '24 – 120 Months',
      tenureRangeTa: '24 – 120 மாதங்கள்',
      amountRange: '₹5,00,000 – ₹1,00,00,000',
      minAmount: 500000,
      maxAmount: 10000000,
      defaultAmount: 1500000,
      defaultRate: 11.25,
      minTenureMonths: 24,
      maxTenureMonths: 120,
      defaultTenureMonths: 84,
      documentsEn: [
        'Property title deed & EC copy (reviewed in person by legal team)',
        'Applicant & co-applicant KYC (collected offline later)',
        'Income proof / ITR & 12 months bank statements',
      ],
      documentsTa: [
        'சொத்து பத்திரம் மற்றும் EC நகல் (சட்டக் குழுவால் நேரில் சரிபார்க்கப்படும்)',
        'விண்ணப்பதாரர் மற்றும் இணை விண்ணப்பதாரர் KYC (பின்னர் நேரில் பெறப்படும்)',
        'வருமானச் சான்று / ITR மற்றும் 12 மாத வங்கி கணக்கு அறிக்கை',
      ],
      eligibilityEn: [
        'Clear, marketable property title in Coimbatore or nearby areas',
        'Steady salaried or business repayment capacity',
        'Subject to legal & technical property valuation',
      ],
      eligibilityTa: [
        'கோயம்புத்தூர் மற்றும் அருகிலுள்ள பகுதிகளில் தெளிவான சொத்து உரிமை',
        'நிலையான மாத வருமானம் அல்லது தொழில் வருவாய்',
        'சட்ட மற்றும் தொழில்நுட்ப சொத்து மதிப்பீட்டிற்கு உட்பட்டது',
      ],
      faqs: [
        {
          questionEn: 'Can I still use my property while the loan is active?',
          answerEn:
            'Yes, you continue to reside in or operate your business from the property while repaying the loan as per the agreement.',
          questionTa: 'கடன் செயலில் இருக்கும்போது எனது சொத்தை நான் பயன்படுத்தலாமா?',
          answerTa:
            'ஆம், ஒப்பந்தத்தின்படி தவணை செலுத்தும் காலத்தில் நீங்கள் அந்த சொத்தில் வசிக்கவோ அல்லது தொழில் நடத்தவோ செய்யலாம்.',
        },
      ],
    },
  ],

  // TODO: Replace sample testimonials only with explicit customer permission
  testimonials: [
    {
      id: 't1',
      name: 'Karthikeyan S.',
      area: 'R.S. Puram, Coimbatore',
      loanTypeEn: 'Business Loan Enquiry',
      loanTypeTa: 'தொழில் கடன் விசாரணை',
      quoteEn:
        'The staff at W Sambandam Road explained every charge upfront and guided me on the exact documents needed before I visited.',
      quoteTa:
        'மேற்கு சம்பந்தம் சாலை அலுவலகத்தில் உள்ள பணியாளர்கள் அனைத்து கட்டணங்களையும் முன்கூட்டியே தெளிவாக விளக்கினார்கள்.',
    },
    {
      id: 't2',
      name: 'Priyadharshini M.',
      area: 'Saibaba Colony, Coimbatore',
      loanTypeEn: 'Personal Loan Enquiry',
      loanTypeTa: 'தனிநபர் கடன் விசாரணை',
      quoteEn:
        'Received a callback the same afternoon. Very polite communication in Tamil and zero pressure during the discussion.',
      quoteTa:
        'அன்றைய மதியமே அழைப்பு வந்தது. தமிழில் மிகவும் மரியாதையாகவும் தெளிவாகவும் விளக்கினார்கள்.',
    },
    {
      id: 't3',
      name: 'Senthil Kumar R.',
      area: 'Peelamedu, Coimbatore',
      loanTypeEn: 'Vehicle Loan Enquiry',
      loanTypeTa: 'வாகனக் கடன் விசாரணை',
      quoteEn:
        'Using the EMI calculator helped me pick a comfortable 48-month plan before speaking to the team.',
      quoteTa:
        'EMI கால்குலேட்டரைப் பயன்படுத்தி எனக்கு ஏற்ற 48 மாதத் தவணையை முன்கூட்டியே திட்டமிட முடிந்தது.',
    },
  ],
};

export function getLoanProductBySlug(slug) {
  return siteConfig.loanProducts.find((p) => p.slug === slug);
}
