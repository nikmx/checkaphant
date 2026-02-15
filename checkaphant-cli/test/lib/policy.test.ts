import {expect} from 'chai'
import {evaluateAssetPolicy, evaluateKeyPolicy, VoteLike} from '../../src/lib/policy'

describe('policy engine', () => {
  describe('evaluateAssetPolicy', () => {
    it('returns human_approval when there are no votes', () => {
      const res = evaluateAssetPolicy([])
      expect(res.action).to.equal('human_approval')
      expect(res.reasons).to.include('no_votes_available')
    })

    it('returns block for explicit danger votes', () => {
      const votes: VoteLike[] = [{sid: 'A', type: 'danger', rate: 8}]
      const res = evaluateAssetPolicy(votes)
      expect(res.action).to.equal('block')
      expect(res.reasons).to.include('severe_negative_signal')
    })

    it('returns allow for strong execute confidence', () => {
      const votes: VoteLike[] = [
        {sid: 'A', type: 'execute', rate: 8},
        {sid: 'B', type: 'execute', rate: 5},
        {sid: 'C', type: 'process', rate: 4},
      ]
      const res = evaluateAssetPolicy(votes)
      expect(res.action).to.equal('allow')
    })
  })

  describe('evaluateKeyPolicy', () => {
    it('returns block for dangerous keys', () => {
      const votes: VoteLike[] = [{sid: 'A', type: 'danger', rate: 10}]
      const res = evaluateKeyPolicy(votes)
      expect(res.action).to.equal('block')
      expect(res.reasons).to.include('key_marked_dangerous')
    })

    it('returns warn for low-confidence positive signal', () => {
      const votes: VoteLike[] = [{sid: 'A', type: 'intent', rate: 1}]
      const res = evaluateKeyPolicy(votes)
      expect(res.action).to.equal('warn')
      expect(res.reasons).to.include('limited_key_confidence')
    })
  })
})
