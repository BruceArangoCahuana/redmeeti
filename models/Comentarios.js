const Sequelize =  require('sequelize');
const bd = require('../config/bd');
const Usuarios = require('./Usuario');
const Meeti = require('./Meeti');

const Comentarios = bd.define('comentarios',{
  id:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true
  },
  mensaje:{
    type:Sequelize.TEXT
  } 
},{
    timestamps:false
})

Comentarios.belongsTo(Usuarios);
Comentarios.belongsTo(Meeti);


module.exports = Comentarios;