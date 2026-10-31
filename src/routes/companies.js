const router = require('express').Router();
const controller = require('../controllers/companies');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const schema = require('../validators/companies');

router.post('/companies', auth, validate(schema), controller.createCompany);
router.get('/companies', controller.getCompanies);
router.get('/companies/:id', controller.getCompanyById);
router.put('/companies/:id', auth, validate(schema), controller.updateCompany);
router.delete('/companies/:id', auth, controller.deleteCompany);

module.exports = router;
