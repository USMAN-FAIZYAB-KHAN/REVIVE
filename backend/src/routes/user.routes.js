import express from 'express';
import {
 userRegistration,
 googleAuth,
 login,
 getMe
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', userRegistration);
router.post('/google-auth', googleAuth);
router.post('/login', login);
router.get('/me', getMe);

export default router;