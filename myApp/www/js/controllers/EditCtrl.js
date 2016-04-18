angular.module('edit.controller', ['ui-leaflet', 'event.factories'])

.controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'EventFact',
  '$location',
  function($scope, $stateParams, EventFact, $location){
    // var vm = this;
    // vm.title = null;
    // vm.created_by = null;
    // vm.description = null;
    // vm.start_date = null;

    EventFact.getEventById($stateParams.id)
      .then(function(res){
        var event = res.data;
        $scope.title = event.title;
        $scope.created_by = event.created_by;
        $scope.description = event.description;
        $scope.start_date = event.start_date;
        $scope.category = event.category;
      });
    console.log('$stateParams', $stateParams);

    $scope.editEvent = function(){
      var data = {
        title: $scope.title,
        created_by: $scope.created_by,
        description: $scope.description,
        start_date: $scope.start_date,
        category: $scope.category
        };
      console.log('event', event);
      event.preventDefault();
      console.log('data', data);
      EventFact.updateEvent(data, $stateParams.id)
      .then(function(editingEvent){
        console.log('returned edited event', editingEvent);
        console.log('stateParams.id', $stateParams.id);
        $location.path('/events');
      });
    };
  }
]);