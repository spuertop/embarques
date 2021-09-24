const cxn = require('./connection');
const queries = require('./queries');

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
                .query(queries.getUser);
            //Devuelve el pass, el usuario siempre es bueno
            //comprobar que coinciden los pass
            //dar token si coincide y tirar hacia empresa
            //modal de error si no coincide
            res.json(result.recordset);
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