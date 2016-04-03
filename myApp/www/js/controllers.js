angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  angular.extend($scope, {
      center: {
       autoDiscover: true,
       zoom: 18

      },
      defaults: {
          tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png?access_token={accessToken}',
          attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          continuousWorld: false,
          maxZoom: 14,
          noWrap: true,
          path: {
              weight: 10,
              color: '#800000',
              opacity: 1
          }    
      }
    
      
  });
  $scope.markers = new Array();
  $scope.$on("leafletDirectiveMap.dblclick", function(event, args){
      var leafEvent = args.leafletEvent;
      $scope.markers.push({
          lat: leafEvent.latlng.lat,
          lng: leafEvent.latlng.lng,
          draggable: true,
          setContent: '<h1>Hello</h1>'
      });
  });
  // creates markers
});
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
 



// function onLocationFound(e) {
//     var radius = e.accuracy;
//     console.log(e.latlng);
//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();
//     L.circle(e.latlng, radius, {
//       color: 'red'
//       }).addTo(map)
//         .bindPopup("Your Location").openPopup();
// }
// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationfound', onLocationFound);
// map.on('locationerror', onLocationError);

//   L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA',
//     continuousWorld: false,
//     noWrap: true,
//     trackResize: true,
//     setView: true,
//     // closePopupOnClick: true
//     }).addTo(map);
//   newMarkerGroup = L.LayerGroup();

     // home button
// L.control.locate({
//   position: 'topright',
//   drawCircle: true,
//   follow: true,
//   icon: 'icon-location', 
//   iconLoading: 'icon-spinner  animate-spin',
//   setView: true,
//   remainActive: false
//   // stopFollwingOnDrag: false //DEPRICATED?
// }).addTo(map);

//    function onLocationFound(e) {
//     var radius = e.accuracy;
//     console.log(e.latlng);
//     L.marker(e.latlng).addTo(map)
//     .bindPopup("You are within " + radius + " meters from this point").openPopup();
//     L.circle(e.latlng, radius, {
//       color: 'red'
//       }).addTo(map)
//         .bindPopup("Your Location").openPopup();
// }
//   function onLocationError(e) {
//      alert(e.message);
//   }
  // map.on('locationfound', onLocationFound);
  // map.on('locationerror', onLocationError);

// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });
