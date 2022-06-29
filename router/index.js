const Router = require('express').Router;
const userController = require('../controller/user-controller');
const CollectionController = require('../controller/collection-controller');
const ItemController = require('../controller/item-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.delete('/users', authMiddleware, userController.deleteUser);
router.put('/users', authMiddleware, userController.updateUser);

//collection
router.get('/collection', CollectionController.getAllCollections);
router.post('/collection', authMiddleware, CollectionController.createCollection);
router.delete('/collection', authMiddleware, CollectionController.deleteCollection);
router.put('/collection', authMiddleware, CollectionController.updateCollection);

//item
router.get('/item', ItemController.getAllItems);
router.post('/item', authMiddleware, ItemController.createItem);
router.delete('/item', authMiddleware, ItemController.deleteItem);
router.put('/item', authMiddleware, ItemController.updateCollection);

module.exports = router;
