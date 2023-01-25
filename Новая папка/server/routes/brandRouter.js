const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware')
 
router.post('/', checkRole('ADMIN'), brandController.create) //добавлять бренды
router.get('/', brandController.getAll)  //получать все бренды
//Нужно добавить еще delete

module.exports = router;