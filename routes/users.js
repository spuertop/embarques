var express = require('express');
var router = express.Router();
var con = require('../database/controller');

router.use(con.isAuthenticated);

router.get('/empresas', con.getAllEmpresas);

router.get('/empresa', con.getOneEmpresa);

router.get('/albaran', con.FormAlbaran);

router.get('/carga', con.getAlbaranData);

router.get('/setae', con.setAE);

module.exports = router;