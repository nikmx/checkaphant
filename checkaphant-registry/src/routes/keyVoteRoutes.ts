import { Router } from 'express';
import {
  createKeyVote,
  getKeyVotes,
  getKeyVoteByKeys,
  updateKeyVote,
  deleteKeyVote,
} from '../controllers/keyVoteController';

const router = Router();

router.get('/', getKeyVotes);
router.get('/:kid/:sid', getKeyVoteByKeys);
router.post('/', createKeyVote);
router.put('/:kid/:sid', updateKeyVote);
router.put('/:kid/:sid/revoke', deleteKeyVote);

export default router;