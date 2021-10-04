module.exports = {
    getAllUsers: 'select name from users order by name',
    newUser: 'insert into users (name, email, pass) values (@name, @email, @pass)',
    getUserPass: 'select pass from users where name = @name',
    getAllEmpresas: 'select name from empresas order by name',
    getAlbaranData: 'select Descripcion1, Descripcion2, NroDS from LineasDePacking where PLE = @PLE and Empresa = @Empresa order by Descripcion2',
    putCargadoOnUd: `update LineasDePacking set NroDS = 'Cargado' where Descripcion1 = @Descripcion1`,
    delCargadoOnUd: `update LineasDePacking set NroDS = null where Descripcion1 = @Descripcion1`,
    setEstiloAE: `update Packing set Estilo = @Estilo where NumeroDePackingList = @NumeroDePackingList`
}