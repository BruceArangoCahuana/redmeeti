const Sequelize = require('sequelize');
const bd = require('../config/bd');

const Categorias = bd.define('categorias',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
   nombre:{
    type:Sequelize.TEXT
   },
   slug:Sequelize.TEXT
});

module.exports = Categorias;