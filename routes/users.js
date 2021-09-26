var express = require('express');
var router = express.Router();


router.get('/empresas', function(req, res, next) {
    res.json('respond with a empresas');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

module.exports = router;