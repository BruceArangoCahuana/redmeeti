import axios  from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const fromEliminar = document.querySelectorAll('.eliminar-comentario');
    //revisar si existe el comentario

    if(fromEliminar.length > 0){
        fromEliminar.forEach(form =>{
            form.addEventListener('submit',eliminarComentarios);
        })
    }
});

function eliminarComentarios(e){
    e.preventDefault();

    Swal.fire({
        title: 'Seguro quieres eliminar?',
        text: "Un comentario eliminado ya nose podra recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si,borrar!',
        cancelButtonText: 'cancelar'
      }).then((result) => {
          
        if (result.isConfirmed) {
          //tomar  el idcomentario
          const idcomentario = this.children[0].value;
          
          //crear comentario
          const datos = {
            idcomentario
          }
          axios.post(this.action,datos).then(repuesta => {
            Swal.fire(
                'Eliminado!',
                repuesta.data,
                'success'
              )
            //eliminar del DOM
            this.parentElement.parentElement.remove();
          }).catch(error =>{
              if(error.response.status === 403 || error.response.status === 404){
                Swal.fire(
                    'Error!',
                    error.response.data,
                    'error'
                  )
              }
            })
         
        }
      })

    
}