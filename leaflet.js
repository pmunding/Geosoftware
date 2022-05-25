//Leaflet Zeugs ___________________________________________________________________________________________________________

// initialize Leaflet
var map = L.map('map', {drawControl: true}
                //,{minZoom: 10}
               ).setView([51.975, 7.61], 13);

// add an OpenStreetMap tile layer
var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add the humanitarian OpenStreetMap layer
var hotOSM = new L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team'
}).addTo(map);


var geistviertelGeojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Geistviertel",
	 "popupContent": "Die Grenzen des Geistviertels!"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [7.62032, 51.95512],
                [7.62032, 51.95512],
                
            ]
        ]
    }
};

var overlay = L.geoJson(geistviertelGeojsonFeature);

//add layer switcher
var baseMaps = {
    "OSM": osm,
    "humanitarian OSM": hotOSM
};

var overlayMaps = {
    "Marker Ausblenden": overlay
};
L.control.layers(baseMaps, overlayMaps).addTo(map);



// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// define custom marker
var MyCustomMarker = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
  }
});

var drawPluginOptions = {
  position: 'topright',
  draw: {
    polyline: {
      shapeOptions: {
        color: '#FF0000',
        weight: 10
      }
    },
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#FF0000', // Color the shape will turn when intersects
        message: '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#FF0000'
      }
    },
    circle: false, // Turns off this drawing tool
    rectangle: {
      shapeOptions: {
        clickable: false
      }
    },
    marker: {
      icon: new MyCustomMarker()
    }
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};





// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);


var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);




map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }

  editableLayers.addLayer(layer);
});
