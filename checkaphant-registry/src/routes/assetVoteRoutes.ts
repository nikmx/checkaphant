import { Router } from 'express';
import {
  createAssetVote,
  getAssetVotes,
  getAssetVoteByKeys,
  updateAssetVote,
  deleteAssetVote,
} from '../controllers/assetVoteController';

const router = Router();

router.get('/', getAssetVotes);
router.get('/:uri/:sid/:model', getAssetVoteByKeys);
router.post('/', createAssetVote);
router.put('/:uri/:sid', updateAssetVote);
router.put('/:uri/:sid/revoke', deleteAssetVote);

export default router;