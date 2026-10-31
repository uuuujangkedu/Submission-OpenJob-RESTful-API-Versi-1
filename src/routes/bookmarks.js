const router = require('express').Router();
const controller = require('../controllers/bookmarks');
const auth = require('../middlewares/auth');

router.post('/jobs/:jobId/bookmark', auth, controller.createBookmark);
router.get('/jobs/:jobId/bookmark/:id', auth, controller.getBookmarkById);
router.delete('/jobs/:jobId/bookmark', auth, controller.deleteBookmark);
router.get('/bookmarks', auth, controller.getMyBookmarks);

module.exports = router;
