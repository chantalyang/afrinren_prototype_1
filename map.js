var map;


// ------------- Initialise Map Function ------------ //
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 2,
    streetViewControl: false,
  });

  var target_ips = new google.maps.Data();
  var probes = new google.maps.Data();

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

  // Setup target_ip Markers 
  target_ips.loadGeoJson("/data/target_ips/target_ips.json");

  target_ips.setStyle({
  icon: { 
    path: google.maps.SymbolPath.CIRCLE,
    scale:6,
    fillColor: 'blue',
    fillOpacity: 1,
    strokeWeight:0,
  },
  clickable: true
  });

  var  infoWindow = new google.maps.InfoWindow({
          content: ""
        });

  //Click events listener
  target_ips.addListener('click', function(event) {
 
        infoWindow.setContent(event.feature.getProperty("name"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);
      });

  //Add target_ips to map
  target_ips.setMap(map);


  /* Setup probe markers */
  probes.loadGeoJson("/data/probes/probes.json");

  probes.setStyle({
  icon: { 
    path: google.maps.SymbolPath.CIRCLE,
    scale:6,
    fillColor: 'red',
    fillOpacity: 1,
    strokeWeight:0,
  },
  clickable: true
  });

   //Click events listener
  probes.addListener('click', function(event) {
 
        infoWindow.setContent(event.feature.getProperty("name"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);
      });

   //Add layer to map
   probes.setMap(map);

  //For debugging
   target_ips.addListener('mouseover', function(event) {
    console.log(event.feature.getProperty("name"))
  });

  


}// -------- End initialise map function ------------- //