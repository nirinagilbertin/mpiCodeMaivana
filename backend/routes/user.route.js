import express from 'express';
import UserController from '../controllers/user.controller.js';
import models from '../models/index.js';
import { body } from 'express-validator';

const router = express.Router();
const userController = new UserController(models);

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').notEmpty(),
  userController.register
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id/status', userController.updateUserStatus);
router.delete('/:id', userController.deleteUser);

export default router;