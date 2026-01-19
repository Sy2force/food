const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/profile', auth, userController.getMe);
router.get('/dashboard/stats', auth, userController.getDashboardStats); // New route
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById); // Controller checks Self/Admin
router.put('/:id', auth, userController.updateUser); // Controller checks Self
router.patch('/:id', auth, userController.updateIsBusiness); // Controller checks Self
router.delete('/:id', auth, userController.deleteUser); // Controller checks Self/Admin

module.exports = router;
