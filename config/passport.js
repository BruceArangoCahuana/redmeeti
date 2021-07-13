const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    async(email,password,next)=>{
        //buscamos el usuario en la base datos
        const usuario = await Usuario.findOne({ where : { email, activo : 1 } });

        console.log(usuario)
        if(!usuario) return next(null,false,{
            message:'El usuario no existe,aun no haz confirmado tu cuenta',
        });

        //si el usuario existe
        const verificarPassword = usuario.validarPassword(password);
        //si no pasa la validacion
        if(!verificarPassword) return next(null,false,{
            message:'Contraseña incorrecta',
        });
        //todo bien
        return next(null,usuario)
    }
));

passport.serializeUser(function(usuario,cb){
    cb(null,usuario);
});
passport.deserializeUser(function(usuario,cb){
    cb(null,usuario);
});

module.exports = passport;