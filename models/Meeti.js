const Sequelize = require('sequelize');
const bd = require('../config/bd');
const uuid = require('uuid-v4');
const slug = require('slug');
const shortId = require('shortid');

const Grupos = require('./Grupos');
const Usuario = require('./Usuario');

const Meeti = bd.define('meeti',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue: uuid()
    },
    titulo:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega un titulo'
            }
        }
    },
    slug:{
        type:Sequelize.STRING
    },
    invitado:{
        type:Sequelize.STRING
    },
    cupo:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    descripcion:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega una descripcion'
            }
        }
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega una fecha'
            }
        }
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega una hora'
            }
        }
    },
    direccion:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega una direccion'
            }
        }
    },
    ciudad:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega una ciudad'
            }
        }
    },
    estado:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega un estado o distrito'
            }
        }
    },
    pais:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Agrega un pais'
            }
        }
    },
    ubicacion:{
        type:Sequelize.GEOMETRY('POINT'),
    },
    intersados:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[]
    }
},{hooks:{
    async beforeCreate(meeti) {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${shortId.generate()}-${url}`;
    }
}});

Meeti.belongsTo(Grupos);
Meeti.belongsTo(Usuario);
module.exports = Meeti;