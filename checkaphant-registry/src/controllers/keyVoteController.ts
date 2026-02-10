import { Request, Response, NextFunction } from 'express';
import { keyVotes, KeyVote, validateKeyVote, validateKeyVoteAndOwnership, setKeyVote, unsetKeyVote } from '../models/keyVote';
import { NestedDigitalIdentities, NestedKeyVotes } from '../models/store';
import { dIds, DigitalIdentity } from '../models/digitalIdentity';

const _flatten_key_votes = (keyVotes: NestedKeyVotes, dIds: NestedDigitalIdentities, kid: string|undefined = undefined) => {
  const flat : KeyVote[] = []
  const flatIds : DigitalIdentity[] = []

  const kidx = (kid && [kid]) || Object.keys(keyVotes)
  let iidx: {[key: string]: boolean} = {}

  for(const i in kidx) {
    for(const j in keyVotes[i]) {
      if(!iidx[j]) {
        flatIds.push(dIds[j])
        iidx[j] = true
      }
      flat.push(keyVotes[i][j])
    }
  }

  return {votes: flat, ids: flatIds}
}

// Create a vote
export const createKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newKeyVote: KeyVote = req.body.vote;
    const dId: DigitalIdentity = req.body.id;
    validateKeyVote(newKeyVote, dId);
    setKeyVote(newKeyVote);
    res.status(201).json({vote: newKeyVote});
  } catch (error) {
    next(error);
  }
};

// Read all keyVotes
export const getKeyVotes = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({votes: _flatten_key_votes(keyVotes, dIds)});
  } catch (error) {
    next(error);
  }
};

// Read filtered votes
export const getKeyVotesByKeys = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kid = req.query.kid as string;
    const ret = _flatten_key_votes(keyVotes, dIds, kid)
    if (ret.votes.length === 0) {
      res.status(404).json({ message: 'No votes found' });
      return;
    }
    res.json(ret);
  } catch (error) {
    next(error);
  }
};

// Update a vote
export const updateKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sid = req.body.vote.sid;
    const kid = req.body.vote.kid;
    const vote = keyVotes[kid] && keyVotes[kid][sid];
    if (!vote) {
      res.status(404).json({ message: 'KeyVote not found' });
      return;
    }
    const newVote: KeyVote = req.body.vote
    const dId: DigitalIdentity = req.body.id;
    validateKeyVoteAndOwnership(newVote, dId, vote);
    setKeyVote(newVote);
    res.json({vote: newVote});
  } catch (error) {
    next(error);
  }
};

// Delete a vote
export const deleteKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sid = req.body.vote.sid;
    const kid = req.body.vote.kid;
    const vote = keyVotes[kid] && keyVotes[kid][sid];    
    if (!vote) {
      res.status(404).json({ message: 'KeyVote not found' });
      return;
    }
    const newVote: KeyVote = req.body.vote
    const dId: DigitalIdentity = req.body.id;
    validateKeyVoteAndOwnership(newVote, dId, vote);
    unsetKeyVote(vote)
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};