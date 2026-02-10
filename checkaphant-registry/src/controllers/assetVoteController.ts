import { Request, Response, NextFunction } from 'express';
import { assetVotes, AssetVote, validateAssetVote, validateAssetVoteAndOwnership, setAssetVote, unsetAssetVote } from '../models/assetVote';
import { NestedAssetVotes, NestedDigitalIdentities } from '../models/store';
import { dIds, DigitalIdentity, setDigitalIdentity } from '../models/digitalIdentity';

const _flatten_asset_votes = (assetVotes: NestedAssetVotes, dIds: NestedDigitalIdentities, uri: string|undefined = undefined, model: string|undefined = undefined) => {
  const flat : AssetVote[] = []
  const flatIds : DigitalIdentity[] = []

  const uidx = (uri && [uri]) || Object.keys(assetVotes)
  let iidx: {[key: string]: boolean} = {}

  for(const i in uidx) {
    const midx = (model && [model]) || Object.keys(assetVotes[i])
    for(const j in midx) {
      for(const k in assetVotes[i][j]) {
        if(!iidx[k]) {
          flatIds.push(dIds[k])
          iidx[k] = true
        }
        flat.push(assetVotes[i][j][k])
      }
    }
  }

  return {votes: flat, ids: flatIds}
}

// Create an vote
export const createAssetVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAssetVote: AssetVote = req.body.vote;
    const dId: DigitalIdentity = req.body.id;
    validateAssetVote(newAssetVote, dId);
    setAssetVote(newAssetVote);
    setDigitalIdentity(dId);
    res.status(201).json({vote: newAssetVote});
  } catch (error) {
    next(error);
  }
};

// Read all assetVotes
export const getAssetVotes = (req: Request, res: Response, next: NextFunction) => {
  try {    
    res.json(_flatten_asset_votes(assetVotes, dIds));
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
    const ret = _flatten_asset_votes(assetVotes, dIds, uri, model)
    if (ret.votes.length === 0) {
      res.status(404).json({ message: 'No votes found' });
      return;
    }
    res.json(ret);
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
    const dId: DigitalIdentity = req.body.id;
    validateAssetVoteAndOwnership(newVote, dId, vote)
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
    const dId: DigitalIdentity = req.body.id;
    validateAssetVoteAndOwnership(newVote, dId, vote)
    unsetAssetVote(vote)
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};