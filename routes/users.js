var express = require('express');
var router = express.Router();
var con = require('../database/controller');

router.use(con.isAuthenticated);

router.get('/empresas', con.getAllEmpresas);

router.get('/empresa', con.getOneEmpresa);

router.get('/albaran', con.FormAlbaran);

router.get('/carga', con.getAlbaranData);

router.get('/cargar', con.cargar);

router.get('/descargar', con.descargar);

router.get('/setae', con.setAE);

router.get('/salir', con.logout)

module.exports = router;