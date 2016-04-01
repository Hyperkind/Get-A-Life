var app = angular.module('app');

app.controller("MapController", [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
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

  $scope.markers = [];
  $scope.events = [];
  EventFactory.getTktMstr()
  .then(function(events){
    $scope.events = events.data;
    console.log('events', events);
  });
  $scope.$on("leafletDirectiveMap.dblclick", function(event, args) {
    var markerData = args.leafletEvent;
    console.log(markerData);
    console.log($scope.markers);
    $scope.markers.push({
      lat: markerData.latlng.lat,
      lng: markerData.latlng.lng,
      //TODO: create a directive to replace create event html
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

app.controller("EventController", [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
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