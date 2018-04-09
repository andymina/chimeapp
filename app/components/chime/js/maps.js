window.onload = () => {

  map = L.map('map', {
    attributionControl: false,
    zoomControl: false,
  });

  L.control.zoom({
    position:'bottomleft'
  }).addTo(map);

  tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic3BlbGxldyIsImEiOiJjamNqdW5iazgzazI0MndudGh6NjVqM2xrIn0.VML7TdhGwdJlFXauBgwheQ'
  }).addTo(map);

  tileLayer.on('tileload', e => {
    sendAlert("tiles loaded: " + JSON.stringify(e));
  });

  // var blueIcon = new L.Icon({
  //   iconUrl: './marker-icon-2x-blue.png',
  //   shadowUrl: './marker-shadow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41]
  // });

  arrival = false; // Boolean that determines if the user is at the destination.
  pos = []; // Holds the user's current position.
  markers = L.featureGroup(); // Holds the origin and destination.
  origin = null;
  destination = null;

  document.addEventListener("message", data => {
    data = JSON.parse(data.data);
    switch (data.type) {
      case 'origin':
        changeOrigin(data.origin);
        break;
      case 'destination':
        arrival = false;
        changeDestination(data.destination, data.radius);
        break;
      case 'reset':
        clearMap();
        if (origin) {
          origin.addTo(map);
          origin.addTo(markers);
        }
        break;
      // case 'eval':
      //   eval(data.code);
      //   break;
    }
  });

};

sendAlert = (message) => {
  window.postMessage(JSON.stringify({
    type: 'alert',
    message: message
  }));
}

clearMap = () => {
  map.eachLayer((layer) => {
    if (layer._leaflet_id !== tileLayer._leaflet_id) {
      map.removeLayer(layer);
    }
  });
}

redrawMap = (params) => {
  // const fit = params.fit;
  markers = L.featureGroup();
  if (origin) {
    origin.addTo(map);
    origin.addTo(markers);
  }
  if (destination) {
    destination.addTo(map);
    destination.addTo(markers);
  }
  // if (fit) {
    map.fitBounds(markers.getBounds(), {
      padding: [20, 20]
    });
  // }
  if (destination && origin) {
    checkDestination();
  }
}

changeDestination = (coords, radius) => {
  clearMap();
  destination = L.circle(coords, {
    radius: Number(radius) * 1609.34,
  });
  redrawMap({fit: true});
}

changeOrigin = (coords) => {
  clearMap();
  origin = L.marker(coords/*, {icon: blueIcon}*/);
  redrawMap();
}

checkDestination = () => {
  if (((L.latLng(origin._latlng).distanceTo(destination._latlng)) < destination.getRadius()) && !arrival) {
    arrival = true;
    window.postMessage(JSON.stringify({
      type: 'arrived',
    }));
  }
}