const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validate = require('../middleware/validate');
const { userRegisterSchema, userLoginSchema, userUpdateSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/register', validate(userRegisterSchema), userController.register);
router.post('/login', validate(userLoginSchema), userController.login);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', auth, userController.deleteAvatar);
router.get('/dashboard/stats', auth, userController.getDashboardStats);
router.post('/favorites', auth, userController.addToFavorites);
router.delete('/favorites', auth, userController.removeFromFavorites);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;
