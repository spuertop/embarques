const cxn = require('./connection');
const queries = require('./queries');
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllUsers(req, res) {
        let status = req.query['status'];
        status ? status = true : status = false;
        try {
            const pool = await cxn.getConnection();
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
            res.sentStatus(500)
        }
    },

    async signin(req, res) {
        let {
            user,
            pass
        } = req.body;
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('name', user)
                .query(queries.getUserPass);
            if (result.recordset[0].pass === pass) {
                const accessToken = jwt.sign({
                    user: user
                }, cxn.accessToken, {
                    expiresIn: '1h'
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
            if (err) res.sendStatus(500);
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
            const pool = await cxn.getConnection();
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
        let ae = req.query['albaran'];
        //Añade espacios al final FIXME: Version dev
        ae = ae.slice(0, 10);
        ae = ae + ' '.repeat(10 - ae.length);
        let user = req.user;
        let empresa = req.empresa;
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('Empresa', empresa)
                .input('PLE', ae)
                .query(queries.getAlbaranData);
            let lecturas = result.recordset;
            //FIXME: version dev
            lecturas.forEach(function(item) {
                item.Descripcion1 = item.Descripcion1.trim();
                if (item.NroDS == 'Cargado   ') {
                    item.NroDS = true;
                }
            });
            //Sin coincidencias, devolver a /albaran
            if (lecturas.length == 0) {
                res.render('users/albaran', { data: { ae, empresa, user, 'notfound': true } });
            } else {
                res.render('users/cargar', { data: { ae, empresa, user, lecturas } });
            }
        } catch (error) {
            res.status(500)
            res.send('hahahaha')
        }
    }

}