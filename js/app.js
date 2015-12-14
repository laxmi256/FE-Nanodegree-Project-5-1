var map;
var infowindow;
var markers = [];
var autocomplete;

var myViewModel = {
  neighborhoods: [   
  {lat: 13.062342, lng: 77.587103, name: 'Sahakara Nagar, Bangalore'},
  {lat: 13.052765, lng: 77.541899, name: 'Jalahalli, Bangalore'},
  {lat: 12.950743, lng: 77.584777, name: 'Lalbagh Botanical Garden, Bangalore'},
  {lat: 12.979240, lng: 77.657526, name: 'Bagmane Techpark, Bangalore'},
  {lat: 12.925007, lng: 77.593803, name: 'Jayanagar, Bangalore'},
  {lat: 12.910491, lng: 77.585717, name: 'J P Nagar, Bangalore'},
  {lat: 12.985650, lng: 77.605693, name: 'Shivaji Nagar, Bangalore'},
  {lat: 12.960986, lng: 77.638732, name: 'Domlur, Bangalore'},
  //{lat: 13.011560, lng: 77.551360, name: 'ISKCON, Bangalore'},
  {lat: 12.990058, lng: 77.552492, name: 'Rajaji Nagar, Bangalore'},
  {lat: 12.971916, lng: 77.529886, name: 'VijayaNagar, Bangalore'},
  {lat: 13.019568, lng: 77.596813, name: 'R T Nagar, Bangalore'},
  {lat: 13.028005, lng: 77.639971, name: 'Kalyan Nagar, Bangalore'} ]
};

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
        position: google.maps.ControlPosition.TOP_CENTER
		}						
	});
	
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: bglr,
		radius: 20000,		
		types: ['hindu_temple']	
	}, callback);
	
	
	var input = document.getElementById('input');
	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
	
	var list = document.getElementById('list');
	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
	
	infowindow = new google.maps.InfoWindow();	
	autocomplete.addListener('place_changed', onPlaceChanged);
	autocomplete.addListener('click', onPlaceChanged);
	
	for (var i = 0; i < myViewModel.neighborhoods.length; i++) {
		var title = myViewModel.neighborhoods[i].name +
					'\n' + '(' +
				    myViewModel.neighborhoods[i].lat +
					', ' +
					myViewModel.neighborhoods[i].lng + ')';
		var content = '<div><strong>' + myViewModel.neighborhoods[i].name +
					'</strong><br>' + 'Latitude : ' +
				    myViewModel.neighborhoods[i].lat + ', Longitude : ' +
					myViewModel.neighborhoods[i].lng + '</div>';
					
		var marker = new google.maps.Marker({
		position: myViewModel.neighborhoods[i],
		map: map,
		title: title		
		});
		
		markers.push(marker);				
		marker.addListener('click', (function(markerCopy, contentCopy) {
			return function() 
			{ 			
				animateMarker(markerCopy, contentCopy);
			};
		})(marker, content));
	} 
}


function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {  
	
    for (var i = 0; i < results.length; i++) {	
        var marker = createMarker(results[i]);	
		markers.push(marker);
	}	
  }  
  ko.applyBindings(new MyViewModel(results));  
}


function onPlaceChanged()
{
	var place = autocomplete.getPlace();	
	var icon = {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        strokeColor: "blue",
        scale: 4
		};		
	var placeLoc = place.geometry.location;
	var title = place.name + '\n' + placeLoc;
	var content;
	if(place.name == place.vicinity)
	{
		content = '<div><strong>' + place.name +
				  '</strong><br>' + 'Latitude/Longitude : ' +				  
				  placeLoc + '</div>';
	}
	else
	{
		content = '<div><strong>' + place.name + '</strong><br>' + place.vicinity +'</div>';
	}
	
	var marker = createMarker(place,icon);
	animateMarker(marker, content);	
	window.setTimeout(function() {
		marker.setMap(null);	
	}, 2200);
}


function animateMarker(marker, content){
	infowindow.setContent(content);        	
	infowindow.open(map, marker);	
	marker.setAnimation(google.maps.Animation.BOUNCE);	
	window.setTimeout(function() {
		marker.setAnimation(null);
		infowindow.close();		
	}, 2200);
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


// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}


/*function MyViewModel(arrPlaces) {

	var self = this;	
	
	self.placeToSearch = ko.observable("");
    self.places = ko.observableArray([	neighborhoods[0].name,
										neighborhoods[1].name,
										neighborhoods[2].name,
										neighborhoods[3].name,
										neighborhoods[4].name,
										neighborhoods[5].name,
										neighborhoods[6].name,
										neighborhoods[7].name,
										neighborhoods[8].name,
										neighborhoods[9].name,
										neighborhoods[10].name,
										neighborhoods[11].name,
										arrPlaces[0].name,
										arrPlaces[1].name,
										arrPlaces[2].name,
										arrPlaces[3].name,
										arrPlaces[4].name,
										arrPlaces[5].name,
										arrPlaces[6].name,
										arrPlaces[7].name,
										arrPlaces[8].name,
										arrPlaces[9].name,
										arrPlaces[10].name,
										arrPlaces[11].name,
										arrPlaces[12].name,
										arrPlaces[13].name,
										arrPlaces[14].name,
										arrPlaces[15].name,
										arrPlaces[16].name,
										arrPlaces[17].name,
										arrPlaces[18].name,
										arrPlaces[19].name
									]);				
        		 		 
		self.searchPlace = function () {
        //if ((self.placeToSearch() != "") && (self.places.indexOf(self.placeToSearch()) < 0)) 
		//{
		alert("hiii");
		deleteMarkers();
        //self.places.push(self.placeToSearch());
		//}
        //self.placeToSearch(""); // Clear the text box
		};			
     }
  */

myViewModel.placeToSearch = ko.observable('');

myViewModel.places = ko.computed(function() {
    var q = myViewModel.placeToSearch();
    return myViewModel.neighborhoods.filter(function(i) {
      return i.name.toLowerCase().indexOf(q) >= 0;
    });
});

ko.applyBindings(myViewModel);  