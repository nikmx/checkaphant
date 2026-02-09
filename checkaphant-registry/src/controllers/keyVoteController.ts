import { Request, Response, NextFunction } from 'express';
import { keyVotes, KeyVote, validateKeyVote, validateKeyVoteAndOwnership, setKeyVote, unsetKeyVote } from '../models/keyVote';
import { NestedKeyVotes } from '../models/store';

const _flatten_key_votes = (assetVotes: NestedKeyVotes) => {
  const flat : KeyVote[] = []
  for(const i in assetVotes) {
    for(const j in assetVotes[i]) {
      flat.push(assetVotes[i][j])
    }
  }
  return flat
}

// Create a vote
export const createKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newKeyVote: KeyVote = req.body.vote;
    validateKeyVote(newKeyVote);
    setKeyVote(newKeyVote);
    res.status(201).json({vote: newKeyVote});
  } catch (error) {
    next(error);
  }
};

// Read all keyVotes
export const getKeyVotes = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({votes: _flatten_key_votes(keyVotes)});
  } catch (error) {
    next(error);
  }
};

// Read single vote
export const getKeyVoteByKeys = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kid = req.params.kid as string;
    const sid = req.params.sid as string;
    const vote = keyVotes[kid] && keyVotes[kid][sid];
    if (!vote) {
      res.status(404).json({ message: 'KeyVote not found' });
      return;
    }
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};

// Update a vote
export const updateKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kid = req.body.vote.kid;
    const sid = req.body.vote.sid;
    const vote = keyVotes[kid] && keyVotes[kid][sid];
    if (!vote) {
      res.status(404).json({ message: 'KeyVote not found' });
      return;
    }
    const newVote: KeyVote = req.body.vote
    validateKeyVoteAndOwnership(newVote, vote);
    setKeyVote(newVote);
    res.json({vote: newVote});
  } catch (error) {
    next(error);
  }
};

// Delete a vote
export const deleteKeyVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kid = req.body.vote.kid;
    const sid = req.body.vote.sid;
    const vote = keyVotes[kid] && keyVotes[kid][sid];    
    if (!vote) {
      res.status(404).json({ message: 'KeyVote not found' });
      return;
    }
    const newVote: KeyVote = req.body.vote
    validateKeyVoteAndOwnership(newVote, vote);
    unsetKeyVote(vote)
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};