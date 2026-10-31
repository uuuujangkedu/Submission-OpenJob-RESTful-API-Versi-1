const router = require('express').Router();
const controller = require('../controllers/categories');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const schema = require('../validators/categories');

router.post('/categories', auth, validate(schema), controller.createCategory);
router.get('/categories', controller.getCategories);
router.get('/categories/:id', controller.getCategoryById);
router.put('/categories/:id', auth, validate(schema), controller.updateCategory);
router.delete('/categories/:id', auth, controller.deleteCategory);

module.exports = router;
