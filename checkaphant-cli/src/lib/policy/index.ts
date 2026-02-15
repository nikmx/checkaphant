export type PolicyAction = 'allow' | 'warn' | 'block' | 'human_approval'

export interface VoteLike {
  type: string;
  rate: number;
  sid: string;
}

export interface PolicySignal {
  type: string;
  sid: string;
  rate: number;
  impact: number;
}

export interface PolicyDecision {
  action: PolicyAction;
  score: number;
  reasons: string[];
  signals: PolicySignal[];
}

const clampRate = (rate: number) => Math.max(-10, Math.min(10, rate))

const getImpact = (voteType: string, rate: number, weightMap: Record<string, number>) => {
  const weight = weightMap[voteType] ?? 0
  return weight * clampRate(rate)
}

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0)

const evaluate = (
  votes: VoteLike[],
  weightMap: Record<string, number>,
  deriveAction: (score: number, votes: VoteLike[]) => { action: PolicyAction; reasons: string[] }
): PolicyDecision => {
  if (votes.length === 0) {
    return {
      action: 'human_approval',
      score: 0,
      reasons: ['no_votes_available'],
      signals: [],
    }
  }

  const signals = votes.map((vote) => ({
    type: vote.type,
    sid: vote.sid,
    rate: clampRate(vote.rate),
    impact: getImpact(vote.type, vote.rate, weightMap),
  }))

  const score = sum(signals.map((signal) => signal.impact))
  const {action, reasons} = deriveAction(score, votes)

  return {action, score, reasons, signals}
}

const assetWeights: Record<string, number> = {
  void: 0,
  intent: 1,
  process: 2,
  execute: 3,
  suspicious: -4,
  danger: -8,
}

const keyWeights: Record<string, number> = {
  void: 0,
  intent: 1,
  suspicious: -4,
  danger: -8,
}

export const evaluateAssetPolicy = (votes: VoteLike[]): PolicyDecision => {
  return evaluate(votes, assetWeights, (score, allVotes) => {
    const hasDanger = allVotes.some((vote) => vote.type === 'danger' && clampRate(vote.rate) > 0)
    const suspiciousCount = allVotes.filter((vote) => vote.type === 'suspicious' && clampRate(vote.rate) > 0).length
    const hasExecute = allVotes.some((vote) => vote.type === 'execute' && clampRate(vote.rate) > 0)

    if (hasDanger || suspiciousCount >= 2 || score <= -40) {
      return {action: 'block', reasons: ['severe_negative_signal']}
    }
    if (suspiciousCount === 1 || score < 0) {
      return {action: 'human_approval', reasons: ['manual_review_required']}
    }
    if (!hasExecute || score < 20) {
      return {action: 'warn', reasons: ['insufficient_positive_confidence']}
    }
    return {action: 'allow', reasons: ['sufficient_positive_confidence']}
  })
}

export const evaluateKeyPolicy = (votes: VoteLike[]): PolicyDecision => {
  return evaluate(votes, keyWeights, (score, allVotes) => {
    const hasDanger = allVotes.some((vote) => vote.type === 'danger' && clampRate(vote.rate) > 0)
    const hasSuspicious = allVotes.some((vote) => vote.type === 'suspicious' && clampRate(vote.rate) > 0)

    if (hasDanger || score <= -40) {
      return {action: 'block', reasons: ['key_marked_dangerous']}
    }
    if (hasSuspicious) {
      return {action: 'human_approval', reasons: ['key_marked_suspicious']}
    }
    if (score < 10) {
      return {action: 'warn', reasons: ['limited_key_confidence']}
    }
    return {action: 'allow', reasons: ['key_confidence_sufficient']}
  })
}
