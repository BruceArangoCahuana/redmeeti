const path = require('path');
const express = require('express');
const router = require('./routes');

const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParse =  require('cookie-parser');
const expressLayout = require('express-ejs-layouts');

//conexion a la base de datos
const bd =require('./config/bd');
require('./models/Usuario');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');
require('./models/Comentarios');
bd.sync().then(()=>console.log('conectado a la  database')).catch((error)=>console.log(error));


require('dotenv').config({path:'variables.env'});

const app = express();
//archivo staticos
app.use(express.static('public'));
//habilitar body-parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(expressValidator());
//habilitar  EJS como template engine
app.use(expressLayout);
app.set('view engine','ejs');


//ubicacion de la vistas
app.set('views',path.join(__dirname,'./views'));



//habilitar cookie parse
app.use(cookieParse());

//crear la session
app.use(session({
    secret:process.env.SECRET,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false
}));

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//agrega flash message
app.use(flash());

//creacion de propio midelware(usuario,flash errores ,año)
app.use((req,res,next)=>{
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes =  req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

//de donde comienza el ruting
app.use('/',router());
//leer el host y el purto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
//le damos el puerto
app.listen(port,host,()=>{
    console.log("Servidor todo listo...!");
});