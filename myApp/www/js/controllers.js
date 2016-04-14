angular.module('starter.controllers', ['ui-leaflet', 'starter.factories'])

.controller('AppCtrl', [
  '$scope',
  '$filter',
  '$ionicModal',
  '$timeout',
  '$http',
  'ENDPOINT',
  function($scope, $filter,$ionicModal, $timeout, $http, ENDPOINT) {
  $scope.loginData = {};
   // console.log($scope.markerData);
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(loginModal) {
    $scope.loginModal = loginModal;
  });

  $scope.login = function() {
    $scope.loginModal.show();
  };

  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.isLoggedIn = {};
  $scope.doLogin = function() {
    console.log("LOGIN - user: " + $scope.loginData.username + " - PW: " + $scope.loginData.password);
    $http.post(ENDPOINT + '/login', $scope.loginData)
      .success(function(data) {
        $scope.loginData = {};
        $scope.todos = $scope.loginData;
        $scope.isLoggedIn = data;
        StorageService.add(data);
        console.log(data);
        console.log('login successful');
        StorageService.getAll();
      })
      .error(function(data) {
        console.log('Error: ' + $scope.loginData);
      });
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // $scope.things = StorageService.getAll();

  $scope.registerData = {};
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(registerModal) {
    $scope.registerModal = registerModal;
  });

  $scope.register = function() {
    $scope.registerModal.show();
  };

  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  $scope.newUser = function() {
    console.log("REGISTER - user: " + $scope.registerData.username + " - PW: " + $scope.registerData.password);
    $http.post(ENDPOINT + '/register', $scope.registerData)
      .success(function(data) {
        $scope.userData = {};
        $scope.todos = $scope.userData;
        console.log('new user created');
      })
      .error(function(data) {
        console.log('Error: ' + $scope.userData);
      });
    $timeout(function() {
      $scope.closeRegister();
    }, 1000);
  };

    //add event modal on marker click
  $ionicModal.fromTemplateUrl('templates/add-popup.html', {
    scope: $scope
  }).then(function(eventModal) {
    $scope.addEventModal = eventModal;
  });

  $scope.addEvent = function() {
    $scope.addEventModal.show();
  };

  $scope.closeEvent = function() {
    $scope.addEventModal.hide();
  };
    //toggle filter modal
  // $ionicModal.fromTemplateUrl('templates/mapfilter.html', {
  //   scope: $scope
  // }).then(function(filterModal) {
  //   $scope.openFilterModal = filterModal;
  // });

  // $scope.openFilter = function() {
  //   $scope.openFilterModal.show();
  // };

  // $scope.closeFilter = function() {
  //   $scope.openFilterModal.hide();
  // };

  $scope.newEvent = {};
  $scope.doEvent = function() {
    $http.post(ENDPOINT + '/api/events', $scope.newEvent)
    .success(function(data) {
      $scope.newEvent = {};
      $scope.todos  = $scope.newEvent;
    })
    .error(function(data) {
      console.log('Error: ' + $scope.newEvent);
    });
    $timeout(function(data) {
      $scope.closeEvent();
    }, 1000);
  };

  $scope.fbLogin = function() {
    ngFB.login({scope: 'email, publish_actions'})
      .then(function(response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $timeout(function() {
            $scope.closeLogin();
          }, 1000);
        } else {
          alert('Facebook login failed');
        }
      });
  };

  // TODO: finish configuring sharing events to FB
  $scope.share = function(event) {
    ngFB.api({
      method: 'POST',
      path: '/me/feed',
      params: {
        message: "I can share!"
      }
    })
    .then(function() {
      alert('The session was shared on Facebook');
    },
    function() {
      alert('An error occured while sharing this session on Facebook');
    });
  };

}])


//main map controller
.controller('MapController', [
  '$scope',
  'filterFilter',
  '$compile',
  '$ionicModal',
  'EventFactory',
  'leafletData',
  function  ($scope, filterFilter,$compile, $ionicModal, EventFactory, leafletData) {
    angular.extend($scope, {
      center: {
        autoDiscover: true,
        zoom: 18
      }
    });
    // 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png
  //'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png'
    leafletData.getMap().then(function(map) {
      // L.control.layers({
      //   'toner': L.tileLayer('http:c.tile.stamen.com/toner/{z}/{x}/{y}.png?access_token={accessToken}')

      // }).addToMap;
     L.tileLayer('http://c.tile.stamen.com/toner/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        attributionControl: true, 
        maxZoom: 18,
        // id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA',
        continuousWorld: false,
        noWrap: true,
        trackResize: true,
        setView: true,
      }).addTo(map);
     $scope.markerData = [];
     $scope.markers = [];
   
      EventFactory.getEvents()
      .then(function loadEventMarkers(events) {
        $scope.markerData = events.data;
        // console.log($scope.markerData.length);
        for (var i = 0; i < $scope.markerData.length; i++) {
          // console.log(i);
          var dataMarker = {
            lat: $scope.markerData[i].latitude,
            lng: $scope.markerData[i].longitude,
            message: $scope.markerData[i].title + 
                     // $scope.markerData[i].location_name +
                     $scope.markerData[i].venue_name +
                     $scope.markerData[i].address +
                     $scope.markerData[i].city+
                     $scope.markerData[i].zip+
                     $scope.markerData[i].category 
                     // $scope.markerData[i].post

          };

        $scope.markers.push(dataMarker); 
        }
        console.log($scope.markerData);
        $scope.allMarkers = $scope.markers;
        $scope.blueNote = filterFilter($scope.allMarkers, {venue_name:"Blue Note Hawaii"});

        var allM = L.layerGroup($scope.allMarkers);
        var bluenote = L.layerGroup($scope.blueNote);
        
        // console.log(bluenote);

        //  overlayMaps = {
        //   "All": allM ,
        //   "Blue Note": bluenote
        // };
        
      // L.control.layers(null, overlayMaps).addTo(map);
    
      //   console.log(allM);
    });
    

        //adds markers
      $scope.$on("leafletDirectiveMap.dblclick", function(event, args){
        var html = '<span ng-click="addEvent()">Add Event Here</span>';
        var newScope = $scope.$new(true);
        newScope.addEvent = $scope.addEvent; 
        console.log($compile(html)(newScope)[0]);
        var leafEvent = args.leafletEvent;
        $scope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "My Added Marker"
        });

          $scope.addEvent();
 
      });
      L.control.locate({
        position: 'topright',  // set the location of the control 
          layer: undefined,  // use your own layer for the location marker, creates a new layer by default 
          drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location 
          follow: true,  // follow the user's location 
          setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true 
          keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom) 
          stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below) 
          remainActive: true, // if true locate control remains active on click even if the user's location is in view. 
          markerClass: L.circleMarker, // L.circleMarker or L.marker 
          circleStyle: {},  // change the style of the circle around the user's location 
          markerStyle: {},
          followCircleStyle: {},  // set difference for the style of the circle around the user's location while following 
          followMarkerStyle: {},
          icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker 
          iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon 
          iconElementTag: 'span',  // tag for the icon element, span or i 
          circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds 
          metric: true,  // use metric or imperial units 
          // onLocationError: function(err) {alert(err.message)},  // define an error callback function 
          // onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries 
          //         alert(context.options.strings.outsideMapBoundsMsg);
          // },
          showPopup: true, // display a popup when the user click on the inner marker 
          strings: {
              title: "Show me where I am",  // title of the locate control 
              metersUnit: "meters", // string for metric units 
              feetUnit: "feet", // string for imperial units 
              popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle 
              outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds 
          },
          locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10 
      }).addTo(map);
  
     
    });
  
}])

    

  //event controller accesing tcktmaster and eventbrite

.controller("EventController", [
  '$scope',
  'EventFactory',
  'EventFactory',
  function ($scope, EventFactory){
    $scope.events = [];
    console.log($scope.events);
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
      console.log($scope.events);
    });

    $scope.newEvent = function(event){
      event.preventDefault();
      if ($scope.title){
        var data = {
          title: $scope.title,
          created_by: $scope.created_by,
          description: $scope.description,
          start_date: $scope.start_date,
        };
        EventFactory.postEvent(data)
        .then(function(newEvent){
          console.log('NEW event created!');
          $scope.events = $scope.events.concat(newEvent.data);
          $scope.title = '';
          $scope.created_by = '';
          $scope.description = '';
          $scope.start_date = '';
          $scope.latitude = '';
          $scope.longitude = '';
        });
      }
    };

    $scope.remove = function(event){
      var data = {
        title: $scope.title,
        created_by: $scope.created_by,
        description: $scope.description,
        start_date: $scope.start_date,
      };
      console.log(data);
      EventFactory.deleteEvent(data, event._id)
      .then(function(remove){
        EventFactory.getEvents()
        .then(function(events){
          $scope.events = events.data;
        });
      console.log(event._id);
      });
    };
  }
])

.controller('TktMstrController', [
  "$scope",
  'EventFactory',
  function($scope, EventFactory) {
    $scope.tktMstrEvents = [];
    $scope.evntBriteEvents = [];

    EventFactory.getTktMstr()
      .then(function(res) {
        $scope.tktMstrEvents = res.data;
        console.log('tktmstr', res.data);
      });

    EventFactory.getEvntBrite()
      .then(function(res) {
        $scope.evntBriteEvents = res.data;
        console.log('evntbrite', res.data);
      });

  }
])

.controller('UserController', [
  '$scope',
  'UserFactory',
  function($scope, UserFactory) {
    $scope.user = [];
    UserFactory.getUser()
    .then(function(user) {
      $scope.user = user.data;
      console.log($scope.user);
    });
  }
]);

 



// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });
