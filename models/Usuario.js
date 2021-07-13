const Sequelize = require('sequelize');
const bd = require('../config/bd');
const bcrypt = require('bcrypt-nodejs');

const Usuario = bd.define('usuario',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(60)
    },
    imagen:{
        type:Sequelize.STRING(60)
    },
    descripcion:{
        type:Sequelize.TEXT,
    },
    email:{
        type:Sequelize.STRING(30),
        allowNull:false,
        validate:{
            isEmail:{msg: 'Agrega un correo valido'}
        },
        unique:{
            args:true,
            msg:'Usuario ya registrado'
        }
    },
    password:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{msg: 'El password no puede ir vacio'}
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken:Sequelize.DATE
},{
    hooks:{
        beforeCreate(usuario) {
            usuario.password = Usuario.prototype.hashPassword(usuario.password);
        },
    }
});

//metodo para comparar los password
Usuario.prototype.validarPassword =  function(password){
    return bcrypt.compareSync(password,this.password);
}
Usuario.prototype.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
}
module.exports = Usuario;