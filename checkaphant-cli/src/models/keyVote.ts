import { registerKeyVote, revokeKeyVote, syncKeyVotesIndex } from '../lib/registry';
import {refreshStoreKeyVotes, NestedKeyVotes, loadStoreKeyVotes, upsertStoreKeyVotes, deleteStoreKeyVotes} from './store'
import {gpg} from '../services/gpg'
import {DigitalIdentity} from './digitalIdentity'
import {evaluateKeyPolicy, PolicyDecision} from '../lib/policy'
const fs = require('node:fs');

export interface KeyVote {
  ts: number;
  kid: string;
  type: string;
  rate: number;
  sig: string;
  sid: string;
}

export const KEY_VOTE_TYPES = ["void", "intent", "suspicious", "danger"]

export const signKeyVote = async (keyVote: KeyVote) => {
  const sig = await gpg.signDoc(JSON.stringify(keyVote))
  keyVote.sig = sig
  return keyVote;
};

export const validateKeyVote = async (keyVote: KeyVote, dId: DigitalIdentity|undefined) => {
  //if (dId)
  //  await gpg.importKey(dId.pubkey)
  const sig = keyVote.sig
  keyVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(keyVote))
};

export const getKeyVotes = (kid: string) => {
  const votes = keyVotes[kid] || []
  return votes;
};

export const checkKeyVotes = (kid: string) => {
  const votes = getKeyVotes(kid)
  const policy: PolicyDecision = evaluateKeyPolicy(votes)
  // transform to output format
  return {
    kid,
    votes,
    policy,
  };
};

export const setKeyVote = (keyVote: KeyVote, dId: DigitalIdentity, local=false) => {
  if (local) {
    upsertStoreKeyVotes([keyVote])
    keyVotes = loadStoreKeyVotes()
  } else {
    registerKeyVote(keyVote, dId)
  }
};

export const unsetKeyVote = (keyVote: KeyVote, dId: DigitalIdentity, local=false) => {
  if (local) {
    deleteStoreKeyVotes([keyVote])
    keyVotes = loadStoreKeyVotes()
  } else {
    revokeKeyVote(keyVote, dId)
  }
};

export const resetKeyVotes = (keyVotes: KeyVote[]) => {
  refreshStoreKeyVotes(keyVotes)
  keyVotes = loadStoreKeyVotes()
};

export const syncKeyVotes = () => {
  syncKeyVotesIndex()
}

export let keyVotes: NestedKeyVotes = loadStoreKeyVotes();
