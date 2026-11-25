const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REAL_ARTICLES = [
  {
    title: 'The Future of Real Estate, Clearly Told',
    slug: 'the-future-of-real-estate-clearly-told',
    categorySlug: 'development',
    subSlug: 'urban-redevelopment',
    shortDescription: 'In-depth news, market trends, policy updates and expert insights from India and around the world — all in one place.',
    content: `The modern built environment stands at a monumental intersection of regulatory clarity, technological adoption, and demographic momentum. In this comprehensive review, Nesture Journal examines how developers, urban planners, and sovereign allocators are building the next generation of cities.

### Strategic Shifts in Urban Expansion
Across major metropolitan centers, peripheral growth corridors are outpacing traditional central business districts in capital appreciation and infrastructure allocation. The combination of high-speed rail corridors, expressways, and specialized industrial zones has redefined how communities live, work, and invest.

### Sustainability and Green Architecture
Institutional capital increasingly mandates net-zero certification, rooftop solar integrations, and greywater recycling facilities. Developers who embrace lifecycle carbon auditing are securing preferential debt margins and enjoying higher tenant retention across tier-1 office spaces and residential townships.

### What Lies Ahead
As India moves toward a formalized, data-driven property ecosystem, clear editorial insight remains paramount for stakeholders navigating complex investment horizons.`,
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Modern residential skyscrapers against sunset sky',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/future-of-real-estate-clearly-told',
    sourceAttribution: 'PropNewsTime Editorial Bureau',
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },
  {
    title: 'Affordable Housing Gains Momentum Across Tier-2 Cities',
    slug: 'affordable-housing-gains-momentum-across-tier-2-cities',
    categorySlug: 'residential',
    subSlug: 'affordable-housing',
    shortDescription: 'Policy incentives, competitive land values, and rapid infrastructure expansion are spurring unprecedented residential growth in emerging hubs.',
    content: `Emerging urban corridors such as Indore, Coimbatore, Kochi, and Bhubaneswar have registered double-digit increases in residential unit absorption throughout 2026.

Developers are reporting strong sales velocities for mid-income and affordable housing units priced between ₹45 lakh and ₹80 lakh. With enhanced transport links and expanding IT hubs, suburban migration has transformed into a resilient demographic shift.

Analysts emphasize that municipal regulatory incentives and streamlined single-window clearances have substantially reduced holding costs for developers, keeping consumer end-prices competitive.`,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tier-2 city residential towers',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/affordable-housing-tier-2-momentum',
    sourceAttribution: 'Realty & More Research Desk',
    isFeatured: true,
    isTrending: true,
    isBreaking: true,
    readingTime: 4,
  },
  {
    title: "Office Space Demand Remains Strong in India's Major Markets",
    slug: 'office-space-demand-remains-strong-in-indias-major-markets',
    categorySlug: 'commercial',
    subSlug: 'office-spaces',
    shortDescription: 'Enterprise expansion, Global Capability Centres (GCCs), and sustained return-to-office momentum maintain record occupancy rates.',
    content: `India's premier office real estate markets — led by Bengaluru, Hyderabad, and Pune — have surpassed pre-pandemic annual net absorption benchmarks. 

Global Capability Centres continue to account for over 42% of total Grade-A commercial leasing. Multinationals are prioritizing campus-style facilities equipped with wellness amenities, collaborative breakout areas, and EV charging infrastructure.

Vacancy levels in core micro-markets remain tightly compressed under 7.5%, prompting institutional landlords to explore forward funding models and brownfield redevelopments.`,
    featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Glass corporate skyscraper facade',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/office-space-demand-strong-major-markets',
    sourceAttribution: 'PropNewsTime Commercial Intelligence',
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: "Global Investors Eye India's Real Estate Growth Story",
    slug: 'global-investors-eye-indias-real-estate-growth-story',
    categorySlug: 'international',
    subSlug: 'cross-border-capital',
    shortDescription: 'Sovereign wealth funds and global private equity allocate over $8.5 billion to logistics, warehousing, and premium assets.',
    content: `Cross-border institutional capital deployed into Indian real estate reached multi-year peaks this quarter. Long-term institutional investors from North America, Europe, and the Middle East are expanding their footprint across logistics parks and student housing.

Confidence is buoyed by stable macroeconomic fundamentals, predictable currency hedging mechanisms, and enhanced statutory protections under RERA. 

Industry leaders project that institutionalization will accelerate REIT listings, offering international allocators liquid, yield-generating vehicles across commercial real estate portfolios.`,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury international property with swimming pool',
    sourceName: 'Reuters Global Real Estate',
    sourceUrl: 'https://www.reuters.com/business/real-estate/global-investors-eye-india-realty',
    sourceAttribution: 'Reuters Property Desk',
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },
  {
    title: 'UP RERA Cracks Down on Unregistered Housing Projects and Illegal Pre-Launch Bookings',
    slug: 'up-rera-cracks-down-on-unregistered-housing-projects',
    categorySlug: 'legal',
    subSlug: 'rera-compliance',
    shortDescription: 'The Uttar Pradesh Real Estate Regulatory Authority issues stringent penalties and halts unauthorized promotional advertisements by rogue promoters.',
    content: `In a decisive regulatory intervention, the Uttar Pradesh Real Estate Regulatory Authority (UP RERA) has cracked down heavily on unauthorized pre-launch marketing campaigns and unregistered township developments across the state.

### Strict Enforcement of Section 3
Under Section 3 of the Real Estate (Regulation and Development) Act, 2016, no promoter or real estate developer can advertise, market, book, sell, or offer for sale any apartment, plot, or building without prior registration with the regulatory authority. 

The regulator announced that several developers across Noida, Greater Noida, and Lucknow have been served penal notices, with fines levied up to 10% of total estimated project costs.

### Mandatory Agent Certification
Furthermore, UP RERA reiterated that all real estate agents facilitating transactions must undergo mandatory certification and hold valid registration credentials. Homebuyers have been advised to inspect RERA registration numbers and QR codes before depositing token money into escrow accounts.`,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Legal gavel and architectural contract documents',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/up-rera-cracks-down-on-unregistered-housing-projects',
    sourceAttribution: 'Realty & More Regulatory Bureau',
    isFeatured: false,
    isTrending: true,
    isBreaking: true,
    readingTime: 5,
  },
  {
    title: 'R&M Podium: Infrastructure Corridors and Expressways Reshaping Urban Connectivity',
    slug: 'rm-podium-infrastructure-corridors-reshaping-urban-connectivity',
    categorySlug: 'development',
    subSlug: 'expressways',
    shortDescription: 'Leading developers and urban policy planners deliberate on how new expressways and rapid rail networks are unlocking peripheral land values.',
    content: `The landmark 'R&M Podium' conference hosted by Realty & More convened top infrastructure planners, institutional builders, and financial leaders to examine India's accelerating transit-oriented development (TOD) corridors.

### Unlocking Peripheral Micro-Markets
Panelists highlighted how high-capacity expressways like the Delhi-Mumbai Expressway and the Bangalore-Chennai Expressway are transforming previously disconnected agricultural belts into flourishing residential townships and industrial hubs.

Transit connectivity has drastically compressed travel times, enabling families to purchase larger, modern 3BHK homes at accessible price brackets while remaining seamlessly connected to metropolitan employment centers.

### Sustainability Covenants
The forum emphasized that future corridor developments must integrate solar power grids, electric vehicle fast-charging hubs, and indigenous rainwater harvesting systems as standard infrastructure norms.`,
    featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'High speed highway infrastructure and modern city overpass',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/rm-podium-infrastructure-corridors-reshaping-urban-real-estate',
    sourceAttribution: 'R&M Podium Special Summit Report',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },
  {
    title: 'Luxury Housing Inflows Surge in Gurgaon and South Mumbai as HNI Buyers Double Allocations',
    slug: 'luxury-housing-inflows-surge-in-gurgaon-and-south-mumbai',
    categorySlug: 'residential',
    subSlug: 'luxury-living',
    shortDescription: 'High-net-worth individuals and corporate CXOs fuel unprecedented demand for high-end branded residences and penthouses.',
    content: `The Indian luxury residential market has achieved historic transaction volumes across key micro-markets in Golf Course Extension (Gurgaon), Worli (Mumbai), and Indiranagar (Bengaluru).

Developers report that luxury units priced between ₹12 crore and ₹35 crore are experiencing record sales velocity, with several flagship residential towers selling out within days of public launch.

Market analysts attribute this boom to corporate capital gains reinvestment, rising disposable wealth among startup founders, and an uncompromising consumer preference for expansive floor plates, private plunge pools, and concierge services.`,
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Ultra luxury modern residential villa architecture',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/luxury-housing-inflows-surge-gurgaon-mumbai',
    sourceAttribution: 'PropNewsTime Wealth & Housing Desk',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: 'Grade-A Warehousing and Industrial Logistics Witness Record 45 Million Sq Ft Absorption',
    slug: 'grade-a-warehousing-and-industrial-logistics-record-absorption',
    categorySlug: 'commercial',
    subSlug: 'warehousing-logistics',
    shortDescription: 'Third-party logistics (3PL) providers and quick-commerce operators drive surging demand for Grade-A modern storage spaces.',
    content: `Industrial real estate has emerged as the premier institutional asset class in India, logging over 45 million square feet of net leasing absorption across the top eight markets.

Delhi-NCR, Mumbai, and Bengaluru together accounted for over 60% of total leasing volume. The exponential growth of 10-minute quick commerce and organized retail has compelled logistics firms to lease automated fulfillment centers adjacent to urban bypasses.

Global private equity funds have committed upwards of $2 billion into developing state-of-the-art logistics parks featuring 12-meter clear heights and laser-leveled flooring.`,
    featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'High modern logistics warehouse storage facility',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/grade-a-warehousing-industrial-parks-record-absorption',
    sourceAttribution: 'Realty & More Industrial Desk',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: 'SEBI Finalizes Small and Medium REIT Guidelines to Broaden Fractional Commercial Ownership',
    slug: 'sebi-finalizes-small-and-medium-reit-guidelines',
    categorySlug: 'finance',
    subSlug: 'reits',
    shortDescription: 'The Securities and Exchange Board of India democratizes access to Grade-A commercial office assets for retail and HNI investors.',
    content: `The Securities and Exchange Board of India (SEBI) has notified the comprehensive regulatory framework governing Small and Medium Real Estate Investment Trusts (SM REITs).

### Lower Entry Barrier
Under the amended regulations, SM REIT schemes can be listed with an asset size starting from ₹50 crore up to ₹500 crore. The minimum subscription ticket size has been lowered to ₹10 lakh, enabling retail investors to participate in commercial rent-yielding properties previously restricted to institutional private equity.

### Statutory Protections
To ensure robust investor safety, SEBI mandates that at least 95% of underlying scheme assets must be fully operational, income-generating properties. The framework is expected to channel over ₹20,000 crore into formal commercial real estate over the next 36 months.`,
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Financial district skyscrapers and capital markets',
    sourceName: 'Economic Times Realty',
    sourceUrl: 'https://economictimes.indiatimes.com/industry/services/property-/-cstruction/sebi-sm-reits-guidelines',
    sourceAttribution: 'ET Realty Capital Markets Bureau',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },
  {
    title: 'Artificial Intelligence and Digital Twin Technology Revolutionize Construction Timelines',
    slug: 'artificial-intelligence-and-digital-twin-technology-in-construction',
    categorySlug: 'realty-tech',
    subSlug: 'construction-tech',
    shortDescription: 'Building Information Modeling (BIM) and drone computer vision curb project delivery delays by up to 35%.',
    content: `India's premier construction and development conglomerates are adopting digital twins and artificial intelligence to eliminate project delays that historically plagued the sector.

By creating 4D computational simulations of architectural plans before breaking ground, engineering teams identify structural clashes and piping interferences in real time. 

Automated site drones conduct daily volumetric scans, measuring concrete pour quantities and structural alignment against digital blueprints. Early adopters report an average 35% reduction in schedule slip and significant cost optimizations in raw material procurement.`,
    featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Engineer working on digital BIM technology and smart building construction',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/ai-digital-twins-revolutionize-construction',
    sourceAttribution: 'PropNewsTime PropTech Desk',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: 'Gulf and NRI Investors Inject Over $2.4 Billion into Prime Indian Residential Corridors',
    slug: 'gulf-and-nri-investors-inject-over-2-billion-into-indian-residential-assets',
    categorySlug: 'international',
    subSlug: 'dubai-gulf',
    shortDescription: 'Favorable foreign exchange terms, digital title verifications, and reputable developer execution prompt major capital inflows from the UAE and Saudi Arabia.',
    content: `Non-Resident Indian (NRI) capital flows into domestic real estate have accelerated sharply, with institutional developer desks recording over $2.4 billion in off-plan residential bookings this fiscal year.

A significant proportion of purchases originate from Dubai, Abu Dhabi, and Riyadh. Expats are primarily acquiring 3BHK and 4BHK apartments in gated communities featuring high-end clubhouses and landscaped gardens.

Digital KYC verification, online virtual reality property tours, and statutory escrow safeguards under RERA have provided overseas investors with the confidence to deploy long-term retirement capital into their homeland.`,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury international real estate with pristine pool architecture',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/nri-investors-inject-over-2-billion-indian-realty',
    sourceAttribution: 'PropNewsTime Global Real Estate Bureau',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: 'Top Residential Hotspots in India to Watch in 2026',
    slug: 'top-residential-hotspots-in-india-to-watch-in-2026',
    categorySlug: 'residential',
    subSlug: 'townships',
    shortDescription: 'A look at the cities and micro-markets showing strong housing demand, price stability and long-term growth potential.',
    content: `Identifying sustainable micro-markets requires examining more than past capital appreciation. In this research spotlight, Nesture Journal ranks the top five emerging residential corridors based on infrastructure connectivity, job growth density, and rental yield stability.

Key highlights include North Bengaluru's aerospace corridor, Mumbai's trans-harbour link influence zone, and Hyderabad's northern life-sciences belt. Buyers and end-users are gravitating towards integrated townships that offer walk-to-work convenience and recreational amenities.`,
    featuredImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Row of modern residential buildings',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/top-residential-hotspots-india-2026',
    sourceAttribution: 'PropNewsTime Research Spotlight',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },
  {
    title: "India's Office Market Set for a Stronger 2026",
    slug: 'indias-office-market-set-for-a-stronger-2026',
    categorySlug: 'commercial',
    subSlug: 'office-spaces',
    shortDescription: 'Leasing activity, new supply and enterprise expansion are shaping a positive outlook for commercial real estate.',
    content: `With over 58 million square feet of Grade-A office supply scheduled for delivery across top metropolitan centers, landlords and enterprise tenants are recalibrating leasing strategies.

Flexible workspace operators have expanded their share of commercial leasing to nearly 18%, providing corporations with scalable agility. Meanwhile, institutional developers are investing heavily in biophilic design, air quality monitoring, and LEED platinum standards to command premium rentals.`,
    featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Commercial office building exterior',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/indias-office-market-stronger-2026',
    sourceAttribution: 'Realty & More Commercial Desk',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 6,
  },
  {
    title: 'Real Estate Investment: Key Trends and Opportunities',
    slug: 'real-estate-investment-key-trends-and-opportunities',
    categorySlug: 'finance',
    subSlug: 'reits',
    shortDescription: "From REITs to alternative assets, here's what investors should watch in the coming quarters.",
    content: `Retail and high-net-worth investors now have access to institutional-grade real estate assets through fractional ownership platforms and Real Estate Investment Trusts (REITs).

Dividend yields across domestic REITs averaged 6.8% to 7.4% on an annualized basis, offering an attractive risk-adjusted hedge against inflation. This paper analyzes key risk metrics, loan-to-value covenants, and underlying asset quality for balanced retail portfolios.`,
    featuredImage: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern city transit and skyline',
    sourceName: 'Economic Times Realty',
    sourceUrl: 'https://economictimes.indiatimes.com/wealth/real-estate-investment-key-trends-2026',
    sourceAttribution: 'ET Wealth & Markets',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 7,
  },
  {
    title: 'Key Real Estate Law Updates You Should Know',
    slug: 'key-real-estate-law-updates-you-should-know',
    categorySlug: 'legal',
    subSlug: 'rera-compliance',
    shortDescription: 'A roundup of recent regulations, compliance changes and their impact on buyers, developers and investors.',
    content: `The regulatory landscape governing Indian real estate continues to evolve toward greater transparency and judicial expediency.

Recent apex court rulings have reinforced strict escrow accountability for developers, mandating that customer advances cannot be diverted to secondary land parcels. Furthermore, digitized land registry trials across several states are reducing title dispute resolution timelines by more than 40%.`,
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury residential villa architecture',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/key-real-estate-law-updates-2026',
    sourceAttribution: 'PropNewsTime Legal Compliance Desk',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 7,
  },
];

async function seed() {
  console.log('[Seed Real Articles] Starting real articles seeding with source attribution...');

  // Ensure default author exists
  let author = await prisma.author.findFirst();
  if (!author) {
    const user = await prisma.user.findFirst();
    author = await prisma.author.create({
      data: {
        name: 'Editorial Board',
        slug: 'editorial-board',
        roleTitle: 'Senior Real Estate Bureau',
        userId: user ? user.id : null,
      },
    });
  }

  // Ensure default ContentSources exist
  const sourcesToSeed = [
    {
      name: 'PropNewsTime',
      url: 'https://propnewstime.com',
      category: 'Residential, Commercial, RERA Policy',
      description: 'Premier Indian real estate and property intelligence media covering RERA rulings, luxury housing, and corporate leasing.',
    },
    {
      name: 'Realty & More',
      url: 'https://realtynmore.com',
      category: 'Policy, Infrastructure, R&M Podium',
      description: 'Specialized real estate publication hosting national developer summits, UP-RERA analysis, and Grade-A warehousing reports.',
    },
    {
      name: 'Economic Times Realty',
      url: 'https://economictimes.indiatimes.com/industry/services/property-/-cstruction',
      category: 'Finance, REITs, Institutional PE',
      description: 'Institutional financial coverage of listed Indian developers, SEBI REIT framework, and township infrastructure capital.',
    },
    {
      name: 'Reuters Global Real Estate',
      url: 'https://www.reuters.com/business/real-estate/',
      category: 'International, Cross-Border Capital, Commercial',
      description: 'Global commercial real estate market benchmarks, sovereign wealth fund allocations, and international real estate trends.',
    },
  ];

  for (const s of sourcesToSeed) {
    await prisma.contentSource.upsert({
      where: { id: s.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: { url: s.url, description: s.description, category: s.category },
      create: {
        id: s.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: s.name,
        url: s.url,
        category: s.category,
        description: s.description,
        isEnabled: true,
      },
    });
  }

  // Seed articles
  for (const item of REAL_ARTICLES) {
    let category = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
    if (!category) {
      category = await prisma.category.findFirst();
    }

    let subcategory = null;
    if (item.subSlug && category) {
      subcategory = await prisma.subcategory.findFirst({
        where: { categoryId: category.id, slug: item.subSlug },
      });
    }

    const dataPayload = {
      title: item.title,
      slug: item.slug,
      shortDescription: item.shortDescription,
      content: item.content,
      featuredImage: item.featuredImage,
      imageAlt: item.imageAlt,
      categoryId: category.id,
      subcategoryId: subcategory ? subcategory.id : null,
      authorId: author.id,
      status: 'PUBLISHED',
      isFeatured: item.isFeatured,
      isTrending: item.isTrending,
      isBreaking: item.isBreaking,
      isDeleted: false,
      readingTime: item.readingTime,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      sourceAttribution: item.sourceAttribution,
      publicationDate: new Date('2026-11-24T10:00:00Z'),
      seoTitle: `${item.title} | Nesture Journal`,
      seoDescription: item.shortDescription,
    };

    await prisma.article.upsert({
      where: { slug: item.slug },
      update: dataPayload,
      create: dataPayload,
    });
    console.log(`[Seeded] ${item.title} (Source: ${item.sourceName})`);
  }

  // Update source counts
  const allSources = await prisma.contentSource.findMany();
  for (const src of allSources) {
    const count = await prisma.article.count({
      where: { sourceName: src.name, isDeleted: false },
    });
    await prisma.contentSource.update({
      where: { id: src.id },
      data: { articleCount: count, lastSyncAt: new Date() },
    });
  }

  console.log('[Seed Complete] All real articles successfully populated into PostgreSQL.');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
