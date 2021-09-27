module.exports = {
    getAllUsers: 'select name from users order by name',
    newUser: 'insert into users (name, email, pass) values (@name, @email, @pass)',
    getUserPass: 'select pass from users where name = @name',
    getAllEmpresas: 'select name from empresas'
}