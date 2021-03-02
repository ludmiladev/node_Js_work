const { Router } = require('express');
const UserController = require('../controllers/users.controllers');
const { authorize } = require('../controllers/authController.js');

const router = Router();

router.post(
    '/auth/register',
    UserController.validateUser,
    UserController.registerNewUser,
);
router.post('/auth/login', UserController.validateUser, UserController.login);
router.get('/auth', authorize, UserController.authUser);
router.get('/auth/logout/:userId', authorize, UserController.logout);
router.get('/users/current', authorize, UserController.getCurrentUser);

module.exports = router;