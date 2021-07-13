const Meeti = require('../../models/Meeti');
const Grupo = require('../../models/Grupos');
const Usuario = require('../../models/Usuario');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

exports.buscar = async(req,res) =>{
 const{categoria,titulo,ciudad,pais} = req.query;
 //hacer que la categoria no sea obligatoriov
 let query;
 if(categoria === ''){
     query = ''
}else{
    query = `
        where:{
            categoriaId:{[Op.eq]: ${categoria}}
        }
     `;
}
 //filtrar los meetis por el termino de la busqueda
 const meeti = await Meeti.findAll({
     where:{
         titulo:{[Op.iLike]:'%'+ titulo +'%'},
         ciudad:{[Op.iLike]:'%'+ ciudad +'%'},
         pais:{[Op.iLike]:'%'+ pais +'%'}
     },
     include:[
        {
            model:Grupo,
            query
        },
        {
            model:Usuario,
            attributes:['id','nombre','imagen']
        }
    ]
 })
    res.render('buscador',{
        nombrePagina:'Resultado de la busqueda',
        meeti,
        moment
    })
}
