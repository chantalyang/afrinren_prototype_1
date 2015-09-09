var map;


// ------------- Initialise Map Function ------------ //
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
  });

  var target_ips = new google.maps.Data();
  var probes = new google.maps.Data();

   var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: 'orange',
    fillOpacity:1,
    scale: 4,
    strokeWeight: 1,
    strokeColor: 'black'
  };
  

  
  /* Setup physical map overlay */
  // http://jsfiddle.net/4cWCW/575/

  //Set bounds of overlay
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-41.97938439964395, -38.127905909394485),
      new google.maps.LatLng(55.107204794640154, 87.37057231783751));
 
 //Overlay settings
  var cableOverlay = new google.maps.GroundOverlay(
      '/overlays/links.png',
      imageBounds);
  cableOverlay.setOpacity(0.7)
  //cableOverlay.setMap(map);

  /* Setup target_ip Markers */
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
          content: "",
        });

  //Mouseover events listener
  target_ips.addListener('mouseover', function(event) {
 
        infoWindow.setContent(event.feature.getProperty("name") + "<br> <b>IP Address: </b>" + event.feature.getProperty("ip_address") );
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);
      });

  //Add target_ips to map
  target_ips.setMap(map);

  //Onclick events listener
  target_ips.addListener('click', function(event) { 
   // removeLine(traceroute_path); //Clear polyline everytime item is clicked

    var target_ip_lat = event.feature.getGeometry().get().G
    var target_ip_long = event.feature.getGeometry().get().K
    //console.log("TargetIP - lat:" + target_ip_lat + " long:" + target_ip_long);

   //Draw lines 
   var traceroute_path = new google.maps.Polyline({
    path: [{lat: target_ip_lat, lng:target_ip_long}, {lat:36.816352,lng:-1.280702 }],
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    geodesic: true,
    strokeColor: 'black',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

    addLine(traceroute_path);
    animateCircle(traceroute_path);

      });//End click event

   


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

   //Mouseover events listener
  probes.addListener('mouseover', function(event) {
 
        infoWindow.setContent(event.feature.getProperty("name") + 
                              "<br>" + "<b>Probe ID: </b> " + event.feature.getProperty("probe_id") +
                              "<br>" + " <b>ASN:</b>" + event.feature.getProperty("asn"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);
      });

   //Add layer to map
   probes.setMap(map);

  // For debugging
  //  target_ips.addListener('mouseover', function(event) {
  //   var target_ip_lat = event.feature.getGeometry().get().G
  //   var target_ip_long = event.feature.getGeometry().get().K
  //   console.log("TargetIP - lat:" + target_ip_lat + " long:" + target_ip_long);
  // });

  //  probes.addListener('mouseover', function(event) {
  //   var probe_lat = event.feature.getGeometry().get().G
  //   var probe_long = event.feature.getGeometry().get().K
  //   console.log("Probe - lat:" + probe_lat + " long:" + probe_long);

  // });

  


}// -------- End initialise map function ------------- //

function addLine(polyline){
  polyline.setMap(map)
}

function removeLine(polyline){
  polyline.setMap(null)
}

function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 20);
}
