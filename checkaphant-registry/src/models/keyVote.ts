import {loadStoreKeyVotes, deleteStoreKeyVotes, upsertStoreKeyVotes, NestedKeyVotes} from './store'
import {gpg} from '../services/gpg'
import { DigitalIdentity } from './digitalIdentity';
const fs = require('node:fs');

export interface KeyVote {
  ts: number;   // timestamp
  kid: string;  // gpg key-id
  type: string; // vote type
  rate: number; // vote rating in [-10,10]
  sig: string;  // gpg detached sig
  sid: string;  // gpg key-id
}

export const KEY_VOTE_TYPES = ["void", "intent", "suspicious", "danger"]

export const validateKeyVote = async (keyVote: KeyVote, dId: DigitalIdentity) => {
  if (dId)
    await gpg.importKey(dId.pubkey)
  const sig = keyVote.sig
  keyVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(keyVote))
};

export const validateKeyVoteAndOwnership = async (keyVote: KeyVote, dId: DigitalIdentity, refKeyVote: KeyVote, failIfEqual: boolean = true) => {
  await validateKeyVote(keyVote, dId)
  if(keyVote.sid !== refKeyVote.sid)
    throw new Error("Votes have different owners.")
  if(failIfEqual && keyVote.sig === refKeyVote.sig)
    throw new Error("Votes are equal.")
};

export const setKeyVote = (keyVote: KeyVote) => {
  upsertStoreKeyVotes([keyVote])
  keyVotes[keyVote.kid][keyVote.sid] = keyVote
};

export const unsetKeyVote = (keyVote: KeyVote) => {
  // const prevKeyVote: KeyVote = keyVotes[keyVote.uri][keyVote.model][keyVote.sid]
  deleteStoreKeyVotes([keyVote])
  delete keyVotes[keyVote.kid][keyVote.sid]
};

export let keyVotes: NestedKeyVotes = loadStoreKeyVotes();
