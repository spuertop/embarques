module.exports = {
    getAllUsers: `select Nombre, Usuario from APPIA_INFO.dbo.Usuarios where Usuario like 'RF%' or Usuario like 'RES%' order by Nombre`,
    //newUser: 'insert into users (name, email, pass) values (@name, @email, @pass)',
    getUserPass: 'select Contrasena from APPIA_INFO.dbo.Usuarios where Usuario = @name',
    getAllEmpresas: 'select Empresa from APPIA_INFO.dbo.Empresas where Estilo = 18 order by Empresa',
    getAlbaranData: `select Descripcion, Descripcion2, NroDS from APPIA_SQL.dbo.LineasDePackingList where NumeroDePackingList = @PLE and Empresa = @Empresa order by Descripcion2`,
    putCargadoOnUd: `update APPIA_SQL.dbo.LineasDePackingList set NroDS = 'Cargado' where Descripcion = @Descripcion`,
    setControlUsuario2: 'update APPIA_SQL.dbo.PackingList set ControlUsuario2= @usuario, ControlFecha2 = getdate() where Empresa = @Empresa and NumeroDePackingList = @PLE',
    delCargadoOnUd: `update APPIA_SQL.dbo.LineasDePackingList set NroDS = null where Descripcion = @Descripcion`,
    setEstiloAE: `update APPIA_SQL.dbo.PackingList set Estilo = @Estilo where NumeroDePackingList = @NumeroDePackingList`,
    selAgencias: 'select distinct(CodigoDeServicioDeTransporte) from Appia_Sql.dbo.AlbaranesDeEntrega where Empresa = @Empresa',
    getAEagencia: 'select CodigoDeServicioDeTransporte from Appia_Sql.dbo.AlbaranesDeEntrega where Empresa = @Empresa and NumeroDeAlbaran = @ae',
    selPL: `select top 1 NumeroDePackingList FROM APPIA_SQL.dbo.LineasDePackingList where Descripcion = @Descripcion`,
    setCodigoEstadoAE: `update APPIA_SQL.dbo.AlbaranesDeEntrega set EstadoDeServicio = @Estado where Empresa = @Empresa and NumeroDeAlbaran = @NumeroDeAlbaran`
}