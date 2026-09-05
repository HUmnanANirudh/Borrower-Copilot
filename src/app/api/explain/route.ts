import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedNegotiationAdvice } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, assessment } = body;
    if (!profile || !assessment) {
      return NextResponse.json({ error: 'Missing profile or assessment data' }, { status: 400 });
    }

    const advice = await getEnhancedNegotiationAdvice(profile, assessment);
    return NextResponse.json(advice);
  } catch (error) {
    console.error('Explain API error', error);
    return NextResponse.json({ error: 'Failed to generate negotiation advice' }, { status: 500 });
  }
}
