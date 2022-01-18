var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/*
router.get('/faq', function(req, res, next) {
    res.render('faq', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/mobile-wallet', function(req, res, next) {
    res.render('mobile-wallet', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});
*/
router.get('/roadmap', function(req, res, next) {
    res.render('roadmap', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

module.exports = router;