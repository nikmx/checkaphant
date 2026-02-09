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

// Read filtered votes
export const getKeyVotesByKeys = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kid = req.query.kid as string;
    const sid = req.query.sid as string;
    let votes: KeyVote[] = []
    if (kid && keyVotes[kid]) {
      if(sid && keyVotes[kid][sid]) {
        votes = [keyVotes[kid][sid]]        
      } else {
        votes = Object.values(keyVotes[kid])
      }
    } else if (sid) {
      for(const i in keyVotes) {
        if(keyVotes[i][sid]) {
          votes.push(keyVotes[i][sid])
        }
      }
    }
    
    if (votes.length === 0) {
      res.status(404).json({ message: 'No votes found' });
      return;
    }
    res.json({votes: votes});
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
    const sid = req.body.vote.sid;
    const kid = req.body.vote.kid;
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