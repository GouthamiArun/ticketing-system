import { Router } from 'express';
import { serviceRequestController } from '../controllers/serviceRequest.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireEmployee, requireAgent } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', requireEmployee, serviceRequestController.createServiceRequest);
router.get('/', requireEmployee, serviceRequestController.getServiceRequests);
router.get('/stats', requireAgent, serviceRequestController.getStats);
router.get('/:id', requireEmployee, serviceRequestController.getServiceRequestById);
router.patch('/:id', requireAgent, serviceRequestController.updateServiceRequest);
router.post('/:id/approve', requireAgent, serviceRequestController.approveServiceRequest);
router.post('/:id/reject', requireAgent, serviceRequestController.rejectServiceRequest);
router.post('/:id/comments', requireEmployee, serviceRequestController.addComment);
router.patch('/:id/assign', requireAgent, serviceRequestController.assignServiceRequest);

export default router;
