const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // 1. Roles & Permissions
  const permissionsList = [
    { name: 'article:create', description: 'Create draft and review articles' },
    { name: 'article:edit', description: 'Edit existing articles' },
    { name: 'article:publish', description: 'Publish or schedule articles' },
    { name: 'article:delete', description: 'Delete or archive articles' },
    { name: 'category:manage', description: 'Create and update categories and subcategories' },
    { name: 'media:manage', description: 'Upload and manage media assets' },
    { name: 'user:manage', description: 'Manage team users and roles' },
    { name: 'settings:manage', description: 'Manage site settings and SEO' },
    { name: 'analytics:view', description: 'View traffic and analytics reports' },
  ];

  for (const perm of permissionsList) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Super Administrator with full unrestricted control',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with content and website management access',
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'EDITOR' },
    update: {},
    create: {
      name: 'EDITOR',
      description: 'Senior Editor with publishing and review authority',
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: 'AUTHOR' },
    update: {},
    create: {
      name: 'AUTHOR',
      description: 'Contributing Author who drafts articles',
    },
  });

  // Attach all permissions to SUPER_ADMIN
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: p.id,
      },
    });
  }

  // 2. Users
  const passwordHash = await bcrypt.hash('AdminPassword@2026!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@nesturejournal.com' },
    update: { passwordHash },
    create: {
      name: 'Editorial Director',
      email: 'admin@nesturejournal.com',
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@nesturejournal.com' },
    update: { passwordHash },
    create: {
      name: 'Priya Sharma',
      email: 'editor@nesturejournal.com',
      passwordHash,
      roleId: editorRole.id,
    },
  });

  // 3. Authors
  const authorsData = [
    {
      name: 'Editorial Board',
      slug: 'editorial-board',
      roleTitle: 'Editorial Staff & Research Desk',
      bio: 'The institutional reporting and market research desk of Nesture Journal.',
      userId: superAdmin.id,
    },
    {
      name: 'Priya Sharma',
      slug: 'priya-sharma',
      roleTitle: 'Chief Markets Correspondent',
      bio: 'Specializing in commercial leasing, office spaces, and REITs across Asia-Pacific.',
      userId: editorUser.id,
    },
    {
      name: 'Aarav Mehta',
      slug: 'aarav-mehta',
      roleTitle: 'Senior Housing & Urban Policy Analyst',
      bio: 'Covering residential property micro-markets, tier-2 town planning and infrastructure.',
    },
    {
      name: 'Vikram Singhania',
      slug: 'vikram-singhania',
      roleTitle: 'Global Capital & PropTech Lead',
      bio: 'Focusing on cross-border real estate private equity and technological innovations.',
    },
    {
      name: 'Ananya Deshmukh',
      slug: 'ananya-deshmukh',
      roleTitle: 'Legal & Regulatory Counsel',
      bio: 'Expert in RERA compliance, title verification, and real estate litigation.',
    },
  ];

  const authorMap = {};
  for (const a of authorsData) {
    const author = await prisma.author.upsert({
      where: { slug: a.slug },
      update: { roleTitle: a.roleTitle, bio: a.bio },
      create: a,
    });
    authorMap[a.slug] = author;
  }

  // 4. Categories & Subcategories
  const categoriesData = [
    {
      name: 'Residential',
      slug: 'residential',
      color: '#008F5A',
      description: 'Homes, Projects & Trends',
      seoTitle: 'Residential Real Estate News & Market Trends | Nesture Journal',
      seoDescription: 'Explore the latest residential housing trends, pricing movements, and new launches across prime and tier-2 markets.',
      subcategories: ['Affordable Housing', 'Luxury Living', 'Rental Markets', 'Townships'],
    },
    {
      name: 'Commercial',
      slug: 'commercial',
      color: '#006B45',
      description: 'Offices, Retail & Spaces',
      seoTitle: 'Commercial Real Estate, Office Space & Retail Leasing | Nesture Journal',
      seoDescription: 'In-depth intelligence on commercial leasing, business parks, retail developments, and logistics hubs.',
      subcategories: ['Office Spaces', 'Retail Parks', 'Warehousing & Logistics', 'Co-working'],
    },
    {
      name: 'International',
      slug: 'international',
      color: '#0284C7',
      description: 'Global Markets & Insights',
      seoTitle: 'International Real Estate Markets & Cross-Border Investment | Nesture Journal',
      seoDescription: 'Global property markets coverage including UAE, UK, US, Singapore and European real estate trends.',
      subcategories: ['Dubai & Gulf', 'UK & Europe', 'US Realty', 'Cross-Border Capital'],
    },
    {
      name: 'Finance',
      slug: 'finance',
      color: '#059669',
      description: 'Funding, Rates & Investment',
      seoTitle: 'Real Estate Finance, REITs & Capital Markets | Nesture Journal',
      seoDescription: 'Financial intelligence on mortgage rates, REIT dividends, debt structures, and institutional financing.',
      subcategories: ['REITs', 'Home Loans & Rates', 'Private Equity', 'Distressed Assets'],
    },
    {
      name: 'Legal',
      slug: 'legal',
      color: '#D97706',
      description: 'Regulations & Compliance',
      seoTitle: 'Real Estate Law, RERA & Regulatory Updates | Nesture Journal',
      seoDescription: 'Essential guidance on property regulations, RERA adjudication, title due diligence, and tax laws.',
      subcategories: ['RERA Compliance', 'Land Titles', 'Taxation & GST', 'Dispute Resolution'],
    },
    {
      name: 'Realty Tech',
      slug: 'realty-tech',
      color: '#2563EB',
      description: 'PropTech, AI & Innovation',
      seoTitle: 'PropTech, Smart Cities & AI in Real Estate | Nesture Journal',
      seoDescription: 'How software, smart sensors, artificial intelligence and modern construction tech are upgrading real estate.',
      subcategories: ['Smart Cities', 'Construction Tech', 'Property Portals', 'Virtual Reality'],
    },
    {
      name: 'Development',
      slug: 'development',
      color: '#10B981',
      description: 'Projects, Infrastructure & Growth',
      seoTitle: 'Infrastructure Development & Mega Projects | Nesture Journal',
      seoDescription: 'Urban infrastructure expansion, expressways, metro extensions, and landmark civic redevelopment.',
      subcategories: ['Metro Corridors', 'Urban Redevelopment', 'Green Buildings', 'Expressways'],
    },
    {
      name: 'General',
      slug: 'general',
      color: '#4B5563',
      description: 'Industry News & Analysis',
      seoTitle: 'Real Estate Industry News & Editorial Analysis | Nesture Journal',
      seoDescription: 'Macro economic commentary, developer surveys, executive interviews, and industry-wide roundups.',
      subcategories: ['Macro Economy', 'Policy Briefs', 'Market Sentiment', 'Interviews'],
    },
  ];

  const categoryMap = {};
  const subcategoryMap = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        color: cat.color,
        description: cat.description,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        description: cat.description,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
      },
    });
    categoryMap[cat.slug] = category;

    for (const subName of cat.subcategories) {
      const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const sub = await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: subSlug,
          },
        },
        update: { name: subName },
        create: {
          name: subName,
          slug: subSlug,
          categoryId: category.id,
          description: `${subName} in ${cat.name}`,
        },
      });
      subcategoryMap[`${cat.slug}:${subSlug}`] = sub;
    }
  }

  // 5. Tags
  const tagList = [
    'Affordable Housing',
    'REITs',
    'Office Space',
    'Tier-2 Cities',
    'PropTech',
    'RERA',
    'Infrastructure',
    'Green Buildings',
    'Private Equity',
    'Leasing',
    'Urban Planning',
    'Smart Cities',
  ];

  const tagMap = {};
  for (const tagName of tagList) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name: tagName },
      create: { name: tagName, slug },
    });
    tagMap[slug] = tag;
  }

  // 6. Articles (Matching Reference Screenshot & Expanded Content)
  const articlesData = [
    {
      title: 'The Future of Real Estate, Clearly Told',
      slug: 'the-future-of-real-estate-clearly-told',
      categorySlug: 'development',
      subSlug: 'urban-redevelopment',
      authorSlug: 'editorial-board',
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
      isFeatured: true,
      isTrending: true,
      isBreaking: false,
      readingTime: 6,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-24T09:00:00Z'),
      tags: ['infrastructure', 'urban-planning', 'green-buildings'],
    },
    {
      title: 'Affordable Housing Gains Momentum Across Tier-2 Cities',
      slug: 'affordable-housing-gains-momentum-across-tier-2-cities',
      categorySlug: 'residential',
      subSlug: 'affordable-housing',
      authorSlug: 'aarav-mehta',
      shortDescription: 'Policy incentives, competitive land values, and rapid infrastructure expansion are spurring unprecedented residential growth in emerging hubs.',
      content: `Emerging urban corridors such as Indore, Coimbatore, Kochi, and Bhubaneswar have registered double-digit increases in residential unit absorption throughout 2026.

Developers are reporting strong sales velocities for mid-income and affordable housing units priced between ₹45 lakh and ₹80 lakh. With enhanced transport links and expanding IT hubs, suburban migration has transformed into a resilient demographic shift.

Analysts emphasize that municipal regulatory incentives and streamlined single-window clearances have substantially reduced holding costs for developers, keeping consumer end-prices competitive.`,
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Tier-2 city residential towers',
      isFeatured: true,
      isTrending: true,
      isBreaking: true,
      readingTime: 4,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-24T10:30:00Z'),
      tags: ['affordable-housing', 'tier-2-cities'],
    },
    {
      title: "Office Space Demand Remains Strong in India's Major Markets",
      slug: 'office-space-demand-remains-strong-in-indias-major-markets',
      categorySlug: 'commercial',
      subSlug: 'office-spaces',
      authorSlug: 'priya-sharma',
      shortDescription: 'Enterprise expansion, Global Capability Centres (GCCs), and sustained return-to-office momentum maintain record occupancy rates.',
      content: `India's premier office real estate markets — led by Bengaluru, Hyderabad, and Pune — have surpassed pre-pandemic annual net absorption benchmarks. 

Global Capability Centres continue to account for over 42% of total Grade-A commercial leasing. Multinationals are prioritizing campus-style facilities equipped with wellness amenities, collaborative breakout areas, and EV charging infrastructure.

Vacancy levels in core micro-markets remain tightly compressed under 7.5%, prompting institutional landlords to explore forward funding models and brownfield redevelopments.`,
      featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Glass corporate skyscraper facade',
      isFeatured: true,
      isTrending: true,
      isBreaking: false,
      readingTime: 5,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-24T11:00:00Z'),
      tags: ['office-space', 'leasing'],
    },
    {
      title: "Global Investors Eye India's Real Estate Growth Story",
      slug: 'global-investors-eye-indias-real-estate-growth-story',
      categorySlug: 'international',
      subSlug: 'cross-border-capital',
      authorSlug: 'vikram-singhania',
      shortDescription: 'Sovereign wealth funds and global private equity allocate over $8.5 billion to logistics, warehousing, and premium assets.',
      content: `Cross-border institutional capital deployed into Indian real estate reached multi-year peaks this quarter. Long-term institutional investors from North America, Europe, and the Middle East are expanding their footprint across logistics parks and student housing.

Confidence is buoyed by stable macroeconomic fundamentals, predictable currency hedging mechanisms, and enhanced statutory protections under RERA. 

Industry leaders project that institutionalization will accelerate REIT listings, offering international allocators liquid, yield-generating vehicles across commercial real estate portfolios.`,
      featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Luxury international property with swimming pool',
      isFeatured: true,
      isTrending: true,
      isBreaking: false,
      readingTime: 6,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-23T14:15:00Z'),
      tags: ['private-equity', 'investment'],
    },
    {
      title: 'Top Residential Hotspots in India to Watch in 2026',
      slug: 'top-residential-hotspots-in-india-to-watch-in-2026',
      categorySlug: 'residential',
      subSlug: 'townships',
      authorSlug: 'aarav-mehta',
      shortDescription: 'A look at the cities and micro-markets showing strong housing demand, price stability and long-term growth potential.',
      content: `Identifying sustainable micro-markets requires examining more than past capital appreciation. In this research spotlight, Nesture Journal ranks the top five emerging residential corridors based on infrastructure connectivity, job growth density, and rental yield stability.

Key highlights include North Bengaluru's aerospace corridor, Mumbai's trans-harbour link influence zone, and Hyderabad's northern life-sciences belt. Buyers and end-users are gravitating towards integrated townships that offer walk-to-work convenience and recreational amenities.`,
      featuredImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Row of modern residential buildings',
      isFeatured: false,
      isTrending: true,
      isBreaking: false,
      readingTime: 5,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-24T08:00:00Z'),
      tags: ['residential-market', 'tier-2-cities'],
    },
    {
      title: "India's Office Market Set for a Stronger 2026",
      slug: 'indias-office-market-set-for-a-stronger-2026',
      categorySlug: 'commercial',
      subSlug: 'office-spaces',
      authorSlug: 'priya-sharma',
      shortDescription: 'Leasing activity, new supply and enterprise expansion are shaping a positive outlook for commercial real estate.',
      content: `With over 58 million square feet of Grade-A office supply scheduled for delivery across top metropolitan centers, landlords and enterprise tenants are recalibrating leasing strategies.

Flexible workspace operators have expanded their share of commercial leasing to nearly 18%, providing corporations with scalable agility. Meanwhile, institutional developers are investing heavily in biophilic design, air quality monitoring, and LEED platinum standards to command premium rentals.`,
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Commercial office building exterior',
      isFeatured: false,
      isTrending: false,
      isBreaking: false,
      readingTime: 6,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-24T09:30:00Z'),
      tags: ['office-space', 'commercial-real-estate'],
    },
    {
      title: 'Real Estate Investment: Key Trends and Opportunities',
      slug: 'real-estate-investment-key-trends-and-opportunities',
      categorySlug: 'finance',
      subSlug: 'reits',
      authorSlug: 'vikram-singhania',
      shortDescription: "From REITs to alternative assets, here's what investors should watch in the coming quarters.",
      content: `Retail and high-net-worth investors now have access to institutional-grade real estate assets through fractional ownership platforms and Real Estate Investment Trusts (REITs).

Dividend yields across domestic REITs averaged 6.8% to 7.4% on an annualized basis, offering an attractive risk-adjusted hedge against inflation. This paper analyzes key risk metrics, loan-to-value covenants, and underlying asset quality for balanced retail portfolios.`,
      featuredImage: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Modern city transit and skyline',
      isFeatured: false,
      isTrending: true,
      isBreaking: false,
      readingTime: 7,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-23T11:00:00Z'),
      tags: ['reits', 'investment'],
    },
    {
      title: 'Key Real Estate Law Updates You Should Know',
      slug: 'key-real-estate-law-updates-you-should-know',
      categorySlug: 'legal',
      subSlug: 'rera-compliance',
      authorSlug: 'ananya-deshmukh',
      shortDescription: 'A roundup of recent regulations, compliance changes and their impact on buyers, developers and investors.',
      content: `The regulatory landscape governing Indian real estate continues to evolve toward greater transparency and judicial expediency.

Recent apex court rulings have reinforced strict escrow accountability for developers, mandating that customer advances cannot be diverted to secondary land parcels. Furthermore, digitized land registry trials across several states are reducing title dispute resolution timelines by more than 40%.`,
      featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Luxury residential villa architecture',
      isFeatured: false,
      isTrending: false,
      isBreaking: false,
      readingTime: 7,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-22T16:00:00Z'),
      tags: ['rera', 'legal'],
    },
    {
      title: 'PropTech and Artificial Intelligence in Building Maintenance',
      slug: 'proptech-and-ai-in-building-maintenance',
      categorySlug: 'realty-tech',
      subSlug: 'smart-cities',
      authorSlug: 'vikram-singhania',
      shortDescription: 'Predictive HVAC diagnostics, smart metering, and automated maintenance protocols are cutting operational overhead by 22%.',
      content: `Facility management is undergoing an automated revolution. By installing IoT sensors and algorithmic energy monitoring software, modern commercial office campuses are predicting mechanical failures before service interruptions occur.

Asset managers report marked reductions in peak electricity tariffs and water consumption, aligning bottom-line savings with international ESG commitments.`,
      featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Smart technology integrated building',
      isFeatured: false,
      isTrending: false,
      isBreaking: false,
      readingTime: 5,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-21T10:00:00Z'),
      tags: ['proptech', 'smart-cities'],
    },
    {
      title: 'Macroeconomic Drivers Shaping Property Valuations in 2026',
      slug: 'macroeconomic-drivers-shaping-property-valuations',
      categorySlug: 'general',
      subSlug: 'macro-economy',
      authorSlug: 'editorial-board',
      shortDescription: 'Central bank benchmark rate policies, urban wage growth, and demographic expansion continue to anchor property market resilience.',
      content: `Even amidst shifting global trade tides, the structural demand for quality living spaces and modernized commercial inventory remains firmly supported by domestic demographics.

This analytical briefing evaluates inflation-adjusted capital appreciation curves across the top seven Indian metropolitan districts.`,
      featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Business conference and economic analysis',
      isFeatured: false,
      isTrending: false,
      isBreaking: false,
      readingTime: 6,
      status: 'PUBLISHED',
      publicationDate: new Date('2026-11-20T12:00:00Z'),
      tags: ['macro-economy', 'investment'],
    },
  ];

  for (const art of articlesData) {
    const category = categoryMap[art.categorySlug];
    const subcategory = art.subSlug ? subcategoryMap[`${art.categorySlug}:${art.subSlug}`] : null;
    const author = authorMap[art.authorSlug] || authorMap['editorial-board'];

    const article = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        shortDescription: art.shortDescription,
        content: art.content,
        featuredImage: art.featuredImage,
        imageAlt: art.imageAlt,
        readingTime: art.readingTime,
        isFeatured: art.isFeatured,
        isTrending: art.isTrending,
        isBreaking: art.isBreaking,
        status: art.status,
        publicationDate: art.publicationDate,
        seoTitle: `${art.title} | Nesture Journal`,
        seoDescription: art.shortDescription,
      },
      create: {
        title: art.title,
        slug: art.slug,
        shortDescription: art.shortDescription,
        content: art.content,
        featuredImage: art.featuredImage,
        imageAlt: art.imageAlt,
        categoryId: category.id,
        subcategoryId: subcategory ? subcategory.id : null,
        authorId: author.id,
        readingTime: art.readingTime,
        isFeatured: art.isFeatured,
        isTrending: art.isTrending,
        isBreaking: art.isBreaking,
        status: art.status,
        publicationDate: art.publicationDate,
        seoTitle: `${art.title} | Nesture Journal`,
        seoDescription: art.shortDescription,
      },
    });

    // Attach tags
    for (const tagSlug of art.tags) {
      const tag = tagMap[tagSlug];
      if (tag) {
        await prisma.articleTag.upsert({
          where: {
            articleId_tagId: {
              articleId: article.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            articleId: article.id,
            tagId: tag.id,
          },
        });
      }
    }
  }

  // 7. Market Data (Realty Stocks & KPIs - Matching Screenshot)
  const marketRecords = [
    {
      symbol: 'DLF',
      name: 'DLF Limited',
      category: 'STOCK',
      currentValue: 812.40,
      previousValue: 798.30,
      change: 14.10,
      percentChange: 1.76,
      period: 'Daily',
      dataPoints: JSON.stringify([795, 802, 808, 805, 810, 812.40]),
      isDemo: true,
    },
    {
      symbol: 'GODREJPROP',
      name: 'Godrej Properties',
      category: 'STOCK',
      currentValue: 2834.20,
      previousValue: 2775.70,
      change: 58.50,
      percentChange: 2.11,
      period: 'Daily',
      dataPoints: JSON.stringify([2760, 2790, 2810, 2825, 2834.20]),
      isDemo: true,
    },
    {
      symbol: 'OBEROIRLTY',
      name: 'Oberoi Realty',
      category: 'STOCK',
      currentValue: 1691.30,
      previousValue: 1698.50,
      change: -7.20,
      percentChange: -0.42,
      period: 'Daily',
      dataPoints: JSON.stringify([1705, 1700, 1695, 1690, 1691.30]),
      isDemo: true,
    },
    {
      symbol: 'PRESTIGE',
      name: 'Prestige Estates',
      category: 'STOCK',
      currentValue: 1428.00,
      previousValue: 1408.40,
      change: 19.60,
      percentChange: 1.39,
      period: 'Daily',
      dataPoints: JSON.stringify([1395, 1410, 1415, 1422, 1428.00]),
      isDemo: true,
    },
    {
      symbol: 'MDBL',
      name: 'Macrotech Developers',
      category: 'STOCK',
      currentValue: 364.70,
      previousValue: 361.50,
      change: 3.20,
      percentChange: 0.88,
      period: 'Daily',
      dataPoints: JSON.stringify([358, 360, 362, 363.5, 364.70]),
      isDemo: true,
    },
    {
      symbol: 'INDEX',
      name: 'Realty Market Index (Illustrative)',
      category: 'INDEX',
      currentValue: 5892.40,
      previousValue: 5795.00,
      change: 97.40,
      percentChange: 1.68,
      period: 'Monthly',
      dataPoints: JSON.stringify([
        { month: 'Jun', value: 5280 },
        { month: 'Jul', value: 5350 },
        { month: 'Aug', value: 5490 },
        { month: 'Sep', value: 5620 },
        { month: 'Oct', value: 5760 },
        { month: 'Nov', value: 5892.40 },
      ]),
      isDemo: true,
    },
    {
      symbol: 'KPI_HOUSING',
      name: 'Housing Demand',
      category: 'KPI_HOUSING',
      currentValue: 8.4,
      change: 8.4,
      percentChange: 8.4,
      period: 'QoQ',
      isDemo: true,
    },
    {
      symbol: 'KPI_OFFICE',
      name: 'Office Leasing',
      category: 'KPI_OFFICE',
      currentValue: 6.9,
      change: 6.9,
      percentChange: 6.9,
      period: 'QoQ',
      isDemo: true,
    },
    {
      symbol: 'KPI_SUPPLY',
      name: 'New Supply',
      category: 'KPI_SUPPLY',
      currentValue: 5.1,
      change: 5.1,
      percentChange: 5.1,
      period: 'QoQ',
      isDemo: true,
    },
  ];

  for (const m of marketRecords) {
    await prisma.marketData.upsert({
      where: { symbol: m.symbol },
      update: m,
      create: m,
    });
  }

  // 8. Site Settings & SEO Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Nesture Journal',
      tagline: 'Real Estate News, Insights & Markets',
      contactEmail: 'editor@nesturejournal.com',
      contactPhone: '+91 (0) 11 4567 8900',
      contactAddress: 'Editorial Towers, Connaught Place, New Delhi 110001, India',
      breakingNewsEnabled: true,
      realtyStocksEnabled: true,
      footerText: 'Nesture Journal is a dedicated real estate news and insights platform, covering residential, commercial, investment, policy, technology and global market trends, with a focus on clear, credible and timely information.',
      socialLinks: JSON.stringify({
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        facebook: 'https://facebook.com',
      }),
    },
  });

  await prisma.sEOSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteTitle: 'Nesture Journal | Real Estate News, Insights & Market Intelligence',
      siteDescription: 'In-depth news, market trends, policy updates and expert insights from India and around the world — all in one place.',
      canonicalDomain: 'http://localhost:3000',
      robotsDirectives: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: http://localhost:3000/sitemap.xml`,
    },
  });

  // 9. Initial Analytics Events for realistic reporting
  const initialAnalytics = [
    { eventType: 'PAGE_VIEW', path: '/', referrer: 'direct' },
    { eventType: 'PAGE_VIEW', path: '/category/residential', referrer: '/' },
    { eventType: 'PAGE_VIEW', path: '/category/commercial', referrer: '/' },
    { eventType: 'PAGE_VIEW', path: '/market-intelligence', referrer: '/' },
    { eventType: 'SEARCH', path: '/search?q=affordable', referrer: '/' },
  ];
  for (const ev of initialAnalytics) {
    await prisma.analyticsEvent.create({ data: ev });
  }

  console.log('[Seed] Seeding completed successfully!');
  console.log('[Seed] Super Admin credentials: admin@nesturejournal.com / AdminPassword@2026!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
