const router = require('express').Router();
const controller = require('../controllers/users');
const validate = require('../middlewares/validate');
const createUserSchema = require('../validators/users');

router.post('/users', validate(createUserSchema), controller.createUser);
router.get('/users/:id', controller.getUserById);

module.exports = router;
