import { AssetVote, resetAssetVotes } from "../../models/assetVote"
import { KeyVote, resetKeyVotes } from "../../models/keyVote"
import axios from 'axios';
import config from '../../config/config'

const http = axios.create({
  baseURL: config.relays[0]
});

export function _listKeyVotes() {
  return http
    .get(`key`)
    .then((response) => response.data.votes);
}

export function _registerKeyVote(keyVote: {}) {
  return http
    .post(`key`, {vote: keyVote})
    .then((response) => response.data);
}

export function _listAssetVotes() {
  return http
    .get(`asset`)
    .then((response) => response.data.votes);
}

export function _registerAssetVote(assetVote: {}) {
  return http
    .post(`asset`, {vote: assetVote})
    .then((response) => response.data);
}

export function _revokeAssetVote(assetVote: {}) {
  return http
    .put(`asset/${assetVote}/revoke`, {vote: assetVote})
    .then((response) => response.data);
}

export const syncKeyVotesIndex = () => {
  // sync local index with remote according to local trustdb
  _listKeyVotes().then((items) => {
    // TODO do local validation and trust extraction
    // transform and process to local index
    resetKeyVotes(items)
  })   
};

export const registerKeyVote = (keyVote: KeyVote) => {
  // push to registry relay
  _registerKeyVote(keyVote)
};

export const syncAssetVotesIndex = () => {
  // sync local index with remote according to local trustdb
  _listAssetVotes().then((items) => {
    // TODO do local validation and trust extraction
    // transform and process to local index
    resetAssetVotes(items) 
  })
};

export const registerAssetVote = (assetVote: AssetVote) => {
  // push to registry relay
  _registerAssetVote(assetVote)
};
