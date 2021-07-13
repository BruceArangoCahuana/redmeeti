const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const uuid = require('uuid-v4');
const configuracionMulter = {
    limits:{filesize:100000},
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+'/../public/uploads/grupos')      
        },
        filename:(req,file,next)=>{
            const extension = file.mimetype.split('/')[1];
            next(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,next){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            //el formato es valido
            next(null,true);
        }else{
            //el formato no valido
            next(new Error('Formato no valido'),false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');

//sube imagen en el servidor
exports.subirImagen = (req,res,next)=>{
    upload(req,res,function(error){
        if(error){
            //manejamos todos los errores
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo es muy grande');
                }else{
                    req.flash('error',error.message);
                }
            }else if(error.hasOwnProperty('message')){
                req.flash('error',error.message);
            }
            res.redirect('back');
            return;
        }else{
            next();
        }
    })
}
exports.formGrupos = async(req,res,next)=>{
    const categorias = await Categorias.findAll();

    res.render("nuevo-grupo",{
        nombrePagina:'Crear tu grupo',
        categorias
    });
}

exports.crearGrupo = async(req,res,next)=>{
    //zanitizar los campos
    req.sanitizeBody('nombre');
    req.sanitizeBody('url');
  
    const grupo = req.body;
    grupo.usuarioId = req.user.id;
    //leer la imagen
    if(req.file){
        grupo.imagen = req.file.filename;
    }
    grupo.id = uuid();
   try {
        //almacenar en la base de datos
        await Grupos.create(grupo);
        req.flash('exito','Se creo correctamente el grupo');
        res.redirect('/administracion');
    } catch (error) {
        //errores de sequelize
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error',erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
}

exports.fromEditarGrupo = async(req,res,next) => {
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());
    //primise con await
    const[grupo,categorias]= await Promise.all(consultas);
    res.render("Editar-grupo",{
        nombrePagina:`Editar - ${grupo.nombre}`,
        grupo,
        categorias
    });
}

exports.EditarGrupo = async (req,res,next) =>{
    const grupo = await Grupos.findOne({where:{id:req.params.grupoId,usuarioId:req.user.id}});
    //si  no existe ese grupo
    if(!grupo){
        req.flash('error','Operacion no valida');
        res.redirect('/administracion');
        return next();
    }

    const {nombre,descripcion,categoriaId,url} = req.body;
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    //lo guardamos en la base ded datos
    await grupo.save();
    req.flash('exito','Se guardo los cambios correctamente');
    res.redirect('/administracion');
}

exports.formEditarImagen = async(req,res,next) => {
    const grupo = await Grupos.findByPk(req.params.grupoId);

    res.render('cambiar-imagen',{
        nombrePagina:`Editar imagen - ${grupo.nombre}`,
        grupo
    })
}

exports.EditarImagen = async(req,res,next) =>{
    const grupo = await Grupos.findOne({where:{id:req.params.grupoId,usuarioId:req.user.id}});
    //el grupo existe y es valido
    if(!grupo){
        req.flash('error','Operacion invalida');
        res.redirect('/iniciar-sesion');
        return next();
    }
    //verificar que el archivo sea valido
    //if(req.file){}
    //revisar si exite un archivo anterio
    //if(grupo.imagen){}
    if(req.file && grupo.imagen){
        const imagenAnteriorPath = __dirname+`/../public/uploads/grupos/${grupo.imagen}`;
        //eliminar archivo con filesistem
        fs.unlink(imagenAnteriorPath,(error)=>{
            if(error){
                console.log(error);
            }
            return;
        })
    }
    // si hay imagen nueva lo vamos a mostratr
    if(req.file){
        grupo.imagen = req.file.filename;
    }
    //guardar en la base de dato
    await grupo.save();
    req.flash('exito','Se cambio la imagen');
    res.redirect('/administracion');
}

exports.formEliminar = async(req,res,next)=>{
    const grupo = await Grupos.findOne({where:{id:req.params.grupoId,usuarioId:req.user.id}});
    
    if(!grupo){
        req.flash('error','Accion invalida');
        res.redirect('/administracion');
        return next();
    }

    res.render('Eliminar-grupo',{
        nombrePagina:`Eliminar grupo - ${grupo.nombre}`,
        nombre:grupo.nombre,
        imagen:grupo.imagen
    })
}
/**elimina grupo y imagen */
exports.EliminarGrupo = async(req,res,next)=>{
    const grupo = await Grupos.findOne({where:{id:req.params.grupoId,usuarioId:req.user.id}});
    
    if(!grupo){
        req.flash('error','Accion invalida');
        res.redirect('/administracion');
        return next();
    }
    /**si hay una imagen eliminarla */
    if(grupo.imagen){
        const imagenAnteriorPath = __dirname+`/../public/uploads/grupos/${grupo.imagen}`;
        //eliminar archivo con filesistem
        fs.unlink(imagenAnteriorPath,(error)=>{
            if(error){

            }
        })
    }
    /**eliminar el grupo */
    await Grupos.destroy({
        where:{
            id:req.params.grupoId
        }
    });

    /**redireccionar */
    req.flash('exito','Se elimino correctamente el grupo');
    res.redirect('/administracion');
}

