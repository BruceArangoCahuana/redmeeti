const Comentarios = require('../../models/Comentarios');
const Meeti = require('../../models/Meeti');

exports.agregarComentario = async(req,res,next) =>{
    //obtener comentario
    const {comentario} = req.body;
    
    //crear comentario en la BD
    await Comentarios.create({
        mensaje:comentario,
        usuarioId:req.user.id,
        meetiId:req.params.id
    })

    res.redirect('back');
    next();
}

exports.EliminarComentario = async(req,res,next) =>{
    const {idcomentario} = req.body;

    //consultar el comentario
    const comentario = await Comentarios.findOne({where:{id:idcomentario}});

    
    
    //verificar si existe el comentario
    if(!comentario){
        res.status(404).send('accion no valida');
        return next();
    }
    //consultar meeti
     const meeti = await Meeti.findOne({where:{id: comentario.meetiId}});
    
    //verificar quien lo borra es el creador
    if(comentario.usuarioId === req.user.id || meeti.usuarioId === req.user.id){
        await Comentarios.destroy({where:{id:comentario.id}})
        res.status(200).send('Eliminado correctamente');
        return next();
    }else{
        res.status(403).send('accion no valida');
        return next();
    }
}