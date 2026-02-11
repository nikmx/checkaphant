import { Request, Response, NextFunction } from 'express';
import { assetVotes, AssetVote, validateAssetVote, validateAssetVoteAndOwnership, setAssetVote, unsetAssetVote } from '../models/assetVote';
import { NestedAssetVotes, NestedDigitalIdentities } from '../models/store';
import { dIds, DigitalIdentity, setDigitalIdentity } from '../models/digitalIdentity';

const _flatten_asset_votes = (assetVotes: NestedAssetVotes, dIds: NestedDigitalIdentities, uri: string|undefined = undefined, model: string|undefined = undefined) => {
  const flat : AssetVote[] = []
  const flatIds : DigitalIdentity[] = []

  let uidx: string[] = Object.keys(assetVotes)
  if(uri)
    uidx = [uri]
  let iidx: {[key: string]: boolean} = {}

  for(const i in uidx) {
    let midx: string[] = Object.keys(assetVotes[uidx[i]])
    if(model)
      midx = [model]

    for(const j in midx) {      
      for(const k in assetVotes[uidx[i]][midx[j]]) {          
        if(!iidx[assetVotes[uidx[i]][midx[j]][k].sid]) {
          flatIds.push(dIds[assetVotes[uidx[i]][midx[j]][k].sid])
          iidx[assetVotes[uidx[i]][midx[j]][k].sid] = true
        }
        flat.push(assetVotes[uidx[i]][midx[j]][k])          
      }      
    }    
  }

  return {votes: flat, ids: flatIds}
}

// Create an vote
export const createAssetVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAssetVote: AssetVote = req.body.vote;
    const dId: DigitalIdentity = req.body.id;
    await validateAssetVote(newAssetVote, dId);
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
export const updateAssetVote = async (req: Request, res: Response, next: NextFunction) => {
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
    await validateAssetVoteAndOwnership(newVote, dId, vote)
    setAssetVote(newVote)

    res.json({vote: newVote});
  } catch (error) {
    next(error);
  }
};

// Delete an vote
export const deleteAssetVote = async (req: Request, res: Response, next: NextFunction) => {
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
    await validateAssetVoteAndOwnership(newVote, dId, vote)
    unsetAssetVote(vote)
    res.json({vote: vote});
  } catch (error) {
    next(error);
  }
};