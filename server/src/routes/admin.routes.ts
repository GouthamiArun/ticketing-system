import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin, requireAgent } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User management (admin only)
router.get('/users', requireAdmin, adminController.getUsers);
router.get('/users/agents', requireAdmin, adminController.getAgents);
router.post('/users', requireAdmin, adminController.createUser);
router.patch('/users/:id', requireAdmin, adminController.updateUser);
router.patch('/users/:id/deactivate', requireAdmin, adminController.deactivateUser);
router.patch('/users/:id/activate', requireAdmin, adminController.activateUser);

// Category management (admin only)
router.get('/categories', requireAgent, adminController.getCategories);
router.post('/categories', requireAdmin, adminController.createCategory);
router.patch('/categories/:id', requireAdmin, adminController.updateCategory);
router.delete('/categories/:id', requireAdmin, adminController.deleteCategory);

// Analytics (admin and agents)
router.get('/analytics', requireAgent, adminController.getAnalytics);

export default router;
