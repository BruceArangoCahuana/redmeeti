const Grupo  = require('../../models/Grupos');
const Usuario  = require('../../models/Usuario');
const Sequelize = require('sequelize');

exports.mostrarPerfil = async(req,res) =>{
 const consultas = [];

 consultas.push(Usuario.findOne({where:{id:req.params.id}}));
 consultas.push(Grupo.findAll({where:{usuarioId:req.params.id}}));

 const[usuario,grupo] = await Promise.all(consultas);

 if(!usuario){
    res.redirect('/');
    return next();
 }

 res.render('usuario-perfil',{
    nombrePagina:`Bienvenido a tu perfil- ${usuario.nombre}`,
    usuario,
    grupo
 })
}