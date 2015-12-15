var map;
var infowindow;
var markers = [];
var autocomplete;

var myViewModel = {
	neighborhoods: [  
	{id: 0, lat: 13.035770, lng: 77.597022, name: 'Hebbal, Bengaluru', visibility: true},
    {id: 1, lat: 13.033420, lng: 77.563976, name: 'Mathikere, Bengaluru', visibility: true},
    {id: 2, lat: 12.950743, lng: 77.584777, name: 'Lalbagh Botanical Garden, Bengaluru', visibility: true},
    {id: 3, lat: 12.979240, lng: 77.657526, name: 'Bagmane Techpark, Bengaluru', visibility: true},
    {id: 4, lat: 12.925007, lng: 77.593803, name: 'Jayanagar, Bengaluru', visibility: true},
    {id: 5, lat: 12.910491, lng: 77.585717, name: 'J P Nagar, Bengaluru', visibility: true},
    {id: 6, lat: 12.985650, lng: 77.605693, name: 'Shivaji Nagar, Bengaluru', visibility: true},
    {id: 7, lat: 12.960986, lng: 77.638732, name: 'Domlur, Bengaluru', visibility: true},
    {id: 8, lat: 13.011560, lng: 77.551360, name: 'ISKCON, Bengaluru', visibility: true},
    {id: 9, lat: 12.990058, lng: 77.552492, name: 'Rajaji Nagar, Bengaluru', visibility: true},
    {id: 10, lat: 12.971916, lng: 77.529886, name: 'VijayaNagar, Bengaluru', visibility: true},
    {id: 11, lat: 13.019568, lng: 77.596813, name: 'R T Nagar, Bengaluru', visibility: true},
    {id: 12, lat: 13.028005, lng: 77.639971, name: 'Kalyan Nagar, Bengaluru', visibility: true},
	{id: 13, lat: 12.916576, lng: 77.610116, name: 'BTM Layout, Bengaluru', visibility: true},
	{id: 14, lat: 12.942117, lng: 77.575361, name: 'Basavanagudi, Bengaluru', visibility: true},
	{id: 15, lat: 12.942745, lng: 77.509101, name: 'Bangalore University, Bengaluru', visibility: true},
	{id: 16, lat: 12.908136, lng: 77.647608, name: 'HSR Layout, Bengaluru', visibility: true},
	{id: 17, lat: 13.019145, lng: 77.646453, name: 'HRBR Layout, Bengaluru', visibility: true},
	{id: 18, lat: 12.981715, lng: 77.628559, name: 'Ulsoor, Bengaluru', visibility: true},
	{id: 19, lat: 13.011957, lng: 77.647131, name: 'Bansawadi, Bengaluru', visibility: true},
	{id: 20, lat: 12.927923, lng: 77.627108, name: 'Koramangala, Bengaluru', visibility: true},
	{id: 21, lat: 13.027966, lng: 77.540916, name: 'Yeshwanthpur, Bengaluru', visibility: true},
	{id: 22, lat: 13.028513, lng: 77.519676, name: 'Peenya, Bengaluru', visibility: true},
	{id: 23, lat: 12.971892, lng: 77.641155, name: 'Indiranagar, Bengaluru', visibility: true},
	{id: 24, lat: 12.925453, lng: 77.546757, name: 'Banashankari, Bengaluru', visibility: true},
	{id: 25, lat: 13.018444, lng: 77.678122, name: 'Ramamurthy Nagar, Bengaluru', visibility: true},]};

function initMap() {
	var bglr = {lat: 12.971599, lng: 77.594563};
	map = new google.maps.Map(document.getElementById('map'), {
		center: bglr,
		zoom: 12,
		
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.RIGHT_TOP
		},

		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		scaleControl: true,
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}
	});

	infowindow = new google.maps.InfoWindow();

	for (var i = 0; i < myViewModel.neighborhoods.length; i++) {
		var data = myViewModel.neighborhoods[i];
		var title = data.name +	'\n' + '(' + data.lat +	', ' + data.lng + ')';
		var content = '<div><strong>' + data.name + '</strong><br>' + 'Latitude : ' +
				      data.lat + ', Longitude : ' + data.lng + '</div>';

		var marker = new google.maps.Marker({
			position: data,
			map: map,
			title: title,
			zoom: 12
		});

		markers.push(marker);
		marker.addListener('click', (function(markerCopy, contentCopy) {
			return function() {
				animateMarker(markerCopy, contentCopy);
			};
		})(marker, content));
	}
	ko.applyBindings(myViewModel);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {	
			var marker = createMarker(results[i]);	
			markers.push(marker);
		}
	}
}

function createMarker(place,icon) {
	var placeLoc = place.geometry.location;
	var title = place.name + '\n' + placeLoc;
	var content = '<div><strong>' + place.name + '</strong><br>' + place.vicinity +'</div>';

    var marker = new google.maps.Marker({
		map: map,
		position: placeLoc,
		title: title,
		icon: icon
	});

	google.maps.event.addListener(marker, 'click', function() {
		animateMarker(marker, content);
	});
	return marker;
}

function animateMarker(marker, content) {
	infowindow.setContent(content);
	infowindow.open(map, marker);
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function() {
		marker.setAnimation(null);
		infowindow.close();
	}, 2200);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

function clearMarker(marker) {
	marker.setMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

function showMarker(marker) {
	marker.setMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}

myViewModel.placeToSearch = ko.observable("");

myViewModel.places = ko.computed(function() {
    var q = myViewModel.placeToSearch();
	return myViewModel.neighborhoods.filter(function(i) {
		i.visibility = i.name.toLowerCase().indexOf(q) >= 0;
		var retVal = i.visibility;
		return retVal;
    });
});

myViewModel.places.subscribe(function(newValue) {
	for(var i = 0; i<myViewModel.neighborhoods.length; i++)	{
		var data = myViewModel.neighborhoods[i];
		if(data.visibility == true) {
			markers[data.id].setMap(map);
	    }
	    else {
			markers[data.id].setMap(null);
		}
	}
});

myViewModel.listItemClicked = function(data) {
	var content = '<div><strong>' + data.name + '</strong><br>' + 'Latitude : ' +
				  data.lat + ', Longitude : ' + data.lng + '</div>';
	animateMarker(markers[data.id], content);
};