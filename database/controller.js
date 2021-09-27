const cxn = require('./connection');
const queries = require('./queries');
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const pool = await cxn.getConnection();
            const result = await pool.request().query(queries.getAllUsers);
            let users = result.recordset;
            if (users.length == 0) {
                res.render('dir/index', { nada: true });
            } else {
                res.render('dir/index', { data: users });
            }
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    },

    async signin(req, res) {
        let { user, pass } = req.body;
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request()
                .input('name', user)
                .query(queries.getUserPass);
            if (result.recordset[0].pass === pass) {
                const accessToken = jwt.sign({ user: user }, cxn.accessToken, { expiresIn: '1h' });
                //res.cookie('Authorization', 'Bearer ' + accessToken);
                res.cookie('token', accessToken);
                res.redirect('/users/empresas')
            } else {
                //FIXME: modal de error si no coincide el pass
                res.sendStatus(500)
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
    isAuthenticated(req, res, next) {
        jwt.verify(req.cookies.token, cxn.accessToken, function(err, decoded) {
            if (err) res.sendStatus(500);
            if (decoded !== undefined) {
                console.log(decoded) //{user, ita, exp}
                req.user = decoded.user;
                if (decoded.empresa) req.empresa = decoded.empresa;
                next();
            }
        });
    },

    async getAllEmpresas(req, res) {
        console.log(req.user);
        try {
            const pool = await cxn.getConnection();
            let result = await pool.request().query(queries.getAllEmpresas);
            let empresas = result.recordset;
            if (empresas.length == 0) {
                res.render('dir/empresas', { nada: true });
            } else {
                res.render('dir/empresas', { data: empresas });
            }
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    },

    async getOneEmpresa(req, res) {
        let empresa = req.query['name'];
        const accessToken = jwt.sign({ user: req.user, empresa: empresa }, cxn.accessToken, { expiresIn: '1h' });
        res.cookie('token', accessToken);
        res.redirect('/users/albaran');
    },

    async FormAlbaran(req, res) {
        let user = req.user;
        let empresa = req.empresa;
        res.send(user + ' ' + empresa);
    }

}