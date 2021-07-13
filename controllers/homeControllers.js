const Categoria = require('../models/Categorias');
const Usuario = require('../models/Usuario');
const Meeti = require('../models/Meeti');
const Grupos = require('../models/Grupos');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.home = async(req,res)=>{

    ///promise para consulta de homepage
    const consulta = [];
    consulta.push(Categoria.findAll({}));
    consulta.push(Meeti.findAll({
        attributes:['slug','titulo','fecha','hora'],
        where:{
            fecha:{[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}
        },
        limit:3,
        order:[
            ['fecha','DESC']
        ],
        include:[
            {
                model:Grupos,
                attributes:['imagen']
            },
            {
                model:Usuario,
                attributes:['nombre','imagen']
            }
        ]
    }));

    //extraer y traer a ala vista
    const [categoria,meetis] = await Promise.all(consulta);
    res.render("home",{
        nombrePagina:'Inicio',
        categoria,
        meetis,
        moment
    });
}