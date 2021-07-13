const Grupo  = require('../../models/Grupos');
const Meeti  = require('../../models/Meeti');
const moment = require('moment');

exports.mostrarGrupos = async(req,res,next) =>{
    const consulta = [];

    consulta.push(Grupo.findOne({
        where:{id:req.params.id}
    }));

    consulta.push(Meeti.findAll({
        where:{grupoId:req.params.id},
        order:[
            ['fecha','ASC']
        ]
    }))

    const [grupo,meeti] = await Promise.all(consulta);
    //si no hay grupo
    if(!grupo){
        res.redirect('/');
        return next();
    }
    //mostrar vista

    res.render('mostrar-grupo',{
        nombrePagina:`Grupo - ${grupo.nombre}`,
        grupo,
        meeti,
        moment
    })
}