var app = angular.module('app');

app.controller("MapController", [
  '$scope',
  'Coordinate',
  'EventFactory',
  function($scope, Coordinate, EventFactory){
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

  $scope.coordinate = Coordinate;
  $scope.markers = [Coordinate];
  // $scope.events = [];
  // EventFactory.getTktMstr()
  // .then(function(events){
  //   $scope.events = events.data;
  //   console.log('events', events);
  // });
  $scope.$on("leafletDirectiveMap.dblclick", function(event, args) {
    var markerData = args.leafletEvent;
    console.log('markerData lat ' + markerData.latlng.lat + 'markerData lng ' + markerData.latlng.lng);

    Coordinate.lat = markerData.latlng.lat;
    Coordinate.lng = markerData.latlng.lng;

    //single click
    // $scope.markers.push({
    //   lat: markerData.latlng.lat,
    //   lng: markerData.latlng.lng,
    //   message: '<div>Add New Event</div><a href="/#/mapNew"> + </a>',
    //   draggable: true

    //   });
    });
  }
]);

app.controller("EventController", [
  '$scope',
  'Coordinate',
  'EventFactory',
  function($scope, Coordinate, EventFactory){
    $scope.coordinate = Coordinate;
    $scope.events = [];
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
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
      });
    };
  }
]);

app.controller('EditController', [
  '$scope',
  '$routeParams',
  'EventFactory',
  '$location',
  function($scope, $routeParams, EventFactory, $location){
    EventFactory.getEventById($routeParams.id)
    .then(function(res){
      var event = res.data;

      $scope.title = event.title;
      $scope.created_by = event.created_by;
      $scope.description = event.description;
      $scope.start_date = event.start_date;
    });
    console.log('$routeParams', $routeParams);
    // make sure on markup (html) differentiate DOM event from your $event, add '$'
    $scope.editingEvent = function(event){
      var data = {
        title: $scope.title,
        created_by: $scope.created_by,
        description: $scope.description,
        start_date: $scope.start_date,
        };
      event.preventDefault();
      EventFactory.updateEvent(data, $routeParams.id)
      .then(function(editingEvent){
        $location.path('/');
      });
    };
  }
]);

app.controller('TktMstrController', [
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