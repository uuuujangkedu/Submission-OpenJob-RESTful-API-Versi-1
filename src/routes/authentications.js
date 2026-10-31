const router = require('express').Router();
const controller = require('../controllers/authentications');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const schema = require('../validators/authentications');

router.post('/authentications', validate(schema.login), controller.login);
router.put('/authentications', validate(schema.refresh), controller.refreshToken);
router.delete('/authentications', auth, validate(schema.refresh), controller.logout);

module.exports = router;
