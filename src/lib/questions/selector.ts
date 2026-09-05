import { BorrowerProfile } from '@/lib/types';
import { RegisteredQuestion, QUESTION_REGISTRY } from './registry';
import { getEligibleAdaptiveQuestions, rankCandidatesHeuristically } from './eligibility';

export interface NextQuestionResult {
  question: RegisteredQuestion | null;
  shouldStop: boolean;
  reason: string;
  source: 'ai_groq' | 'heuristic_fallback' | 'deterministic';
}

/**
 * Determines the next best question to ask.
 * Sends the current state to the AI Selector API.
 * Gracefully falls back to local deterministic ranking if the API fails or is offline.
 */
export async function determineNextQuestion(
  profile: Partial<BorrowerProfile>,
  answeredIds: string[]
): Promise<NextQuestionResult> {
  const candidates = getEligibleAdaptiveQuestions(profile, answeredIds);

  if (candidates.length === 0) {
    return {
      question: null,
      shouldStop: true,
      reason: 'All applicable risk variables have been resolved.',
      source: 'deterministic',
    };
  }

  try {
    const res = await fetch('/api/select-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, answeredIds }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.shouldStop) {
        return {
          question: null,
          shouldStop: true,
          reason: data.reason || 'Sufficient information gathered.',
          source: data.mode || 'ai_groq',
        };
      }

      if (data.questionId && QUESTION_REGISTRY[data.questionId]) {
        return {
          question: QUESTION_REGISTRY[data.questionId],
          shouldStop: false,
          reason: data.reason,
          source: data.mode || 'ai_groq',
        };
      }
    }
  } catch (err) {
    console.warn('AI selector fetch failed, using local heuristic:', err);
  }

  // Local fallback
  const fallback = rankCandidatesHeuristically(candidates, profile);
  return {
    question: fallback.selected,
    shouldStop: !fallback.selected,
    reason: fallback.reason,
    source: 'heuristic_fallback',
  };
}
