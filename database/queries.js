module.exports = {
    getAllUsers: 'select Nombre, Usuario from APPIA_INFO.dbo.Usuarios order by Nombre',
    //newUser: 'insert into users (name, email, pass) values (@name, @email, @pass)',
    getUserPass: 'select Contrasena from APPIA_INFO.dbo.Usuarios where Usuario = @name',
    getAllEmpresas: 'select Empresa from APPIA_INFO.dbo.Empresas order by Empresa',
    getAlbaranData: `select Descripcion, Descripcion2, NroDS from APPIA_SQL.dbo.LineasDePackingList where NumeroDePackingList = @PLE and Empresa = @Empresa order by Descripcion2`,
    putCargadoOnUd: `update APPIA_SQL.dbo.LineasDePackingList set NroDS = 'Cargado' where Descripcion = @Descripcion`,
    delCargadoOnUd: `update APPIA_SQL.dbo.LineasDePackingList set NroDS = null where Descripcion = @Descripcion`,
    setEstiloAE: `update APPIA_SQL.dbo.PackingList set Estilo = @Estilo where NumeroDePackingList = @NumeroDePackingList`
}