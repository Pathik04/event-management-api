// src/routes/users.route.ts
import { Router } from 'express';
import { createUser } from '../controllers/users.controller.js';

const router = Router();
router.post('/', createUser);

export default router;
