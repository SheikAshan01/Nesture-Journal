import { describe, it, expect } from 'vitest';
import {
  extractKeywords,
  recommendCategory,
  suggestTags,
  calculateTextSimilarity,
  isDuplicateTitle,
  calculateReadingTime,
  auditArticleQuality,
} from '@/lib/content-engine/rule-engine';

describe('Internal Content Engine (Rule-based, Zero External AI)', () => {
  it('correctly extracts prominent keywords while ignoring stop words', () => {
    const text = 'The commercial office leasing market in Bengaluru has seen strong demand from enterprise technology firms.';
    const keywords = extractKeywords(text, 5);
    expect(keywords).toContain('commercial');
    expect(keywords).toContain('office');
    expect(keywords).not.toContain('the');
    expect(keywords).not.toContain('from');
  });

  it('accurately recommends Residential category for housing content', () => {
    const title = 'Affordable housing and apartment complexes gain momentum';
    const content = 'New residential townships and home buying trends across suburbs.';
    const res = recommendCategory(title, content);
    expect(res.recommendedCategorySlug).toBe('residential');
    expect(res.score).toBeGreaterThan(0);
  });

  it('accurately recommends Commercial category for office and leasing content', () => {
    const title = 'Grade-A office building leasing reaches milestone';
    const content = 'Corporate campus retail spaces and business park occupancy.';
    const res = recommendCategory(title, content);
    expect(res.recommendedCategorySlug).toBe('commercial');
  });

  it('suggests relevant tags based on content analysis', () => {
    const title = 'Green Buildings and REITs in Commercial Real Estate';
    const content = 'Examining office space and RERA compliance.';
    const tags = suggestTags(title, content);
    expect(tags).toContain('REITs');
    expect(tags).toContain('Green Buildings');
    expect(tags).toContain('RERA');
  });

  it('detects duplicate or near-duplicate titles accurately', () => {
    const existing = [
      'Top Residential Hotspots in India to Watch in 2026',
      'Key Real Estate Law Updates You Should Know',
    ];

    const exactMatch = isDuplicateTitle(
      'Top Residential Hotspots in India to Watch in 2026',
      existing
    );
    expect(exactMatch.isDuplicate).toBe(true);
    expect(exactMatch.similarity).toBe(1.0);

    const nearMatch = isDuplicateTitle(
      'Top Residential Hotspots in India to Watch for 2026',
      existing,
      0.8
    );
    expect(nearMatch.isDuplicate).toBe(true);

    const unique = isDuplicateTitle(
      'Completely New Unrelated Topic About Architecture',
      existing
    );
    expect(unique.isDuplicate).toBe(false);
  });

  it('calculates realistic reading times', () => {
    const shortText = 'One two three four five';
    expect(calculateReadingTime(shortText)).toBe(1);

    const words450 = new Array(450).fill('word').join(' ');
    expect(calculateReadingTime(words450)).toBe(3);
  });

  it('computes SEO and quality score with actionable warnings', () => {
    const report = auditArticleQuality({
      title: 'Valid Length Article Title For Publication Testing',
      shortDescription: 'This is a solid summary length meeting the 60-200 characters guideline for news snippets.',
      content: new Array(350).fill('informative content analysis').join(' '),
      featuredImage: '/uploads/skyline.webp',
      imageAlt: 'High rise buildings against sky',
      seoTitle: 'Valid Length Article Title',
      seoDescription: 'This is a solid summary length meeting guidelines.',
    });

    expect(report.score).toBe(100);
    expect(report.warnings.length).toBe(0);
    expect(report.wordCount).toBeGreaterThanOrEqual(300);
  });
});
