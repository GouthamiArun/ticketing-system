import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireEmployee, requireAgent } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/categories', requireEmployee, adminController.getCategories);
router.post('/', requireEmployee, ticketController.createTicket);
router.get('/', requireEmployee, ticketController.getTickets);
router.get('/stats', requireAgent, ticketController.getStats);
router.get('/:id', requireEmployee, ticketController.getTicketById);
router.patch('/:id', requireAgent, ticketController.updateTicket);
router.post('/:id/comments', requireEmployee, ticketController.addComment);
router.patch('/:id/assign', requireAgent, ticketController.assignTicket);
router.patch('/:id/resolve', requireEmployee, ticketController.markAsResolved);

export default router;
