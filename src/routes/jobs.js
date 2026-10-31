const router = require('express').Router();
const controller = require('../controllers/jobs');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const schema = require('../validators/jobs');

router.post('/jobs', auth, validate(schema), controller.createJob);
router.get('/jobs', controller.getJobs);
router.get('/jobs/company/:companyId', controller.getJobsByCompany);
router.get('/jobs/category/:categoryId', controller.getJobsByCategory);
router.get('/jobs/:id', controller.getJobById);
router.put('/jobs/:id', auth, validate(schema), controller.updateJob);
router.delete('/jobs/:id', auth, controller.deleteJob);

module.exports = router;
