const Meeti  = require('../../models/Meeti');
const Grupo  = require('../../models/Grupos');
const Usuario  = require('../../models/Usuario');
const Categoria  = require('../../models/Categorias');
const Comentarios  = require('../../models/Comentarios');
const Sequelize = require('sequelize');
const moment = require('moment');
const Op = Sequelize.Op;

exports.mostrarMeeti = async(req,res,next) =>{
    const meeti = await Meeti.findOne(
        {where:{
        slug:req.params.slug
        },
        include:[
            {
                model:Grupo
            },
            {
                model:Usuario,
                attributes:['id','nombre','imagen']
            }
        ]
    })

  

    if(!meeti){
        res.redirect('/');
    }
    //consultar por meeti cercanos
    const ubicacion = Sequelize.literal(`ST_GeomFromText('POINT(${meeti.ubicacion.coordinates[0]} 
        ${meeti.ubicacion.coordinates[1]})')`)
    //ST_DISTANCE_Sphere = retorna una linea en metro
    const distancia = Sequelize.fn('ST_DistanceSphere',Sequelize.col('ubicacion'),ubicacion);
    //encontrar meetis cercanos
    const cercanos = await Meeti.findAll({
        order:distancia,
        where:Sequelize.where(distancia,{[Op.lte]: 2000}),
        limit:3,
        offset:1,
        include:[
            {
                model:Grupo
            },
            {
                model:Usuario,
                attributes:['id','nombre','imagen']
            }
        ]
    })

    const comentarios = await Comentarios.findAll(
        {where:{
            meetiId:meeti.id
        },
        include:[
            {
                model:Usuario,
                attributes:['id','nombre','imagen']
            }
        ]}
    )

    res.render('mostrar-meeti',{
        nombrePagina:`meeti - ${meeti.titulo}`,
        meeti,
        moment,
        comentarios,
        cercanos
    })
}

//confirmar o cancelar meeti
exports.confirmarAsistencia = async(req,res) =>{
    const {accion} = req.body;
    if(accion === "confirmar" ){
        //agrega el usuario
        Meeti.update(
            {'intersados': Sequelize.fn('array_append',Sequelize.col('intersados'),req.user.id)},
            {'where':{'slug':req.params.slug}}
        )

        res.send('Has confirmado tu asistencia');
    }else{
        //cancelar la asistencia
        Meeti.update(
            {'intersados': Sequelize.fn('array_remove',Sequelize.col('intersados'),req.user.id)},
            {'where':{'slug':req.params.slug}}
        )

        res.send('Has cancelado tu asistencia');
    }
   
}
exports.mostrarAsistentes = async(req,res,next) => {
    const meeti = await Meeti.findOne({
        where:{slug:req.params.slug},
        attributes:['intersados']
    })

    const{intersados} = meeti;

    const asistentes = await Usuario.findAll({
        attributes:['nombre','imagen','id'],
        where:{id:intersados}
    })

    res.render('asistentes-meeti',{
        nombrePagina:'Meeti - Interesados',
        asistentes
    })
}

exports.mostrarCategoria = async(req,res,next) =>{
    const categoria = await Categoria.findOne({
        attributes:['id','nombre'],
        where:{slug:req.params.categoria}
    })

    const meeti = await Meeti.findAll({
        order:[
            ['fecha','ASC']
        ],
        include:[{
            model:Grupo,
            where:{categoriaId : categoria.id}
        },
        {
            model:Usuario
        }
    ]
    });

    res.render('meeti-categoria',{
        nombrePagina:`Meeti categoria - ${categoria.nombre}`,
        meeti,
        moment
    })
}