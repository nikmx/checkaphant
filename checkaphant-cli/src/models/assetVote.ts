import { createHash } from 'node:crypto'
import {refreshStoreAssetVotes, loadStoreAssetVotes, NestedAssetVotes, upsertStoreAssetVotes, deleteStoreAssetVotes} from './store'
import {registerAssetVote, revokeAssetVote, syncAssetVotesIndex} from '../lib/registry'
import {DigitalIdentity} from './digitalIdentity'
import {gpg} from '../services/gpg'
import {evaluateAssetPolicy, PolicyDecision} from '../lib/policy'
const fs = require('node:fs');


export interface AssetVote {
  ts: number;     // timestamp
  uri: string;    // unique identifier think url, package-name/version, any resolveable
  format: string; // format how to consume content
  hash: string;   // sha-512 of consumed content
  type: string;   // vote type
  rate: number;   // vote rating out of [-10,10]
  model: string;  // applies to a certain model only, will be put to generic 
  sig: string;    // gpg detached signature
  sid: string;    // gpg key-id
}

export const ASSET_VOTE_TYPES = ["void", "intent", "process", "execute", "suspicious", "danger"]

export const hashAssetVoteContent = (content: string) => {
  return createHash('sha512').update(content).digest('hex')
};

export const signAssetVote = async (assetVote: AssetVote, asset: string|undefined) => {
  // do we need to fetch the asset
  if(assetVote.hash === '') {
    if(!asset) {
      // fetch content per uri/format
      throw new Error("Asset resolution not integrated yet, provide hash or local formatted asset path.")
    }
    assetVote.hash = hashAssetVoteContent(fs.readFileSync(asset))
  }
  const sig = await gpg.signDoc(JSON.stringify(assetVote))
  assetVote.sig = sig
  return assetVote;
};

export const validateAssetVote = async (assetVote: AssetVote, dId: DigitalIdentity|undefined) => {
  if (dId)
    await gpg.importKey(dId.pubkey)
  const sig = assetVote.sig
  assetVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(assetVote))
};

export const getAssetVotes = (uri: string, hash: string) => {
  const votes = assetVotes[uri]?.[hash] || []
  return votes;
};

export const checkAssetVotes = (uri: string, hash: string|undefined, asset: string|undefined, format: string|undefined) => {
  // do we need to fetch the asset
  if(!hash) {
    if(!asset) {
      // fetch content per uri/format
      throw new Error("Asset resolution not integrated yet, provide hash or local formatted asset path.")
    }
    hash = hashAssetVoteContent(fs.readFileSync(asset))
  }
  const votes = getAssetVotes(uri, hash)
  const policy: PolicyDecision = evaluateAssetPolicy(votes)
  // transform to output format
  return {
    uri,
    hash,
    format: format || '',
    votes,
    policy,
  };
};

export const setAssetVote = (assetVote: AssetVote, dId: DigitalIdentity, local=false) => {
  if (local) {
    upsertStoreAssetVotes([assetVote])
    assetVotes = loadStoreAssetVotes()
  } else {
    registerAssetVote(assetVote, dId)
  }
};

export const unsetAssetVote = (assetVote: AssetVote, dId: DigitalIdentity, local=false) => {
  if (local) {
    deleteStoreAssetVotes([assetVote])
    assetVotes = loadStoreAssetVotes()
  } else {
    revokeAssetVote(assetVote, dId)
  }
};

export const syncAssetVotes = () => {
  syncAssetVotesIndex()
}

export const resetAssetVotes = (assetVotes: AssetVote[]) => {
  refreshStoreAssetVotes(assetVotes)
  assetVotes = loadStoreAssetVotes()
};

export let assetVotes: NestedAssetVotes = loadStoreAssetVotes();
