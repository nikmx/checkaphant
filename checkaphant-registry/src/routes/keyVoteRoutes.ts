import { Router } from 'express';
import {
  createKeyVote,
  getKeyVotes,
  getKeyVotesByKeys,
  updateKeyVote,
  deleteKeyVote,
} from '../controllers/keyVoteController';

const router = Router();

router.get('/index', getKeyVotes);
router.get('/', getKeyVotesByKeys);
router.post('/', createKeyVote);
router.put('/', updateKeyVote);
router.put('/revoke', deleteKeyVote);

export default router;