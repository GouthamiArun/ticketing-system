import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { uploadSingle, uploadMultiple } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireEmployee } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', requireEmployee, upload.single('file'), uploadSingle);
router.post('/multiple', requireEmployee, upload.array('files', 10), uploadMultiple);

export default router;
