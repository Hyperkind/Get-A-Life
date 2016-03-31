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
  $scope.$on("leafletDirectiveMap.dblclick", function(event, args) {
    var markerData = args.leafletEvent;
    console.log(markerData);
    console.log($scope.markers);
    $scope.markers.push({
      lat: markerData.latlng.lat,
      lng: markerData.latlng.lng,
      message: '<h1>New Event</h1>' + 
               '<form>' +
                  '<input type="text" name="title" placeholder="Title">' +
                  '<input type="text" name="location" placeholder="Location">' +
                  '<input type="text" name="date" placeholder="Date">' +
                  '<input type="text" name="time" placeholder="Time">' +
                  '<input type="file" name="img" multiple>' +
                  '<textarea name="description" wrap="physical" width="200"></textarea>' +
                '</form>' +
                '<button action="">Delete</button>' +
                '<button action="index" method="POST">ADD</button>',
      draggable: true

      

    });
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