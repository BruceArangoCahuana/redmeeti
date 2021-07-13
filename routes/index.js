const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const usuarioControllers = require('../controllers/usuarioControllers');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');
const meetiControllerFE = require('../controllers/frontend/meetiControllerFE');
const usuarioControllerFe = require('../controllers/frontend/usuarioControllerFe');
const grupoControllerFe = require('../controllers/frontend/grupoControllerFe');
const comentariosControllerFE = require('../controllers/frontend/comentariosControllerFE');
const busquedaController = require('../controllers/frontend/busquedaController');

module.exports = function(){
    router.get("/",homeControllers.home);
    router.get('/meeti/:slug',
        meetiControllerFE.mostrarMeeti
    );
    //asistencia
    router.post('/confirmar-asistencia/:slug',
        meetiControllerFE.confirmarAsistencia
    )
    //ver asistente
    router.get("/asistentes/:slug",
        meetiControllerFE.mostrarAsistentes
    );

    router.post('/meeti/:id',
        authController.usuarioAutenticado,
        comentariosControllerFE.agregarComentario
    );

    //eliminar comentario
    router.post('/eliminar-comentario',
        authController.usuarioAutenticado,    
        comentariosControllerFE.EliminarComentario
        ); 

    //mostrar perfil de usuario
    router.get('/usuario/:id', usuarioControllerFe.mostrarPerfil)

    router.get('/grupos/:id',grupoControllerFe.mostrarGrupos)
    //busqueda
    router.get("/busqueda",busquedaController.buscar)
    // muestra grupo por categoria
    router.get('/categoria/:categoria',meetiControllerFE.mostrarCategoria)

    //crear cuenta de usuarios
    router.get("/crear-cuenta",usuarioControllers.fromCrearcuenta);
    router.post("/crear-cuenta",usuarioControllers.crearCuenta);
    router.get("/confirmar-cuenta/:correo",usuarioControllers.confirmarCuenta);
    //inicio de sesion
    router.get("/iniciar-sesion",usuarioControllers.formInicarsesion);
    router.post("/iniciar-sesion",authController.autenticarUsuario);
    router.get("/cerrar-sesion",
        authController.usuarioAutenticado,
        authController.cerrarSesion
    )
   
    //panel administracion 
    router.get('/administracion',
        authController.usuarioAutenticado,
        adminController.panelAdministracion
    );
    //nuevo grupos
    router.get('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.formGrupos
    )
    router.post('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.crearGrupo
    )
    router.get('/editar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.fromEditarGrupo
    )
    router.post('/editar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.EditarGrupo
    )

    //editar la imagen del grupo
    router.get('/imagen-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.formEditarImagen
    )
    router.post('/imagen-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.EditarImagen
    )
    router.get('/eliminar-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.formEliminar
    );
    router.post('/eliminar-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.EliminarGrupo
    );

    router.get('/nuevo-meeti',
        authController.usuarioAutenticado,
        meetiController.fromMeeti
    );

    router.post('/nuevo-meeti',
        authController.usuarioAutenticado,
        meetiController.santizisar,
        meetiController.guardarMeeti
    )

    router.get('/editar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.fromEditarMeeti
    )
    router.post('/editar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.EditarMeeti
    )

    //eliminar meeti's
    router.get('/eliminar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.EliminarMeeti
    )
    router.post('/eliminar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.EliminarMeetiDB
    );

    //editar perfil
    router.get('/editar-perfil',
        authController.usuarioAutenticado,
        usuarioControllers.formularioPerfil
    )
    router.post('/editar-perfil',
        authController.usuarioAutenticado,
        usuarioControllers.editarPerfil
    );

    //modificar cusco
    router.get('/cambiar-password',
        authController.usuarioAutenticado,
        usuarioControllers.cambiarPassword
    );

    router.post('/cambiar-password',
        authController.usuarioAutenticado,
        usuarioControllers.cambiarPasswordBaseDatos
    );

    //imagenes de perfil
    router.get('/imagen-perfil',
        authController.usuarioAutenticado,
        usuarioControllers.ImagenPefil
    );
    router.post('/imagen-perfil',
        authController.usuarioAutenticado,
        usuarioControllers.subirImagen,
        usuarioControllers.GuaradarImagenPefil
    )
    
    return router;
}
