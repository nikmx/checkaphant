import { Router } from 'express';
import {
  createAssetVote,
  getAssetVotes,
  getAssetVotesByKeys,
  updateAssetVote,
  deleteAssetVote,
} from '../controllers/assetVoteController';

const router = Router();

router.get('/index', getAssetVotes);
router.get('/', getAssetVotesByKeys);
router.post('/', createAssetVote);
router.put('/', updateAssetVote);
router.put('/revoke', deleteAssetVote);

export default router;