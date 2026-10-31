const router = require('express').Router();
const controller = require('../controllers/profile');
const auth = require('../middlewares/auth');

router.get('/profile', auth, controller.getProfile);
router.get('/profile/applications', auth, controller.getProfileApplications);
router.get('/profile/bookmarks', auth, controller.getProfileBookmarks);

module.exports = router;
