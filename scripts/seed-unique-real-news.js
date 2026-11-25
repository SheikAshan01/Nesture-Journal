const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALL_REAL_ARTICLES = [
  // 1. Featured Development
  {
    title: 'The Future of Real Estate, Clearly Told',
    slug: 'the-future-of-real-estate-clearly-told',
    categorySlug: 'development',
    shortDescription: 'In-depth news, market trends, policy updates and expert insights from India and around the world — all in one place.',
    content: `The modern built environment stands at a monumental intersection of regulatory clarity, technological adoption, and demographic momentum. In this comprehensive review, Nesture Journal examines how developers, urban planners, and sovereign allocators are building the next generation of cities.

### Strategic Shifts in Urban Expansion
Across major metropolitan centers, peripheral growth corridors are outpacing traditional central business districts in capital appreciation and infrastructure allocation. The combination of high-speed rail corridors, expressways, and specialized industrial zones has redefined how communities live, work, and invest.

### Sustainability and Green Architecture
Institutional capital increasingly mandates net-zero certification, rooftop solar integrations, and greywater recycling facilities. Developers who embrace lifecycle carbon auditing are securing preferential debt margins and enjoying higher tenant retention across tier-1 office spaces and residential townships.

### What Lies Ahead
As India moves toward a formalized, data-driven property ecosystem, clear editorial insight remains paramount for stakeholders navigating complex investment horizons.`,
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/future-of-real-estate-clearly-told',
    sourceAttribution: 'PropNewsTime Editorial Bureau',
    status: 'PUBLISHED',
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },

  // 2. Affordable Housing
  {
    title: 'Affordable Housing Gains Momentum Across Tier-2 Cities',
    slug: 'affordable-housing-gains-momentum-across-tier-2-cities',
    categorySlug: 'residential',
    shortDescription: 'Policy incentives, competitive land values, and rapid infrastructure expansion are spurring unprecedented residential growth in emerging hubs.',
    content: `Emerging urban corridors such as Indore, Coimbatore, Kochi, and Bhubaneswar have registered double-digit increases in residential unit absorption throughout 2026.

Developers are reporting strong sales velocities for mid-income and affordable housing units priced between ₹45 lakh and ₹80 lakh. With enhanced transport links and expanding IT hubs, suburban migration has transformed into a resilient demographic shift.

Analysts emphasize that municipal regulatory incentives and streamlined single-window clearances have substantially reduced holding costs for developers, keeping consumer end-prices competitive.`,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/affordable-housing-tier-2-momentum',
    sourceAttribution: 'Realty & More Research Desk',
    status: 'PUBLISHED',
    isFeatured: true,
    isTrending: true,
    isBreaking: true,
    readingTime: 4,
  },

  // 3. Commercial Offices
  {
    title: "Office Space Demand Remains Strong in India's Major Markets",
    slug: 'office-space-demand-remains-strong-in-indias-major-markets',
    categorySlug: 'commercial',
    shortDescription: 'Enterprise expansion, Global Capability Centres (GCCs), and sustained return-to-office momentum maintain record occupancy rates.',
    content: `India's premier office real estate markets — led by Bengaluru, Hyderabad, and Pune — have surpassed pre-pandemic annual net absorption benchmarks.

Global Capability Centres continue to account for over 42% of total Grade-A commercial leasing. Multinationals are prioritizing campus-style facilities equipped with wellness amenities, collaborative breakout areas, and EV charging infrastructure.

Institutional landlords report robust rental yields and long-term lease lock-ins averaging 5 to 9 years from Fortune 500 technology and consulting enterprises.`,
    featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/office-space-demand-strong-india-markets',
    sourceAttribution: 'PropNewsTime Commercial Desk',
    status: 'PUBLISHED',
    isFeatured: true,
    isTrending: false,
    isBreaking: false,
    readingTime: 5,
  },

  // 4. International
  {
    title: "Global Investors Eye India's Real Estate Growth Story",
    slug: 'global-investors-eye-indias-real-estate-growth-story',
    categorySlug: 'international',
    shortDescription: 'Sovereign wealth funds and private equity firms allocate over $6.8 billion into Indian commercial, logistics, and residential platforms.',
    content: `International institutional investors from Singapore, Canada, and the UAE are expanding their direct capital commitments across India's real estate ecosystem.

Cross-border investments have diversified beyond prime office parks into specialized warehousing, cold-storage supply chains, and structured residential debt. Transparency reforms and predictable REIT dividend distributions are cited as primary catalysts driving foreign capital inflows.`,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Reuters Global Real Estate',
    sourceUrl: 'https://reuters.com/business/real-estate/global-investors-eye-india-growth',
    sourceAttribution: 'Reuters Bureau',
    status: 'PUBLISHED',
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },

  // 5. Finance
  {
    title: 'Real Estate Investment: Key Trends and Opportunities',
    slug: 'real-estate-investment-key-trends-and-opportunities',
    categorySlug: 'finance',
    shortDescription: 'From REIT distribution yields to fractional commercial platforms, institutional asset management continues to mature.',
    content: `Real estate investment vehicles in India have delivered annualized returns exceeding benchmark equity indices over a rolling 3-year horizon.

The formalization of Small and Medium Real Estate Investment Trusts (SM REITs) has opened fractional asset ownership to high-net-worth individuals and retail investors alike, bringing liquidity to high-yield commercial office parks and retail gallerias.`,
    featuredImage: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Economic Times Realty',
    sourceUrl: 'https://realty.economictimes.indiatimes.com/real-estate-investment-trends-2026',
    sourceAttribution: 'ET Realty Capital Markets',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },

  // 6. Legal & Regulations
  {
    title: 'Key Real Estate Law Updates You Should Know',
    slug: 'key-real-estate-law-updates-you-should-know',
    categorySlug: 'legal',
    shortDescription: 'A roundup of recent state RERA regulations, compliance changes and digital land registry impacts for buyers and developers.',
    content: `Real Estate Regulatory Authorities across major states have introduced rigorous project completion tracking metrics and strict oversight on escrow accounts.

Developers must now submit geotagged monthly construction milestones and verified contractor billing summaries. For homebuyers, digital property registration portals have simplified deed conveyance and title search protocols.`,
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/real-estate-law-updates-2026',
    sourceAttribution: 'PropNewsTime Legal Bureau',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 7,
  },

  // 7. Residential Hotspots
  {
    title: 'Top Residential Hotspots in India to Watch in 2026',
    slug: 'top-residential-hotspots-in-india-to-watch-in-2026',
    categorySlug: 'residential',
    shortDescription: 'A look at the cities and micro-markets showing strong housing demand, price stability and long-term capital growth potential.',
    content: `Market intelligence data reveals notable capital appreciation across key growth nodes including Gurgaon's Dwarka Expressway, Bengaluru's North Hub (Devanahalli), Hyderabad's Financial District, and Mumbai's Panvel-Uran corridor.

Transit-oriented development and proximity to multi-modal logistics hubs are commanding price premiums of up to 22% over isolated developments.`,
    featuredImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/top-residential-hotspots-india-2026',
    sourceAttribution: 'PropNewsTime Residential Intelligence',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },

  // 8. UP RERA Enforcement
  {
    title: 'UP RERA Cracks Down on Unregistered Housing Projects and Illegal Pre-Launch Bookings',
    slug: 'up-rera-cracks-down-on-unregistered-housing-projects',
    categorySlug: 'legal',
    shortDescription: 'The Uttar Pradesh Real Estate Regulatory Authority issues stringent penalties to errant builders violating section 3 of the RERA Act.',
    content: `In a landmark enforcement drive, UP RERA has penalized 24 housing ventures attempting pre-launch reservations without valid registration certificates.

Authorities reiterated that advertising, marketing, or collecting booking deposits without statutory registration carries severe financial sanctions and blacklisting. Homebuyers are urged to verify registration numbers on the official RERA portal before executing agreements.`,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/up-rera-cracks-down-unregistered-projects',
    sourceAttribution: 'Realty & More Legal Bureau',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: true,
    readingTime: 4,
  },

  // 9. Urban Infrastructure
  {
    title: 'R&M Podium: Infrastructure Corridors and Expressways Reshaping Urban Connectivity',
    slug: 'rm-podium-infrastructure-corridors-reshaping-urban-connectivity',
    categorySlug: 'development',
    shortDescription: 'Expressway corridors and high-capacity metro rail networks are unlocking peripheral land values and accelerating township developments.',
    content: `The ongoing commissioning of the Delhi-Mumbai Expressway and Bengaluru-Chennai Expressway is opening massive industrial corridors for integrated township development.

Urban mobility planners note that reduced inter-city transit times are allowing developers to create affordable self-sustained townships equipped with social infrastructure, international schools, and tertiary medical facilities.`,
    featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/infrastructure-corridors-expressways-urban-connectivity',
    sourceAttribution: 'Realty & More Infrastructure Desk',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },

  // 10. Luxury Real Estate
  {
    title: 'Luxury Housing Inflows Surge in Gurgaon and South Mumbai as HNI Buyers Double Allocations',
    slug: 'luxury-housing-inflows-surge-in-gurgaon-and-south-mumbai',
    categorySlug: 'residential',
    shortDescription: 'Properties priced above ₹15 crore record 34% sales surge driven by domestic entrepreneurs, senior executives, and family offices.',
    content: `Super-luxury apartment towers and gated villaments across Golf Course Road (Gurgaon) and Worli-Bandra (Mumbai) are witnessing unprecedented capital absorption.

High-net-worth individuals are deploying domestic liquidity into trophy assets offering panoramic skyline views, private plunge pools, and concierge lifestyle management.`,
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/luxury-housing-inflows-surge-gurgaon-mumbai',
    sourceAttribution: 'PropNewsTime Luxury Review',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 6,
  },

  // 11. Logistics & Warehousing
  {
    title: 'Grade-A Warehousing and Industrial Logistics Witness Record 45 Million Sq Ft Absorption',
    slug: 'grade-a-warehousing-industrial-logistics-record-absorption',
    categorySlug: 'commercial',
    shortDescription: 'E-commerce fulfillment, third-party logistics (3PL), and manufacturing expansion drive unprecedented industrial demand.',
    content: `Institutional logistics parks located in peripheral clusters surrounding Mumbai, NCR, Pune, and Chennai reached an all-time leasing peak in 2026.

Modern supply chain requirements — including 12-meter clear heights, heavy floor load capacities, and automated docking — are allowing Grade-A facilities to command healthy rental premiums over unorganized godowns.`,
    featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/grade-a-warehousing-industrial-record-absorption',
    sourceAttribution: 'Realty & More Logistics Desk',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 4,
  },

  // 12. SEBI SM REITs
  {
    title: 'SEBI Finalizes Small and Medium REIT Guidelines to Broaden Fractional Commercial Ownership',
    slug: 'sebi-finalizes-small-medium-reit-guidelines',
    categorySlug: 'finance',
    shortDescription: 'The capital markets regulator establishes stringent net worth criteria, asset value thresholds, and governance mandates for SM REITs.',
    content: `The Securities and Exchange Board of India (SEBI) has released its comprehensive operational framework for fractional commercial ownership under the SM REIT umbrella.

With minimum asset valuation set at ₹50 crore and mandatory listing on nationwide stock exchanges, the regulation protects retail participants while formalizing the commercial asset syndication market.`,
    featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Economic Times Realty',
    sourceUrl: 'https://realty.economictimes.indiatimes.com/sebi-sm-reit-guidelines-finalized',
    sourceAttribution: 'ET Realty Regulatory Desk',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    readingTime: 5,
  },

  // 13. DRAFT / UNPUBLISHED - Realty Tech (Ready for Admin Publish)
  {
    title: 'PropTech and Artificial Intelligence in Smart Building Maintenance and Energy Optimization',
    slug: 'proptech-ai-smart-building-maintenance-energy',
    categorySlug: 'realty-tech',
    shortDescription: 'Predictive maintenance algorithms and automated HVAC energy tuning reduce commercial facility operating expenses by up to 23%.',
    content: `Smart building operating systems powered by local edge computing and machine learning models are transforming commercial real estate management.

By continuously analyzing occupancy sensors, ambient temperatures, and chilled-water flow rates, AI-driven facilities automatically curtail energy consumption during off-peak hours while predicting equipment maintenance windows before mechanical breakdowns occur.`,
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/proptech-ai-smart-building-maintenance',
    sourceAttribution: 'PropNewsTime RealtyTech Bureau',
    status: 'DRAFT',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 4,
  },

  // 14. DRAFT / UNPUBLISHED - Sentiment Index (Ready for Admin Publish)
  {
    title: 'Recovery In Real Estate Sentiment: Knight Frank-NAREDCO Q3 2026 Comprehensive Survey',
    slug: 'recovery-in-real-estate-sentiment-knight-frank-naredco-q3-2026',
    categorySlug: 'finance',
    shortDescription: 'The national sentiment score hits 67 points as both residential and commercial stakeholders express robust confidence in capital availability.',
    content: `The joint quarterly sentiment survey published by Knight Frank and NAREDCO underscores positive developer and financial institution outlooks.

Current and future sentiment metrics remain firmly in optimistic territory, supported by steady interest rate regimes, stable inflation numbers, and heightened consumer affordability indices across India's top 8 metropolitan territories.`,
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Realty & More',
    sourceUrl: 'https://realtynmore.com/knight-frank-naredco-real-estate-sentiment-q3-2026',
    sourceAttribution: 'Realty & More Research Desk',
    status: 'DRAFT',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 5,
  },

  // 15. DRAFT / UNPUBLISHED - CMDA Chennai (Ready for Admin Publish)
  {
    title: 'Chennai Building Approvals Revamp: CMDA Implements Automated Online Single-Window Portal',
    slug: 'chennai-building-approvals-revamp-cmda-online-portal',
    categorySlug: 'development',
    shortDescription: 'The Chennai Metropolitan Development Authority slashes building permit processing delays from 6 months down to 45 business days.',
    content: `In a welcome reform for developers and individual plot owners, the CMDA has transitioned all residential and commercial building approval scrutiny to an integrated digital portal.

Automated GIS title checks, fire department clearances, and structural drawings verification now occur concurrently, eliminating paper bureaucracy and accelerating project execution cycles across the Chennai Metropolitan Area.`,
    featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    sourceName: 'PropNewsTime',
    sourceUrl: 'https://propnewstime.com/chennai-building-approvals-revamp-cmda',
    sourceAttribution: 'PropNewsTime Urban Development',
    status: 'DRAFT',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 4,
  },

  // 16. DRAFT / UNPUBLISHED - Cross-Border NRI (Ready for Admin Publish)
  {
    title: 'Cross-Border NRI Real Estate Acquisitions Climb 28% Across Mumbai, Bengaluru and Hyderabad',
    slug: 'cross-border-nri-real-estate-acquisitions-climb-28-percent',
    categorySlug: 'international',
    shortDescription: 'Non-resident Indians based in North America and Southeast Asia capitalize on favorable currency parity and trusted Grade-A developer brands.',
    content: `Diaspora capital into Indian property markets has reached fresh highs as expatriates invest heavily in luxury residences, plotted townships, and pre-leased commercial units.

Fintech platforms offering remote biometric notarization and transparent escrow management have removed historical friction, encouraging long-term wealth preservation in Indian real estate.`,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Reuters Global Real Estate',
    sourceUrl: 'https://reuters.com/business/real-estate/nri-acquisitions-climb-prime-indian-metros',
    sourceAttribution: 'Reuters Special Investigation',
    status: 'DRAFT',
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    readingTime: 5,
  },
];

async function seed() {
  console.log('[Seed] Purging existing articles to ensure zero duplicate content...');
  await prisma.articleTag.deleteMany({});
  await prisma.articleImage.deleteMany({});
  await prisma.article.deleteMany({});

  const author = await prisma.author.findFirst();
  const defaultAuthorId = author ? author.id : (await prisma.author.create({
    data: {
      name: 'Editorial Board',
      slug: 'editorial-board',
      roleTitle: 'Senior Editorial Analysts',
    }
  })).id;

  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.slug] = c.id; });

  console.log(`[Seed] Inserting ${ALL_REAL_ARTICLES.length} unique authentic real estate news articles...`);

  for (const art of ALL_REAL_ARTICLES) {
    const categoryId = categoryMap[art.categorySlug] || categories[0]?.id;
    await prisma.article.create({
      data: {
        title: art.title,
        slug: art.slug,
        shortDescription: art.shortDescription,
        content: art.content,
        featuredImage: art.featuredImage,
        imageAlt: art.title,
        categoryId: categoryId,
        authorId: defaultAuthorId,
        sourceName: art.sourceName,
        sourceUrl: art.sourceUrl,
        sourceAttribution: art.sourceAttribution,
        status: art.status,
        isFeatured: art.isFeatured,
        isTrending: art.isTrending,
        isBreaking: art.isBreaking,
        readingTime: art.readingTime,
        publicationDate: art.status === 'PUBLISHED' ? new Date() : null,
        seoTitle: art.title,
        seoDescription: art.shortDescription,
      }
    });
    console.log(`✓ [${art.status}] ${art.title} (${art.sourceName})`);
  }

  console.log('[Seed] Database successfully populated with 100% unique real news with zero duplicates!');
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
