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
export const getAssetVoteByKeys = (req: Request, res: Response, next: NextFunction) => {
  try {
    const uri = req.params.uri as string;
    const sid = req.params.sid as string;
    const model = req.params.model as string;
    const vote = assetVotes[uri] && assetVotes[uri][model] && assetVotes[uri][model][sid];
    if (!vote) {
      res.status(404).json({ message: 'AssetVote not found' });
      return;
    }
    res.json({vote: vote});
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