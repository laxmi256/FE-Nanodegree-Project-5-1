//Global variables
var map;
var infowindow;
var markers = [];
var autocomplete;

//list of neighborhood places for displaying in the google map 
var myViewModel = {
	neighborhoods: [  
	{id: 0, lat: 13.035770, lng: 77.597022, name: 'Hebbal', city: 'Bengaluru', visibility: true},
    {id: 1, lat: 13.033420, lng: 77.563976, name: 'Mathikere', city: 'Bengaluru', visibility: true},
    {id: 2, lat: 12.950743, lng: 77.584777, name: 'Lalbagh Botanical Garden', city: 'Bengaluru', visibility: true},
    {id: 3, lat: 12.925007, lng: 77.593803, name: 'Jayanagar', city: 'Bengaluru', visibility: true},
    {id: 4, lat: 12.910491, lng: 77.585717, name: 'J P Nagar', city: 'Bengaluru', visibility: true},
    {id: 5, lat: 12.960986, lng: 77.638732, name: 'Domlur', city: 'Bengaluru', visibility: true},
    {id: 6, lat: 13.011560, lng: 77.551360, name: 'ISKCON Bangalore', city: 'Bengaluru', visibility: true},
    {id: 7, lat: 13.019568, lng: 77.596813, name: 'R T Nagar', city: 'Bengaluru', visibility: true},
	{id: 8, lat: 12.916576, lng: 77.610116, name: 'BTM Layout', city: 'Bengaluru', visibility: true},
	{id: 9, lat: 12.942117, lng: 77.575361, name: 'Basavanagudi', city: 'Bengaluru', visibility: true},
	{id: 10, lat: 12.942745, lng: 77.509101, name: 'Bangalore University', city: 'Bengaluru', visibility: true},
	{id: 11, lat: 12.908136, lng: 77.647608, name: 'HSR Layout', city: 'Bengaluru', visibility: true},
	{id: 12, lat: 12.981715, lng: 77.628559, name: 'Ulsoor', city: 'Bengaluru', visibility: true},
	{id: 13, lat: 12.927923, lng: 77.627108, name: 'Koramangala', city: 'Bengaluru', visibility: true},
	{id: 14, lat: 13.027966, lng: 77.540916, name: 'Yeshwanthpur', city: 'Bengaluru', visibility: true},
	{id: 15, lat: 13.028513, lng: 77.519676, name: 'Peenya', city: 'Bengaluru', visibility: true},
	{id: 16, lat: 12.971892, lng: 77.641155, name: 'Indiranagar', city: 'Bengaluru', visibility: true},
	{id: 17, lat: 12.925453, lng: 77.546757, name: 'Banashankari', city: 'Bengaluru', visibility: true},
	{id: 18, lat: 13.018444, lng: 77.678122, name: 'Ramamurthy Nagar', city: 'Bengaluru', visibility: true}]};


//This is the function initiated from the google map api
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

	infowindow = new google.maps.InfoWindow({maxWidth: 500});

	//looping through the neighborhoods
	for (var i = 0; i < myViewModel.neighborhoods.length; i++) {
		var data = myViewModel.neighborhoods[i];
		var title = data.name +	'\n' + '(' + data.lat +	', ' + data.lng + ')';		  
		
		var marker = new google.maps.Marker({
			position: data,
			map: map,
			title: title,
			zoom: 12
		});
		
		markers.push(marker);
		marker.addListener('click', (function(markerCopy, dataCopy) {
			return function() {				
				var articleList = [];
				var wikiElem = "";
				var content = "";
				getContent(dataCopy.name).success(function (response) {
					articleList = response[1];
					
					//Displaying only one wikipedia link for each place	  		   
					articleStr = articleList[0];
					var url = 'http://en.wikipedia.org/wiki/' + articleStr;
					wikiElem = '<a href="' + url + '">' + url + '</a>';
					content = '<div><strong>' + data.name + ', ' + data.city +
				    '</strong><br>' + 'Latitude : ' + data.lat +
				    ', Longitude : ' + data.lng + '<br>' +
				    '<strong>Relevant Wikipedia Link :</strong><br>' +
				    wikiElem.toString() + '</div>';
					animateMarker(markerCopy, content);
				});
			};
		})(marker, data));
	}
	ko.applyBindings(myViewModel);
}

//Callback function
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var marker = createMarker(results[i]);	
			markers.push(marker);
		}
	}
}

//This function is used to create markers for each place location
//contains the event handler for the marker click event
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

//This function is used to animate the marker and display the info window
//After a specified interval of 2200 ms, the animation is stopped
//But the info window needs to be closed manually
function animateMarker(marker, content) {
	infowindow.setContent(content);
	infowindow.open(map, marker);
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function() {
		marker.setAnimation(null);
		//infowindow.close();
	}, 2200);
}

//the text in the search box is set to null
myViewModel.placeToSearch = ko.observable("");

//This function is used to filter the list contents based on the value in the search box
//Also sets the visibility of each list value accordingly
myViewModel.places = ko.computed(function() {
    var q = myViewModel.placeToSearch().toLowerCase();
	return myViewModel.neighborhoods.filter(function(i) {
		i.visibility = i.name.toLowerCase().indexOf(q) >= 0;
		var retVal = i.visibility;
		return retVal;
    });
});

//This function is used to hide/show the markers based on the list contents
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

//This function is called when any list item is clicked
//It calls the animateMarker function to animate
//the corresponding marker and display the info window
myViewModel.listItemClicked = function(data) {
	var articleList = [];
	var wikiElem = "";
	var content = "";
	getContent(data.name).success(function (response) {
		articleList = response[1];
		
		//Displaying only one wikipedia link for each place
		articleStr = articleList[0];
		var url = 'http://en.wikipedia.org/wiki/' + articleStr;
		wikiElem = '<a href="' + url + '">' + url + '</a>';
		content = '<div><strong>' + data.name + ', ' + data.city +
				  '</strong><br>' + 'Latitude : ' + data.lat +
				  ', Longitude : ' + data.lng + '<br>' +
				  '<strong>Relevant Wikipedia Link :</strong><br>' +
				  wikiElem.toString() + '</div>';
		animateMarker(markers[data.id], content);
	});
};

//This function contains an AJAX request to third-party server Wikipedia
//to get the wikipedia link for the corresponding place
function getContent(data) {
	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + data + '&format=json&callback=wikiCallback';
	return $.ajax(wikiUrl, {
		dataType: 'jsonp'
	});
}