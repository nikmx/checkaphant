import { Request, Response, NextFunction } from 'express';
import { assetVotes, AssetVote, validateAssetVote, validateAssetVoteAndOwnership, setAssetVote, unsetAssetVote } from '../models/assetVote';
import { NestedAssetVotes } from '../models/store';

const _flatten_asset_votes = (assetVotes: NestedAssetVotes) => {
  const flat : AssetVote[] = []
  for(const i in assetVotes) {
    for(const j in assetVotes[i]) {
      for(const k in assetVotes[i][j]) {
        flat.push(assetVotes[i][j][k])
      }
    }
  }
  return flat
}

// Create an vote
export const createAssetVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAssetVote: AssetVote = req.body.vote;
    validateAssetVote(newAssetVote);
    setAssetVote(newAssetVote);
    res.status(201).json({vote: newAssetVote});
  } catch (error) {
    next(error);
  }
};

// Read all assetVotes
export const getAssetVotes = (req: Request, res: Response, next: NextFunction) => {
  try {    
    res.json({votes: _flatten_asset_votes(assetVotes)});
  } catch (error) {
    next(error);
  }
};

// Read single vote
export const getAssetVotesByKeys = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sid = req.query.sid as string;
    const uri = req.query.uri as string;    
    const model = req.query.model as string;
    let votes: AssetVote[] = []
    if (uri && assetVotes[uri]) {
      if(model && assetVotes[uri][model]) {
        votes = Object.values(assetVotes[uri][model])
      } else {
        for (const i in assetVotes[uri]) {
          votes = votes.concat(Object.values(assetVotes[uri][i]))
        }
      }
    } else if (model) {
      for(const i in assetVotes) {
        if(assetVotes[i][model]) {
          votes = votes.concat(Object.values(assetVotes[i][model]))
        }
      }
    }

    if (votes.length === 0) {
      res.status(404).json({ message: 'No votes found' });
      return;
    }
    res.json({vote: votes});
  } catch (error) {
    next(error);
  }
};

// Update an vote
export const updateAssetVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const uri= req.body.vote.uri;
    const sid= req.body.vote.sid;
    const model= req.body.model;
    const vote = assetVotes[uri] && assetVotes[uri][model] && assetVotes[uri][model][sid];
    if (!vote) {
      res.status(404).json({ message: 'AssetVote not found' });
      return;
    }
    const newVote: AssetVote = req.body.vote
    validateAssetVoteAndOwnership(newVote, vote)
    setAssetVote(newVote)

    res.json({vote: newVote});
  } catch (error) {
    next(error);
  }
};

// Delete an vote
export const deleteAssetVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const uri= req.body.vote.uri;
    const sid= req.body.vote.sid;
    const model= req.body.vote.model;
    const vote= assetVotes[uri] && assetVotes[uri][model] && assetVotes[uri][model][sid];
    if (!vote) {
      res.status(404).json({ message: 'AssetVote not found' });
      return;
    }
    const newVote: AssetVote = req.body.vote
    validateAssetVoteAndOwnership(newVote, vote)
    unsetAssetVote(vote)
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};