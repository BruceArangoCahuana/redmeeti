const passport = require("passport");

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios' 
});

//revisa si el usuario esta autenticado mo no

exports.usuarioAutenticado = (req,res,next)=>{
    //si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect("/iniciar-sesion")
}
//cerrar sesion
exports.cerrarSesion = (req,res,next)=>{
    req.logout();
    req.flash('exito','Se cerrro correctamente la sesion');
    res.redirect("/iniciar-sesion")
    next();
}