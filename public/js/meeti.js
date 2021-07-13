document.addEventListener('DOMContentLoaded',()=>{
    if(document.querySelector('#ubicacion-meeti')){
        mostrarMapa();
    }
})

const lat  = document.querySelector('#lat').value;
const lng = document.querySelector('#lng').value;
const ubicacionMapa = document.querySelector('#direccionMapa').value;
function mostrarMapa(){
    var map = L.map('ubicacion-meeti').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(ubicacionMapa)
        .openPopup();
}