// var app = angular.module('app', ['ui-leaflet']);
var app = angular.module('app', ['ui-leaflet']);

app.controller('MapController', [
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

app.controller('EventController', [
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