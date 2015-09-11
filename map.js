var map;
var probe_svg_path = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z";
var all_probes = [];
var all_target_ips = [];
var all_measurements = [];
var all_traceroutes = [];
var drawn_traceroutes =[];

// ------------- Initialise Map Function ------------ //
function initMap() {

  /* Initialise Variables */

  var target_ips = new google.maps.Data();
  var probes = new google.maps.Data();

  var line_symbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: 'orange',
    fillOpacity:1,
    scale: 4,
    strokeWeight: 1,
    strokeColor: 'black'
  };

  var target_ip_symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale:6,
    fillColor: 'blue',
    fillOpacity: 1,
    strokeWeight:1,
  };

  var selected_ip = null;
  var traceroute_path = null;

  /* Map initialisation */

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
  });

  /* Setup physical map overlay - http://jsfiddle.net/4cWCW/575/ */

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
    icon: target_ip_symbol,
    clickable: true
  });

  var  infoWindow = new google.maps.InfoWindow({
    content: "",
  });

  //Mouseover events listener
  var target_ip_mouseover_listener = target_ips.addListener('mouseover', function(event) {

        //Show infowindows
        infoWindow.setContent(event.feature.getProperty("name") + "<br> <b>IP Address: </b>" + event.feature.getProperty("ip_address") );
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);

        //Style
        if (selected_ip != null){ 
          //If an IP is selected, don't reset the style while mousing over
        } 
        else{
          target_ips.revertStyle();
          target_ips.overrideStyle(event.feature,
            {icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "blue",
              fillOpacity: 0.5,
              scale: 6,
              strokeColor: "white",
              strokeWeight:2,
            }
          }
          ); 
        } 

      });


    //On click events listener
    var target_ips_click_listener = target_ips.addListener('click', function(event) { 

      selected_ip = event.feature;
        //console.log(typeof selected_ip)

        //Style icon
        target_ips.revertStyle();//Reset the style of all target_ip clicks
        target_ips.overrideStyle(event.feature,
         {icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#0ece4b",
          fillOpacity: 1,
          scale: 9,
            //strokeColor: "white",
            strokeWeight:1,
          } 
        });

        if (drawn_traceroutes.length == 1){
          removeLine(drawn_traceroutes[0]);
          drawn_traceroutes = [];
        }
        
        // removeLine(traceroute_path); //Clear polyline everytime item is clicked

        var target_ip_lat = event.feature.getGeometry().get().G
        var target_ip_long = event.feature.getGeometry().get().K
        //console.log("TargetIP - lat:" + target_ip_lat + " long:" + target_ip_long);

       //Draw lines 
       var traceroute_path = new google.maps.Polyline({
        path: [{lat: target_ip_lat, lng:target_ip_long}, {lat:36.816352,lng:-1.280702 }],
        icons: [{
          icon: line_symbol,
          offset: '100%'
        }],
        geodesic: true,
        strokeColor: 'black',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

     drawn_traceroutes.push(traceroute_path);

     addLine(traceroute_path);
     animateArrow(traceroute_path);

      });//End click event

      //Add target_ips to map
      target_ips.setMap(map);


      /* Setup probe markers */

      probes.loadGeoJson("/data/probes/probes.json");
      probes.setStyle(styleProbeSymbol);

  // probes.setStyle({  
  // icon: { 
  //   path: google.maps.SymbolPath.CIRCLE,
  //   scale:6,
  //   fillColor: 'red',
  //   fillOpacity: 1,
  //   strokeWeight:0,
  // },
  // clickable: true
  // });

   //Mouseover events listener
   var probe_mousover_listener = probes.addListener('mouseover', function(event) {

        //Display infowindow
        infoWindow.setContent(event.feature.getProperty("name") + 
          "<br>" + "<b>Probe ID: </b> " + event.feature.getProperty("probe_id") +
          "<br>" + " <b>ASN:</b>" + event.feature.getProperty("asn"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);

        //Set styles for markers
        probes.revertStyle();
        probes.overrideStyle(event.feature,
          {icon: {
            path: probe_svg_path,
            fillColor: "red",
            fillOpacity: 0.5,
            strokeColor: "white", 
            strokeWeight:2,
            anchor: new google.maps.Point(15,10)}
          }
          ); 


      });//End event listener

   
   var probe_mouseout_listener = probes.addListener('mouseout', function(event) {
    probes.revertStyle(styleProbeSymbol);
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

//------------------- Add GeoJSON objects to array ----------------//


//--------------- Polylines methods ---------------------//
function addLine(polyline){
  polyline.setMap(map)
}

function removeLine(polyline){
  polyline.setMap(null)
}

//// Use the DOM setInterval() function to change the offset of the symbol at fixed intervals.
function animateArrow(line) {
  var count = 0;
  window.setInterval(function() {
      count = (count + 1) % 200; //increase % for time

      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
    }, 20);

}

//--------------- Styling functions ------------------//
function styleProbeSymbol(feature){
  var latitude = feature.getGeometry().get().G;
  var longitude = feature.getGeometry().get().K;
  var coordinates = new google.maps.LatLng(latitude + 500,longitude + 500);

  if (feature.getProperty("type") == "nren"){
    colour = "red";
  }

  else if (feature.getProperty("type") == "university"){
    colour = "orange";
  }

  return {
    icon: {
      path: probe_svg_path,
      scale: 1,
      fillColor: colour,
      fillOpacity:1,
      strokeWeight:1,
      strokeColor: "black",
      anchor: new google.maps.Point(15,10)
    },
      //icon: symbol,
      
      
    };


  }



