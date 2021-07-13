const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; 

exports.panelAdministracion = async(req,res,next)=>{
    //consulta
    const consulta = [];
    consulta.push(Grupos.findAll({where:{usuarioId:req.user.id}}));
    consulta.push(Meeti.findAll({where:{usuarioId:req.user.id,
                                        fecha:{[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}
                                    
                                },
                                order:[
                                    ['fecha','DESC']
                                ]

    }));
    consulta.push(Meeti.findAll({where:{usuarioId:req.user.id,
                                        fecha:{[Op.lt]: moment(new Date()).format("YYYY-MM-DD")}
                                    
    }}));
    //array destructuring
    const [grupo,meeti,anterior] = await Promise.all(consulta); 
    res.render("administracion",{
        nombrePagina:'Panel Administracion',
        grupo,
        meeti,
        moment,
        anterior
    });
}