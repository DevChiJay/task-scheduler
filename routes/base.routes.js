const express = require('express');

const router = express.Router();

router.get('/401', function(req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function(req, res) {
    res.status(403).render('shared/403');
});

router.get('/404', function(req, res) {
    res.status(404).render('shared/404');
});

router.get('/500', function(req, res) {
    res.status(500).render('shared/500');
});

module.exports = router;
