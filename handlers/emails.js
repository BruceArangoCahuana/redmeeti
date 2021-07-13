const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

//configuracion envio de correo
let trasnport =  nodemailer.createTransport({
    host:emailConfig.host,
    port:emailConfig.port,
    secure: true,
    auth:{
        user:emailConfig.user,
        pass:emailConfig.pass
    }
});

exports.enviarEmail = async(opciones)=>{
    //lleer el archivo para eñ email
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;
    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo,'utf8'));
    //crear html
    const html = compilado({ url: opciones.url });
    //configurar opciones de email
    const opcionesEmail = {
        from:'Metti<noreply',
        to:opciones.usuario.email,
        subject:opciones.subject,
        html
    }
    //enviar email
    const sendEmail =  util.promisify(trasnport.sendMail,trasnport);
    return sendEmail.call(trasnport,opcionesEmail);
}