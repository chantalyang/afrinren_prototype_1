var map;
var Google

//Initialise Map Function
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 2,
    streetViewControl: false,
  });

  /* For physical map overlay */
  // http://jsfiddle.net/4cWCW/575/

  //Setbounds of overlay
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-41.97938439964395, -38.127905909394485),
      new google.maps.LatLng(55.107204794640154, 87.37057231783751));
 
 //Overlay settings
  cableOverlay = new google.maps.GroundOverlay(
      '/overlays/links.png',
      imageBounds);
  cableOverlay.setOpacity(0.7)
  cableOverlay.setMap(map);

  /* Markers */ 
  var marker = new google.maps.Marker({
    position: {lat: 0.070959, lng: 23.923482},
    title: "Marker"
  });

  var circ = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.8,
    //scale: 1,
    strokeColor: 'gold',
    strokeWeight: 14
  };

  //marker.setMap(map);
  map.data.loadGeoJson("/data/target_ips.json");
  map.data.setStyle({
  icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  })



}//End initialise map function