import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', updatePassword);
router.delete('/', deleteAccount);

export default router;