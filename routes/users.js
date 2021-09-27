var express = require('express'); //
const { route } = require('.');
var router = express.Router(); //
var con = require('../database/controller');

router.use(con.isAuthenticated);

router.get('/empresas', con.getAllEmpresas);

router.get('/empresa', con.getOneEmpresa);

router.get('/albaran', con.FormAlbaran);

module.exports = router;