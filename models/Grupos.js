const Sequelize = require('sequelize');
const bd = require('../config/bd');
const uuid = require('uuid-v4');
const Categorias = require('./Categorias');
const Usuario = require('./Usuario');


const Grupos = bd.define('grupos',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:uuid()
    },
    nombre:{
        type:Sequelize.TEXT(100),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El campo no pude ir vacio'
            }
        }
    },
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Coloca una descripcion'
            }
        }
    },
    url:Sequelize.TEXT,
    imagen:Sequelize.TEXT
});

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuario);

module.exports = Grupos;