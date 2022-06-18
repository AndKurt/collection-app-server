const Router = require('express').Router;
const userController = require('../controller/user-controller');
const UserController = require('../controller/user-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;
