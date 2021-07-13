import{OpenStreetMapProvider} from 'leaflet-geosearch';
import asistencia from './asistencia';
import eliminarComentario from './eliminarComentario';

//obtener los valores de la base de datos

const lat = document.querySelector('#lat').value || -12.176951;
const lng = document.querySelector('#lng').value || -77.012787;
const direccion = document.querySelector('#direccion').value || ''; 
const geocodeService = L.esri.Geocoding.geocodeService();

const  map = L.map('mapa').setView([lat, lng], 15);
let markets = new L.FeatureGroup().addTo(map);
let market;
//colocar el pin en edicion
if(lat && lng){
    market =  new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    }).addTo(map).bindPopup(direccion).openPopup();
    //asignar al contenedor
    markets.addLayer(market)

     //detectar el movimiento del market
     market.on('moveend',function(e){
        market = e.target;
        const posicion = market.getLatLng();
        map.panTo(new L.LatLng(posicion.lat,posicion.lng));
        //reverse gecoding,cuando se reubica el pin
        geocodeService.reverse().latlng(posicion,15).run(function(error,result){
            llenarResultado(result) 
            //asigna los valores delm popup
            market.bindPopup(result.address.LongLabel);
          })
    })
  
}

document.addEventListener('DOMContentLoaded',()=>{
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    //buscar la direccion
    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input',buscarDireccion);
});

const buscarDireccion = (e)=>{
    if(e.target.value.length > 8){
        //si existe un pin anterior limpiarlo
        markets.clearLayers();
        //utilizar el provider
        
        const provider = new OpenStreetMapProvider();
        provider.search({query:e.target.value}).then((resultado)=>{
            geocodeService.reverse().latlng(resultado[0].bounds[0],15).run(function(error,result){
            llenarResultado(result)    
            //mostrar en el mapa
            map.setView(resultado[0].bounds[0],15);
            //agregar el ping
            market =  new L.marker(resultado[0].bounds[0],{
                draggable:true,
                autoPan:true
            }).addTo(map).bindPopup(resultado[0].label).openPopup();
            //asignar al contenedor
            markets.addLayer(market)

            //detectar el movimiento del market
            market.on('moveend',function(e){
                market = e.target;
                const posicion = market.getLatLng();
                map.panTo(new L.LatLng(posicion.lat,posicion.lng));
                //reverse gecoding,cuando se reubica el pin
                geocodeService.reverse().latlng(posicion,15).run(function(error,result){
                    llenarResultado(result) 
                    //asigna los valores delm popup
                    market.bindPopup(result.address.LongLabel);
                  })
                })
            })
        })
    }
}

function llenarResultado(resultado){
    document.querySelector('#direccion').value = resultado.address.Address || '';
    document.querySelector('#ciudad').value = resultado.address.City || '';
    document.querySelector('#estado').value = resultado.address.Region || '';
    document.querySelector('#pais').value = resultado.address.CountryCode || '';
    document.querySelector('#lat').value = resultado.latlng.lat || '';
    document.querySelector('#lng').value = resultado.latlng.lng || '';
}

