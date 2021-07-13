import axios  from 'axios';

document.addEventListener('DOMContentLoaded',()=>{
    const asistencia  = document.querySelector('#confirmar-asistencia');
    if(asistencia){
        asistencia.addEventListener('submit',confirmarAsistencia);
    }
})

function confirmarAsistencia(e){
    e.preventDefault();
    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]');
    let accion = document.querySelector("#accion").value;
    const mensaje = document.querySelector('#mensaje')
   //limpìado la respuesta previa
   while(mensaje.firstChild){
       mensaje.removeChild(mensaje.firstChild);
   }
    const datos = {
        accion
    }

    axios.post(this.action,datos).then(
        respuesta=>{
            if(accion === 'confirmar'){
              //modifica los elementos del boton
              document.querySelector("#accion").value = 'cancelar';
              btn.value = 'cancelar';
              btn.classList.remove("btn-azul");
              btn.classList.add("btn-rojo");
            }else{
               //modifica los elementos del boton
               document.querySelector("#accion").value = 'confirmar';
               btn.value = 'asistir';
               btn.classList.remove("btn-rojo");
               btn.classList.add("btn-azul");
            }
            //mostrar mensaje
            mensaje.appendChild(document.createTextNode(respuesta.data));
            
            if(mensaje){
            setTimeout(() => {
                mensaje.remove();
            }, 3000);
            }
            
        })
}