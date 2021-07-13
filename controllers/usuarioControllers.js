//impotaciones
const Usuario = require('../models/Usuario');
const enviarEmail  = require('../handlers/emails');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    limits:{filesize:100000},
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+'/../public/uploads/perfiles')      
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
exports.fromCrearcuenta = (req,res)=>{
    res.render("crear-cuenta",{
        nombrePagina:'Crear cuenta'
    });
}

exports.crearCuenta = async (req,res,next) =>{
    const usuario  = req.body;
    
    req.checkBody('confirmar','El password  no pude ir vacio').notEmpty();
    req.checkBody('confirmar','La contraseña es diferente').equals(req.body.password);

    //validanso errores
     const  erroresExpress = req.validationErrors();
    
    try {
        await Usuario.create(usuario);
        //url para el envio de creacion de cuenta
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`
        //enviar email de confirmacion
        await enviarEmail.enviarEmail({
            usuario,
            url,
            subject:'Confirma cuenta de meeti',
            archivo:'confirmar-cuenta'
        });
        //flash mesaje y redirecccionar
        req.flash('exito','Te enviamos un correo revisa tu bandeja de mensaje');
        res.redirect('/iniciar-sesion');    
    } catch (error) {
        //errores de sequelize
        const erroresSequelize = error.errors.map(err => err.message); 

        //errores de  express-validator
        const errExp = Object.keys(erroresExpress).map(err=>err.msg);

        //unir los errores
        const listaErrores = [...erroresSequelize,...errExp];

        req.flash('error',listaErrores);
        res.redirect("/crear-cuenta");
    }
}
/**conmfirmar cuenta */
exports.confirmarCuenta = async(req,res,next)=>{
    //verificar que el usuario exista
    const usuario =  await Usuario.findOne({where:{email:req.params.correo}});
    //sino existe redirect where
   if(!usuario){
       req.flash('error','No existe es cuenta');
       res.redirect('/crear-cuenta');
       return next();
   }
    //si existe
    usuario.activo=1;
    await usuario.save();
    req.flash('exito','Se creo la cuenta con exito');
       res.redirect('/iniciar-sesion');
}
exports.formInicarsesion = (req,res,next)=>{
    res.render("iniciar-sesion",{
        nombrePagina:'Iniciar session'
    });
}

exports.formularioPerfil = async(req,res,next) =>{
    const usuario = await Usuario.findByPk(req.user.id);

    res.render('editar-perfil',{
        nombrePagina:`Hola ${usuario.nombre} - edita tu perfil`,
        usuario
    })
}
//alacenamos  los datos
exports.editarPerfil = async(req,res,next) =>{
    const usuario = await Usuario.findByPk(req.user.id);
    //leer datos de form
    //limpiar campos
    req.sanitizeBody('nombre');
    req.sanitizeBody('email');
    const{nombre,descripcion,email} = req.body;
    
    usuario.nombre = nombre;
    usuario.descripcion = descripcion;
    usuario.email = email;

    //guardar en la Base de datos
    await usuario.save();
    req.flash('exito','Se actualizo correctamente');
    res.redirect('/administracion');
}

exports.cambiarPassword = (req,res,next) =>{
    res.render('cambiar-password',{
        nombrePagina:'Cambiar password'
    });
}
//revisa si el password anterior existe
exports.cambiarPasswordBaseDatos = async(req,res,next) =>{
    const usuario = await Usuario.findByPk(req.user.id);

    //verificar  que el password anterior existe
    if(!usuario.validarPassword(req.body.anterior)){
        req.flash('error','password incorrecto')
        res.redirect('/administracion');
        return next();
    }
    //si el password existe hashearlo
    const hash = usuario.hashPassword(req.body.nuevo);
    //asignar el password hasheado al usuario
    usuario.password = hash;
    //guardar en la base de datos
    await usuario.save();

    //redireccionar
    req.logout();
    req.flash('exito','Se actulizo tu contraseña,Inicia session');
    res.redirect('/iniciar-sesion');
}
exports.ImagenPefil = async(req,res,next) =>{
    const usuario = await Usuario.findByPk(req.user.id);

    //mostrar vista
    res.render('imagen-perfil',{
        nombrePagina:`Hola ${usuario.nombre} - sube tu foto`,
        usuario
    })
}

//guarda una imagen nueva y elimina la anterio y actualiza la nueva imagen
exports.GuaradarImagenPefil = async(req,res,next) =>{
    const usuario = await Usuario.findByPk(req.user.id);

    //si hay imagen anterior eliminarla
    if(req.file && usuario.imagen){
        const imagenAnteriorPath = __dirname+`/../public/uploads/perfiles/${usuario.imagen}`;
        //eliminar archivo con filesistem
        fs.unlink(imagenAnteriorPath,(error)=>{
            if(error){
                console.log(error);
            }
            return;
        })
    }
    //guarda imagen
    if(req.file){
        usuario.imagen = req.file.filename;
    }
    //almacenar en la DB
    await usuario.save();
    req.flash('exito','Se subio tu perfil');
    res.redirect('/administracion');
}