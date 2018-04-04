window.onload = () => {

  document.body.firstElementChild.style.height = innerHeight + "px";
  document.body.firstElementChild.style.width = innerWidth + "px";

  map = L.map('map', {
    attributionControl: false,
    // zoomControl: false,
  });

  tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic3BlbGxldyIsImEiOiJjamNqdW5iazgzazI0MndudGh6NjVqM2xrIn0.VML7TdhGwdJlFXauBgwheQ'
  }).addTo(map);

  arrival = false; // Boolean that determines if the user is at the destination.
  pos = []; // Holds the user's current position.
  markers = L.featureGroup(); // Holds the origin and destination.
  origin = null;
  destination = null;

  document.addEventListener("message", data => {
    data = JSON.parse(data.data);
    switch (data.type) {
      case 'origin':
        changeOrigin(data.origin.latitude, data.origin.longitude);
        break;
      case 'destination':
        handleAddressSubmit(data.destination, data.radius);
        break;
    }
  });

};

handleAddressSubmit = (address, radius) => {
  if (address && radius) {
    arrival = false;
    const provider = new GeoSearch.GoogleProvider();
    provider.search({
        query: address.toLowerCase()
      })
      .then(res => {
        changeDestination(res[0].y, res[0].x, radius);
      });
  }
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

changeDestination = (lat, lng, radius) => {
  clearMap();
  destination = L.circle([lat, lng], {
    radius: Number(radius) * 1609.34,
  });
  redrawMap({fit: true});
}

changeOrigin = (lat, lng) => {
  clearMap();
  origin = L.marker([lat, lng]);
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