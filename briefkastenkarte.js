var map = new L.map('map').setView([50.7344700,7.0987190], 15);

var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Mitwirkende',
	opacity: 0.5
}).addTo(map);

var post_box_no_collection_times = new L.OverPassLayer({
	minzoom: 12,
	query: "(node(BBOX)[amenity=post_box]);out;",

	callback: function(data) {
		for(var i=0;i<data.elements.length;i++) {
			var e = data.elements[i];

			if (e.id in this.instance._ids) return;
			this.instance._ids[e.id] = true;
			var pos = new L.LatLng(e.lat, e.lon);
			var popup = this.instance._poiInfo(e.tags,e.id);

			var popup = '<h4>Briefkasten</h4><div>';
			if ((!e.tags.collection_times) && (!e.tags.operator) && (!e.tags.brand) && (!e.tags.ref)) {popup = popup + 'Keine weiteren Informationen verfügbar.<br>'};
			if (e.tags.collection_times) {popup = popup + '<b>Leerungsszeiten:</b> ' + e.tags.collection_times + '<br>'};
			if (e.tags.operator) {popup = popup + '<b>Betreiber:</b> ' + e.tags.operator + '<br>'};
			if (e.tags.brand) {popup = popup + '<b>Marke:</b> ' + e.tags.brand + '<br>'};
			if (e.tags.ref) {popup = popup + '<b>Standort:</b> ' + e.tags.ref + '<br>'};
			//if (e.tags.collection_times:lastcheck) {popup = popup + '<b>Zuletzt aktualisiert:</b> ' + e.tags.collection_times:lastcheck + '<br>'};

			var markerColor = e.tags.collection_times ? 'green':'red';

			var marker = L.AwesomeMarkers.icon({
				icon: 'envelope',
				prefix: 'fa',
				markerColor: markerColor,
				iconColor: 'white',
				spin:false
			});

			var marker = L.marker(pos, {icon: marker}).bindPopup(popup);

			this.instance.addLayer(marker);

		}
	}
}).addTo(map);

//var baseMaps = {
//	"Standard": OpenStreetMap_Mapnik
//};

//var overlayMaps = {
//	"Briefkästen (Fehlende Leerungszeiten)": post_box_collection_times,
//};

//L.control.layers(baseMaps, overlayMaps).addTo(map);
//L.control.layers(baseMaps).addTo(map);

new L.Control.GeoSearch({
	provider: new L.GeoSearch.Provider.OpenStreetMap()
}).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map)
//	.bindPopup("Du bist innerhalb von " + radius + " Meter von dieser Stelle.").openPopup();
//	L.circle(e.latlng, radius).addTo(map);

	var circle = L.circle(e.latlng, 800, {
//		color: 'red',
		stroke: false,
		fillColor: '#f03',
		fillOpacity: 0.1
	}).addTo(map);
	//L.circle(e.latlng, 800).addTo(map);
}

//Add locate control
L.control.locate({
    position: 'topleft',  // set the location of the control
    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
    follow: true,  // follow the user's location
    setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
    keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
    stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
    remainActive: false, // if true locate control remains active on click even if the user's location is in view.
    markerClass: L.circleMarker, // L.circleMarker or L.marker
    circleStyle: {
		//color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.2,
		stroke: false
    },  // change the style of the circle around the user's location
    markerStyle: {
		//color: 'red',
		fillColor: '#464646',
		fillOpacity: 1.0,
		stroke: false
	},
    //followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
    //followMarkerStyle: {},
    icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
    iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
    circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
    //metric: true,  // use metric or imperial units
    onLocationError: function(err) {alert(err.message)},  // define an error callback function
    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
            alert(context.options.strings.outsideMapBoundsMsg);
    },
    showPopup: false, // display a popup when the user click on the inner marker
    strings: {
        title: "Standort ermitteln",  // title of the locate control
    },
    locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);

//add scale control
L.control.scale().addTo(map);

//add permalink
map.addControl(new L.Control.Permalink({text: 'Permalink'}));

//var loadingControl = L.Control.loading({
//	spinjs: true
//});
//map.addControl(loadingControl);
