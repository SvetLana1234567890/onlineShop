const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), typeController.create) //добавлять типы
router.get('/', typeController.getAll)  //получать все типы
//Нужно добавить еще delete

module.exports = router;