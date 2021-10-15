const cxn = require('./connection');
const queries = require('./queries');
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllUsers(req, res) {
        let status = req.query['status'];
        status ? status = true : status = false;
        try {
            const pool = await cxn.getUserConn();
            const result = await pool.request().query(queries.getAllUsers);
            let users = result.recordset;
            if (users.length == 0) {
                res.render('users/index', {
                    nada: true
                });
            } else {
                res.render('users/index', {
                    data: users,
                    status: status
                });
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    },

    async signin(req, res) {
        let {
            user,
            pass
        } = req.body;
        try {
            const pool = await cxn.getUserConn();
            let result = await pool.request()
                .input('name', user)
                .query(queries.getUserPass);
            if (result.recordset[0].Contrasena === pass) {
                const accessToken = jwt.sign({
                    user: user
                }, cxn.accessToken, {
                    expiresIn: '8h'
                });
                //res.cookie('Authorization', 'Bearer ' + accessToken);
                res.cookie('token', accessToken);
                res.redirect('/users/empresas')
            } else {
                //FIXME: modal de error si no coincide el pass
                res.status(403);
                res.redirect('/?status=403');
            }
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    },

    async newUser(req, res) {
        let name = "Alice";
        let email = ""
        let pass = "1234"

        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('name', name)
                .input('email', email)
                .input('pass', pass)
                .query(queries.newUser);
            res.json(result)
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    },

    //Protected routes
    isAuthenticated(req, res, next) {
        jwt.verify(req.cookies.token, cxn.accessToken, function(err, decoded) {
            if (err) res.redirect('/');
            if (decoded !== undefined) {
                //console.log(decoded) //{user, ita, exp}
                req.user = decoded.user;
                if (decoded.empresa) req.empresa = decoded.empresa;
                next();
            }
        });
    },

    async getAllEmpresas(req, res) {
        //console.log(req.user);
        try {
            const pool = await cxn.getUserConn();
            let result = await pool.request().query(queries.getAllEmpresas);
            let empresas = result.recordset;
            if (empresas.length == 0) {
                res.render('users/empresas', {
                    nada: true
                });
            } else {
                res.render('users/empresas', {
                    data: empresas
                });
            }
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    },

    async getOneEmpresa(req, res) {
        let empresa = req.query['name'];
        const accessToken = jwt.sign({
            user: req.user,
            empresa: empresa
        }, cxn.accessToken, {
            expiresIn: '1h'
        });
        res.cookie('token', accessToken);
        res.redirect('/users/albaran');
    },

    async FormAlbaran(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        let data = {
            user,
            empresa
        };
        res.render('users/albaran', {
            data: data
        })
    },

    async getAlbaranData(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        let ae = req.query['albaran'];
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('Empresa', empresa)
                .input('PLE', 'PLC' + ae)
                .query(queries.getAlbaranData);
            let lecturas = result.recordset;
            lecturas.forEach(function(item) {
                item.Descripcion = item.Descripcion.trim();
                if (item.NroDS == 'Cargado') {
                    item.NroDS = true;
                }
            });
            let result2 = await pool.request()
                .input('Empresa', empresa)
                .input('AE', ae)
                .query(queries.getAEagencia);
            let agencia = result2.recordset[0];
            console.log(agencia);
            //Sin coincidencias, devolver a /albaran
            if (lecturas.length == 0) {
                res.render('users/albaran', {
                    data: {
                        ae,
                        empresa,
                        user,
                        'notfound': true
                    }
                });
            } else {
                console.log(lecturas)
                res.render('users/cargar', {
                    data: {
                        ae,
                        empresa,
                        user,
                        lecturas,
                        agencia
                    }
                });
            }
        } catch (error) {
            res.status(500)
            res.send("Linea 01" + error.message)
        }

    },

    async cargar(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        let ae = req.query['ae'];
        let ud = req.query['ud'];
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('Descripcion', ud)
                .query(queries.putCargadoOnUd);
            await pool.request()
                .input('PLE', 'PLC' + ae)
                .input('Empresa', empresa)
                .input('usuario', user)
                .query(queries.setControlUsuario2);
            res.json(result.rowsAffected);
        } catch (error) {
            console.log('Fatal error on getAlbaranData if ud ' + error)
        }
    },

    async descargar(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        let ae = req.query['ae'];
        let udd = req.query['udd'];
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('Descripcion', udd)
                .query(queries.delCargadoOnUd);
            await pool.request()
                .input('PLE', 'PLC' + ae)
                .input('Empresa', empresa)
                .input('usuario', user)
                .query(queries.setControlUsuario2);
            res.json(result.rowsAffected);
        } catch (error) {
            console.log('Fatal error on getAlbaranData if udd ' + error)
        }
    },

    async setAE(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        let ae = req.query['ae'];
        let total = req.query['total'];
        if (total == 100) {
            total = 75 //estilo cargado
        } else if (total > 0) {
            total = 74 //parcialmente cargado
        } else {
            total = null
        }
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('Estilo', total)
                .input('NumeroDePackingList', "PLC" + ae)
                .query(queries.setEstiloAE);
            //Actualizar AE
            await pool.request()
                .input('Estado', total == 75 ? "CARGADO" : null)
                .input('NumeroDeAlbaran', ae)
                .input('Empresa', empresa)
                .query(queries.setCodigoEstadoAE)
            res.json(result.rowsAffected);
        } catch (error) {
            console.log(error)
        }
    },

    async logout(req, res) {
        res.cookie('token', '');
        res.redirect('/');
    }
}