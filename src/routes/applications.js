const router = require('express').Router();
const controller = require('../controllers/applications');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const schema = require('../validators/applications');

router.post('/applications', auth, validate(schema.create), controller.createApplication);
router.get('/applications', auth, controller.getApplications);
router.get('/applications/user/:userId', auth, controller.getApplicationsByUser);
router.get('/applications/job/:jobId', auth, controller.getApplicationsByJob);
router.get('/applications/:id', auth, controller.getApplicationById);
router.put('/applications/:id', auth, validate(schema.update), controller.updateApplication);
router.delete('/applications/:id', auth, controller.deleteApplication);

module.exports = router;
