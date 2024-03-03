const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer')

/* GET home page */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET about pages */

router.get('/about-solar', function(req, res, next) {
    res.render('about-solar', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/roadmap', function(req, res, next) {
    res.render('roadmap', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/events', function(req, res, next) {
    res.render('events', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('privacy-policy', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET wallet pages */

router.get('/wallets', function(req, res, next) {
    res.render('wallets', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

// SolarCard
router.get('/solarcard', function(req, res, next) {
    res.redirect('https://solar.network/solarcard');
});
/* GET blockchain pages */

router.get('/core', function(req, res, next) {
    res.render('core', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/voting', function(req, res, next) {
    res.render('voting', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET exchanges page */

router.get('/exchanges', function(req, res, next) {
    res.render('exchanges', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});
module.exports = router;
