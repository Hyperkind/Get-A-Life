angular.module('starter.controllers', ['ui-leaflet', 'starter.factories', 'ngOpenFB'])


.controller('AppCtrl', function($scope, $ionicModal, $timeout, ngFB, $http, ENDPOINT) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(loginModal) {
    $scope.loginModal = loginModal;
  });

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log("LOGIN - user: " + $scope.loginData.username + " - PW: " + $scope.loginData.password);
    $http.post(ENDPOINT + '/api/login', $scope.loginData)
      .success(function(data) {
        $scope.loginData = {};
        $scope.todos = $scope.loginData;
        console.log('login successful');
      })
      .error(function(data) {
        console.log('Error: ' + $scope.loginData);
      });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

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
    $http.post(ENDPOINT + '/api/register', $scope.registerData)
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

  $ionicModal.fromTemplateUrl('templates/add-popup.html', {
    scope: $scope
  }).then(function(eventModal) {
    $scope.addEventModal = eventModal;
  });

  $scope.addEvent = function() {
    console.log('test');
    $scope.addEventModal.show();
  };

  $scope.closeEvent = function() {
    $scope.addEventModal.hide();
  };

  $scope.newEvent = {};
  $scope.doEvent = function() {
    console.log("EVENT - title: " + $scope.newEvent.title + " - date: " + $scope.newEvent.date + " - time: " + $scope.newEvent.time + " - description: " + $scope.newEvent.description);
    $http.post(ENDPOINT + '/api/events', $scope.newEvent)
    .success(function(data) {
      $scope.newEvent = {};
      $scope.todos  = $scope.newEvent;
      console.log('event created');
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

})

// .value('Coordinate',
//   {
//     lat: 21.3069,
//     lng: -157.8583,
//     draggable: true
//   }
// )

.controller('MapController', [
  '$scope',
  // 'Coordinate',
  'EventFactory',
  'leafletData',
  function  ($scope, EventFactory, leafletData) {
    angular.extend($scope, {
      center: {
        autoDiscover: true,
        zoom: 18
      }
    });
    console.log(leafletData);
    leafletData.getMap().then(function(map) {
      L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        attributionControl: true, 
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA',
        continuousWorld: false,
        noWrap: true,
        trackResize: true,
        setView: true,
      // closePopupOnClick: true
      }).addTo(map);
      // function onLocationFound(e) {
      // var radius = e.accuracy;
      //   console.log(e.latlng);
      //   L.marker(e.latlng).addTo(map)
      //   .bindPopup("You are within " + radius + " meters from this point").openPopup();
      //   L.circle(e.latlng, radius, {
      //     color: 'red'
      //     }).addTo(map)
      //       .bindPopup("Your Location").openPopup();
      // }
      // function onLocationError(e) {
      //    alert(e.message);
      // }
      // map.on('locationfound', onLocationFound);
      // map.on('locationerror', onLocationError);
      map.attributionControl.setPrefix('');

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
  'Coordinate',
  'EventFactory',
  function ($scope, Coordinate, EventFactory){
    $scope.coordinate = Coordinate;
    $scope.events = [];
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
]);

  // $scope.markers = new Array();
  // $scope.$on("leafletDirectiveMap.dblclick", function(event, args){
  //     var leafEvent = args.leafletEvent;
  //     $scope.markers.push({
  //         lat: leafEvent.latlng.lat,
  //         lng: leafEvent.latlng.lng,
  //         draggable: true,
  //         setContent: '<h1>Hello</h1>'
  //     });
  // });
  // creates markers
// function addMarker(e){
//   var newMarker =
//   new L.marker(e.latlng,{
//     clickable: true,
//     draggable: true,
//     riseOnHover: true,
//     riseOffset: 100
//     }).addTo(map);
//   newMarker.on('dragend', function(event){
//     var changePos = event.target.getLatLng();
//     console.log(changePos);
//   });
//   var popup =
//     L.popup({
//       maxWidth: 300,
//       minWidth: 200,
//       maxHeight: 400,
//       autoPan: true,
//       closeButton: true,
//       offset: L.point(1000, 500)
//     })
//     .setLatLng(e.latlng)
//     .setContent('<h2>Add Event</h2>' +
//                 '<form>' +
//                   '<input type="text" name="title" placeholder="Title">' +
//                   '<input type="text" name="location" placeholder="Location">' +
//                   '<input type="text" name="date" placeholder="Date">' +
//                   '<input type="text" name="time" placeholder="Time">' +
//                   '<input type="file" name="img" multiple>' +
//                   '<textarea name="description" wrap="physical" width="200"></textarea>' +
//                 '</form>' +
//                 '<button action="">Delete</button>' +
//                 '<button action="index" method="POST">ADD</button>');
//   newMarker.bindPopup(popup);
// }
// });


// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });
