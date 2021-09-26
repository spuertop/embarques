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
            //Devuelve el pass, el usuario siempre es bueno
            //comprobar que coinciden los pass
            //dar token si coincide y tirar hacia empresa
            if (result.recordset[0].pass === pass) {
                const accessToken = jwt.sign({ user: user }, cxn.accessToken, { expiresIn: '1h' });
                res.cookie('Authorization', 'Bearer ' + accessToken);
                res.redirect('/users/empresas')
            } else {
                //modal de error si no coincide
                res.status(500)
                res.send(error.message)
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
    }
}