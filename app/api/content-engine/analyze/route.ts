import { NextRequest, NextResponse } from 'next/server';
import {
  extractKeywords,
  recommendCategory,
  suggestTags,
  auditArticleQuality,
  isDuplicateTitle,
} from '@/lib/content-engine/rule-engine';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', shortDescription = '', content = '', featuredImage, imageAlt } = body;

    const keywords = extractKeywords(`${title} ${content}`, 8);
    const categoryRec = recommendCategory(title, content);
    const suggestedTags = suggestTags(title, content);
    const qualityAudit = auditArticleQuality({
      title,
      shortDescription,
      content,
      featuredImage,
      imageAlt,
    });

    const existingArticles = await prisma.article.findMany({
      select: { title: true },
      take: 100,
    });
    const dupCheck = isDuplicateTitle(title, existingArticles.map((a) => a.title));

    return NextResponse.json({
      success: true,
      analysis: {
        keywords,
        categoryRecommendation: categoryRec,
        suggestedTags,
        qualityAudit,
        duplicateWarning: dupCheck.isDuplicate ? dupCheck : null,
      },
    });
  } catch (error: any) {
    console.error('Content analysis error:', error);
    return NextResponse.json({ error: 'Content analysis failed' }, { status: 500 });
  }
}
