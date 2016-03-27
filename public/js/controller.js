var app = angular.module('app', ['ui-leaflet', 'nemLogging']);

app.controller("MapController", [
  '$scope',
  function($scope){
     angular.extend($scope, {
        defaults: {
          tileLayer: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
          MaxZoom: 18,
          path: {
              weight: 10,
              color: '#808080',
              opacity: 1
          }
        },
        center: {
         autoDiscover: true,
         zoom: 18
        }
     });
  $scope.markers = new Array();
  $scope.$on("leafletDirectiveMap.click", function(event, args) {
    var markerData = args.leafletEvent;
    console.log(markerData);
    $scope.markers.push({
      lat: markerData.latlng.lat,
      lng: markerData.latlng.lng,
      message: "New Marker"
    });
  });
  }
]);

app.controller("EventController", [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
    EventFactory.getEvents()
    .then(function(event){
      $scope.events = events.data;
    });

    $scope.newEvent = function(event){
      event.preventDefault();
      if ($scope.title){
        var data = {
          title: $scope.title,
          created_by: $scope.created_by,
          description: $scope.description,
        };
        EventFactory.postEvent(data)
        .then(function(newEvent){
          console.log('NEW event created!');
          $scope.events = newEvent.data;
          $scope.title = '';
          $scope.created_by = '';
          $scope.description = '';
        });
      }
    };
  }
  ]);

// app.controller('AutoCenter', [
//   '$scope',
//   function($scope) {
//     angular.extend($scope, {
//       center: {
//         autoDiscover: true
//       }
//     });
//   }
// ]);