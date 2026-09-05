import { NextRequest, NextResponse } from 'next/server';
import { getNegotiationAdvice } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, verdict } = body;
    if (!profile || !verdict) {
      return NextResponse.json({ error: 'Missing profile or verdict' }, { status: 400 });
    }

    const advice = await getNegotiationAdvice(profile, verdict);
    return NextResponse.json(advice);
  } catch (error) {
    console.error('Explain API error', error);
    return NextResponse.json({ error: 'Failed to generate advice' }, { status: 500 });
  }
}
