 const Grupos = require('../models/Grupos');
 const Meeti = require('../models/Meeti');
 const uuid = require('uuid-v4');
const Categorias = require('../models/Categorias');
 exports.fromMeeti = async(req,res,next)=>{
    const grupo = await Grupos.findAll({where:{usuarioId:req.user.id}})

    res.render('nuevo-meeti',{
        nombrePagina:'Crear nuevo meeti',
        grupo
    })
 },
 exports.guardarMeeti = async(req,res,next)=>{
    //obtener los datos del formulario
    const meeti = req.body;

    //asignando usuario
    meeti.usuarioId = req.user.id;
  
    //almacena la informacion con un point
    const point = {type:'Point',coordinates:[parseFloat(req.body.lat),parseFloat(req.body.lng)]};
    meeti.ubicacion = point;

    //cupo opcional
    if(req.body.cupo === ''){
        meeti.cupo = 0;
    }
    console.log(meeti);
    meeti.id=uuid();
   //almacenar en la base de datos
   try {
       await Meeti.create(meeti);
       req.flash('exito','Se creo el nuevo meeti');
       res.redirect('/administracion');
   } catch (error) {
       //los errores
       const erroresSequelize = error.errors.map(err => err.message);
       req.flash('error',erroresSequelize);
       res.redirect('/nuevo-meeti');
   }
 }

 //sanitiza los mettis 
 exports.santizisar = (req,res,next)=>{
     req.sanitizeBody('titulo');
     req.sanitizeBody('invitado');
     req.sanitizeBody('cupo');
     req.sanitizeBody('fecha');
     req.sanitizeBody('hora');
     req.sanitizeBody('direccion');
     req.sanitizeBody('ciudad');
     req.sanitizeBody('estado');
     req.sanitizeBody('pais');
     req.sanitizeBody('lat');
     req.sanitizeBody('lng');
     req.sanitizeBody('grupoId');

     next();
 }

 exports.fromEditarMeeti = async (req,res,next) =>{
    const consulta = [];
    
    consulta.push(Grupos.findAll({where:{usuarioId:req.user.id}}));
    consulta.push(Meeti.findByPk(req.params.id));

    const [grupo,meeti] = await Promise.all(consulta);
    if (!grupo || !meeti) {
        req.flash('error','Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    res.render('editar-meeti',{
        nombrePagina:`Editar meeti - ${meeti.titulo}`,
        grupo,
        meeti
    })
 }

//guarda cambio en el meeti
exports.EditarMeeti = async(req,res,next) =>{
    const meeti = await Meeti.findOne({where:{id:req.params.id,usuarioId: req.user.id}});
    
    if(!meeti){
        req.flash('error','Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    //asignar los valores
    const {grupoId,titulo,invitado,fecha,hora,cupo,descripcion,direccion,ciudad,estado,pais,lat,lng} = req.body;

    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
    meeti.cupo = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad = ciudad;
    meeti.estado = estado;
    meeti.pais = pais;
    //asignar point (lat,lng)
    const point = {type:'Point',coordinates:[parseFloat(lat),parseFloat(lng)]};
    meeti.ubicacion = point;
    //almacenar en la DB
     await meeti.save();
     req.flash('exito','Se cambio con exito');
     res.redirect('/administracion');
}
//eliminar meeti's
exports.EliminarMeeti = async(req,res,next) =>{
   
    const meeti = await Meeti.findOne({where:{id:req.params.id,usuarioId: req.user.id}});
    if(!meeti){
        req.flash('error','Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    //eliminar meeti
    res.render('eliminar-meeti',{
        nombrePagina:`Eliminar meeti - ${meeti.titulo}`
    })
}

//elimina el meeti's de la base de datos
exports.EliminarMeetiDB = async(req,res,next) =>{
    await Meeti.destroy({
        where:{
            id:req.params.id
        }
    });

    req.flash('exito','Se elimino correctamente');
    res.redirect('/administracion');
}

