import { AssetVote, resetAssetVotes } from "../../models/assetVote"
import { KeyVote, resetKeyVotes } from "../../models/keyVote"
import axios from 'axios';
import config from '../../config/config'
import { DigitalIdentity } from "../../models/digitalIdentity";

const http = axios.create({
  baseURL: config.relays[0]
});

export function _listKeyVotes() {
  return http
    .get(`api/v1/key/index`)
    .then((response) => response.data.votes);
}

export function _registerKeyVote(keyVote: {}, dId: {}) {
  return http
    .post(`api/v1/key`, {vote: keyVote, id: dId})
    .then((response) => response.data);
}


export function _revokeKeyVote(keyVote: {}, dId: {}) {
  return http
    .post(`api/v1/key/revoke`, {vote: keyVote, id: dId})
    .then((response) => response.data);
}

export function _listAssetVotes() {
  return http
    .get(`api/v1/asset/index`)
    .then((response) => response.data.votes);
}

export function _registerAssetVote(assetVote: {}, dId: {}) {
  return http
    .post(`api/v1/asset`, {vote: assetVote, id: dId})
    .then((response) => response.data);
}

export function _revokeAssetVote(assetVote: {}, dId: {}) {
  return http
    .put(`api/v1/asset/revoke`, {vote: assetVote, id: dId})
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

export const registerKeyVote = (keyVote: KeyVote, dId: DigitalIdentity) => {
  return _registerKeyVote(keyVote, dId)
};

export const revokeKeyVote = (keyVote: KeyVote, dId: DigitalIdentity) => {
  return _revokeKeyVote(keyVote, dId)
};

export const syncAssetVotesIndex = () => {
  // sync local index with remote according to local trustdb
  _listAssetVotes().then((items) => {
    // TODO do local validation, transform and process to local index
    resetAssetVotes(items) 
  })
};

export const registerAssetVote = (assetVote: AssetVote, dId: DigitalIdentity) => {
  return _registerAssetVote(assetVote, dId)
};


export const revokeAssetVote = (assetVote: AssetVote, dId: DigitalIdentity) => {
  return _revokeAssetVote(assetVote, dId)
};
