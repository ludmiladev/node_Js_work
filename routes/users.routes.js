
const { Router } = require('express');
const UserController = require('../controllers/users.controllers');
const { authorize } = require('../controllers/authController.js');

const router = Router();

router.post(
    '/auth/register',
    UserController.validateUser,
    UserController.registerNewUser,
    UserController.mailingСheck,
);
router.post('/auth/login', UserController.validateUser, UserController.login);
router.get('/auth', authorize, UserController.authUser);
router.get('/auth/logout/:userId', authorize, UserController.logout);
router.get('/users/current', authorize, UserController.getCurrentUser);

// router.post('/users',
//   UserController.upload.single('userAvatar'),
//   (req, res) => {res.send({ file: req.file, ...req.body });},);

router.patch(
    '/users/userAvatar',
    authorize,
    UserController.upload.single('userAvatar'),
    UserController.validateUpdateUser,
    UserController.updateUserAvatar,
),
    (module.exports = router);
router.get(
    '/auth/verify/:verificationToken',
    UserController.userVerificationToken,
);