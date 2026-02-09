//import {GPG} from 'gpg-ts'
import {deleteStoreAssetVotes, loadStoreAssetVotes, NestedAssetVotes, upsertStoreAssetVotes} from './store'
import {gpg} from '../services/gpg'
const fs = require('node:fs');

export interface AssetVote {
  ts: number;
  uri: string; // endpoint
  format: string; // format how to consume content
  hash: string; // sha-512 of consumed content
  type: string; // vote/trust type
  rate: number; // numeric rating between -10 and 10
  model: string; // applies for certain model
  sig: string; // gpg signature
  sid: string; // gpg kid
  spk: string; // gpg pub-key
}

export const ASSET_VOTE_TYPES = ["void", "intent", "process", "execute", "suspicious", "danger"]

export const validateAssetVote = async (assetVote: AssetVote) => {
  await gpg.importKey(assetVote.spk)
  const sig = assetVote.sig
  assetVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(assetVote))
};

export const validateAssetVoteAndOwnership = (assetVote: AssetVote, refAssetVote: AssetVote, failIfEqual: boolean = true) => {
  validateAssetVote(assetVote);
  if(assetVote.spk !== refAssetVote.spk)
    throw new Error("Votes have different owners.")
  if(failIfEqual && assetVote.sig === refAssetVote.sig)
    throw new Error("Votes are equal.")
};

export const setAssetVote = (assetVote: AssetVote) => {
  upsertStoreAssetVotes([assetVote])
  assetVotes[assetVote.uri][assetVote.model][assetVote.sid] = assetVote
};

export const unsetAssetVote = (assetVote: AssetVote) => {
  deleteStoreAssetVotes([assetVote])
  delete assetVotes[assetVote.uri][assetVote.model][assetVote.sid]
};

export let assetVotes: NestedAssetVotes = loadStoreAssetVotes();
