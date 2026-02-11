import { gpg } from "../services/gpg";
import { DigitalIdentity } from "./digitalIdentity";



export interface DigitalAsset {
  content: string;
  format: string;
  isFile: boolean;
  sig: string;
  sigIsFile: boolean;
}

export const signDigitalAsset = async (asset: DigitalAsset) => {
  const sig = await gpg.signDoc(asset.content, asset.isFile)
  asset.sig = sig
  return asset;
};

export const validateDigitalAsset = async (asset: DigitalAsset, dId: DigitalIdentity|undefined) => {
  //if (dId)
  //  await gpg.importKey(dId.pubkey)
  return gpg.verifySignature(asset.sig, asset.content, asset.sigIsFile, asset.isFile)
};