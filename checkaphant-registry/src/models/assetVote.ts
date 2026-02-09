//import {GPG} from 'gpg-ts'
import {deleteStoreAssetVotes, loadStoreAssetVotes, NestedAssetVotes, upsertStoreAssetVotes} from './store'

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

export const validateAssetVote = (assetVote: AssetVote) => {
  // validate gpg sig/sid
  //GPG.verifySignature("...", fn...);
};

export const validateAssetVoteAndOwnership = (assetVote: AssetVote, refAssetVote: AssetVote, failIfEqual: boolean = true) => {
  // validate gpg sig of assetVote and common ownership
  //GPG.verifySignature(sig, [], fn...);
  validateAssetVote(assetVote);
  if(assetVote.sid !== refAssetVote.sid)
    throw new Error("Votes have different owners.")
  if(failIfEqual && assetVote.sig === refAssetVote.sig)
    throw new Error("Votes are equal.")
};

export const setAssetVote = (assetVote: AssetVote) => {
  // const prevAssetVote: AssetVote = assetVotes[assetVote.uri][assetVote.model][assetVote.sid]
  upsertStoreAssetVotes([assetVote])
  assetVotes[assetVote.uri][assetVote.model][assetVote.sid] = assetVote
};

export const unsetAssetVote = (assetVote: AssetVote) => {
  // const prevAssetVote: AssetVote = assetVotes[assetVote.uri][assetVote.model][assetVote.sid]
  deleteStoreAssetVotes([assetVote])
  delete assetVotes[assetVote.uri][assetVote.model][assetVote.sid]
};

export let assetVotes: NestedAssetVotes = loadStoreAssetVotes();
