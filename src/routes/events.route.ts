import { Router } from 'express';
import * as controller from '../controllers/events.controller.js';

const router = Router();

router.post('/', controller.createEvent);
router.get('/:id', controller.getEvent);
router.post('/:id/register', controller.register);
router.delete('/:id/register', controller.cancel);
router.get('/upcoming', controller.listUpcoming);
router.get('/:id/stats', controller.stats);

export default router;
