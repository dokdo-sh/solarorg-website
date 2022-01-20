var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET about pages */

router.get('/about-solar', function(req, res, next) {
    res.render('about/about-solar', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/roadmap', function(req, res, next) {
    res.render('about/roadmap', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/whitepaper', function(req, res, next) {
    res.render('about/whitepaper', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/faq', function(req, res, next) {
    res.render('about/faq', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('about/privacy-policy', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET app pages */

router.get('/desktop-wallet', function(req, res, next) {
    res.render('apps/desktop-wallet', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/mobile-wallet', function(req, res, next) {
    res.render('apps/mobile-wallet', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/web-wallet', function(req, res, next) {
    res.render('apps/web-wallet', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET blockchain pages */

router.get('/staking', function(req, res, next) {
    res.render('blockchain/staking', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/dev-docs', function(req, res, next) {
    res.render('blockchain/dev-docs', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/exchange-docs', function(req, res, next) {
    res.render('blockchain/exchange-docs', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/swap-details', function(req, res, next) {
    res.render('blockchain/swap-details', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET join-us page */

router.get('/join-us', function(req, res, next) {
    res.render('join-us', { title: 'Solar Network', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

module.exports = router;