angular.module('app', ['ngRoute', 'nemLogging', 'ui-leaflet']);

var app = angular.module('app');

var map = L.map('mapid');

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA'
}).addTo(map);
newMarkerGroup = L.LayerGroup();
map.on('click', addMarker);


//accesses location services to find spot on the map
function onLocationFound(e) {
    var radius = e.accuracy / 2;
    console.log(e.latlng);
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}


function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
  setView: true,
  maxZoom: 16,
});

// var marker = this.addMarker();

function addMarker(e){
    // Add marker to map at click location; add popup window
  var newMarker =
  new L.marker(e.latlng,{
    clickable: true,
    draggable: true,
    riseOnHover: true,
    riseOffset: 100
    }).addTo(map);
  // console.log(newMarker);
  newMarker.on('dragend', function(event){
    var changePos = event.target.getLatLng();
    console.log(changePos);
  });
  var popup =
    L.popup({
      maxWidth: 300,
      minWidth: 200,
      maxHeight: 400,
      autoPan: true,
      closeButton: true,
      offset: L.point(1000, 500)
    })
    .setLatLng(e.latlng)
    .setContent('<h1>Party at MIC</h1> <h2>2800 Woodlawn Dr #100, Honolulu, HI 96822</h2> <h3>Date: March 31, 2016 Time: 7:00pm - 10:00pm</h3><p>this is a an event at Manoa Innovation Center</p>');
    console.log(map);
  newMarker.bindPopup(popup);

}



