var express = require('express');
var con = require('../database/controller');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    let users = await con.getInit();
    res.render('dir/index', { title: 'Embarques', data: users });
});

router.get('/allUsers', con.getAllUsers)
router.get('/newUser', con.newUser)

module.exports = router;