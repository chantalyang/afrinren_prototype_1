var map;

// ------------- Initialise Map Function ------------ //
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 2,
    streetViewControl: false,
  });

  /* Setup physical map overlay */
  // http://jsfiddle.net/4cWCW/575/

  //Set bounds of overlay
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-41.97938439964395, -38.127905909394485),
      new google.maps.LatLng(55.107204794640154, 87.37057231783751));
 
 //Overlay settings
  cableOverlay = new google.maps.GroundOverlay(
      '/overlays/links.png',
      imageBounds);
  cableOverlay.setOpacity(0.7)
  //cableOverlay.setMap(map);

  /* Setup target_ip Markers */ 
  map.data.loadGeoJson("/data/target_ips.json");

  map.data.setStyle({
  icon: { 
    path: google.maps.SymbolPath.CIRCLE,
    scale:5,
    fillColor: '#f00',
    fillOpacity: 1,
    strokeWeight:0,
  },
  clickable: true
  });

  //For debugging
   map.data.addListener('mouseover', function(event) {
    console.log(event.feature.getProperty("name"))
  });



}// -------- End initialise map function ------------- //