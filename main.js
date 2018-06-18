// declaring global variables
var place,edges,marker;
var openWindow;
// request for JSON of foursquare data
var clientID,clientSecret;
// to get map ocation for our requriment
function map() {
    var Bhimavarm = {
        lat: 16.5443199,
        lng: 81.5169033
    };
    place = new google.maps.Map(document.getElementById('googlemap'), {
        zoom: 13,
        center: Bhimavarm,
        mapTypeControl: false
    });
    openWindow = new google.maps.InfoWindow();
    edges = new google.maps.LatLngBounds();   
    ko.applyBindings(new Desgin());
}
//set the Bounce function for marker
function setBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 1400);
    }
  }
// to get places of my interest
  var  places = [
      {
        heading: 'Railway Station',
        location: 
        {
          lat:16.5442,
          lng:81.5375
        }
      },  
      {
        heading: 'Famous Hotel',
        location: 
        {
          lat: 16.5443199,
          lng: 81.5169033
        }
      },
       {
        heading: 'Bus Station',
        location: 
        {
          lat: 16.5443195,
          lng: 81.5169033
        }
      }, 
      {
        heading: 'Famous Temple',
        location: 
        {
          lat: 16.5428,
          lng: 81.5234113
        }
      }, 
      {
        heading: 'Andhra college',
        location: 
        {
          lat: 16.483458,
          lng: 81.569175    
        }
      }, 
      {
        heading: 'Top College',
        location: 
        {
          lat: 16.5674794,
          lng: 81.5217052
        }
      }
    ];
//this function is used to show the location
var showlocation = function(content) {
    var self = this;
    this.heading = content.heading;
    this.position = content.location;
    this.street = '',
    this.city = '',
    this.phone = '';
    this.visible = ko.observable(true);
    clientID = 'IOFGXD5DVOVP5PFNTT0A4W4BBW2GGXFTFUAYMRA14ONNSPLX';
    clientSecret = 'D2NTW55O1HDJSNYZ3BBKWHKNDZFADC0AE4D5HIULPSURNZYV';
    // storing the position variable with location 
    var link = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.heading;
    $.getJSON(link).done(function(content) {
		var output = content.response.venues[0];
        self.street = output.location.formattedAddress[0] ? output.location.formattedAddress[0]: 'No street found';
        self.city = output.location.formattedAddress[1] ? output.location.formattedAddress[1]: 'No City found';
        self.phone = output.contact.formattedPhone ? output.contact.formattedPhone : 'No phone found';
    }).fail(function() {
        alert('Oops!! some wrong with API foursquare');
    });
    this.marker = new google.maps.Marker({
        position: this.position,
        heading: this.heading,
        animation: google.maps.Animation.DROP,
        icon: marker
    });    
    self.remove = ko.computed(function () {
        if(self.visible() === true) {
            self.marker.setMap(place);
            edges.extend(self.marker.position);
            place.fitBounds(edges);
        } else {
            self.marker.setMap(null);
        }
    });    
    this.marker.addListener('click', function() {
        infoAttract(this, self.street, self.city, self.phone, openWindow);
        setBounce(this);
        place.panTo(this.getPosition());
    });
    // show place selected from list
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };
    // show bounce effect when list is selected
    this.fall = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};
/* main design function*/
var Desgin = function() {
    var self = this;
    this.findplace = ko.observable('');
    this.some = ko.observableArray([]);
    // adding location for the selected
    places.forEach(function(location) {
        self.some.push( new showlocation(location) );
    });
    // places identified on map
    this.placelist = ko.computed(function() {
        var findfilter = self.findplace().toLowerCase();
        if (findfilter) {
            return ko.utils.arrayFilter(self.some(), function(location) {
                var str = location.heading.toLowerCase();
                var sink = str.includes(findfilter);
                location.visible(sink);
				return sink;
			});
        }
        self.some().forEach(function(location) {
            location.visible(true);
        });
        return self.some();
    }, self);
};
//this function make the openwindow when it is clicked
function infoAttract(marker, street, city, phone, openwindow) {
    if (openwindow.marker != marker) {
        openwindow.setContent('');
        openwindow.marker = marker;
        openwindow.addListener('closeclick', function() {
            openwindow.marker = null;
        });
        var streetview = new google.maps.StreetViewService();
        var radius = 50;
        var windowdata = '<h5>' + marker.heading + '</h5>' + 
            '<p>' + street + "</br>" + city + '</br>' + phone + "</p>";
        var getview = function (content, site) {
            if (site == google.maps.StreetViewStatus.OK) {
                var viewlocation = content.location.latLng;
                openwindow.setContent(windowdata);
            }
            else {
                openwindow.setContent(windowdata + '<div style="color: darkorchid">No Street View Found</div>');
            }
        };
        streetview.getPanoramaByLocation(marker.position, radius, getview);
        openwindow.open(place, marker);
    }
}
  //function to map error
function googleMapsError() {
    alert('Oops!An error.');
}
