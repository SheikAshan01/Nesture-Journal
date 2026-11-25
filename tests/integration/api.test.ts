import { describe, it, expect } from 'vitest';
import prisma from '@/lib/db';

describe('PostgreSQL Database & Real API Integration Tests', () => {
  it('connects to native PostgreSQL database and queries active categories', async () => {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
    });

    expect(categories.length).toBeGreaterThanOrEqual(8);
    const categorySlugs = categories.map((c) => c.slug);
    expect(categorySlugs).toContain('residential');
    expect(categorySlugs).toContain('commercial');
    expect(categorySlugs).toContain('international');
    expect(categorySlugs).toContain('finance');
    expect(categorySlugs).toContain('legal');
    expect(categorySlugs).toContain('realty-tech');
    expect(categorySlugs).toContain('development');
    expect(categorySlugs).toContain('general');
  });

  it('queries seeded published articles matching reference screenshot', async () => {
    const heroArticle = await prisma.article.findUnique({
      where: { slug: 'the-future-of-real-estate-clearly-told' },
      include: { category: true, author: true },
    });

    expect(heroArticle).not.toBeNull();
    expect(heroArticle?.title).toBe('The Future of Real Estate, Clearly Told');
    expect(heroArticle?.isFeatured).toBe(true);
    expect(heroArticle?.status).toBe('PUBLISHED');
  });

  it('validates Market Data records carry explicit DEMO DATA flag', async () => {
    const marketRecords = await prisma.marketData.findMany();
    expect(marketRecords.length).toBeGreaterThanOrEqual(5);

    for (const record of marketRecords) {
      expect(record.isDemo).toBe(true);
    }
  });

  it('verifies NewsletterSubscriber model creation and duplicate protection', async () => {
    const testEmail = `test_${Date.now()}@example.com`;
    const sub = await prisma.newsletterSubscriber.create({
      data: {
        email: testEmail,
        token: `token_${Date.now()}`,
        status: 'ACTIVE',
      },
    });

    expect(sub.email).toBe(testEmail);

    // Duplicate email check
    await expect(
      prisma.newsletterSubscriber.create({
        data: {
          email: testEmail,
          token: `token_dup_${Date.now()}`,
        },
      })
    ).rejects.toThrow();

    // Clean up
    await prisma.newsletterSubscriber.delete({ where: { id: sub.id } });
  });
});
