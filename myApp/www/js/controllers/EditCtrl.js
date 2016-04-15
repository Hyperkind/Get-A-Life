angular.module('edit.controller', ['ui-leaflet', 'starter.factories'])

.controller('EditController', [
  '$scope',
  '$stateParams',
  'EventFactory',
  '$location',
  function($scope, $stateParams, EventFactory, $location){
    var vm = this;
    vm.title = null;
    vm.created_by = null;
    vm.description = null;
    vm.start_date = null;

    EventFactory.getEventById($stateParams.id)
      .then(function(res){
        var event = res.data;

        vm.title = event.title;
        vm.created_by = event.created_by;
        vm.description = event.description;
        vm.start_date = event.start_date;
      });
    console.log('$stateParams', $stateParams);
    // make sure on markup (html) differentiate DOM event from your $event, add '$'

    vm.editingEvent = function(){
      console.log(vm.description);
      var data = {
        title: vm.title,
        created_by: vm.created_by,
        description: vm.description,
        start_date: vm.start_date,
        };
      console.log('event', event);
      event.preventDefault();
      console.log('data', data);
      EventFactory.updateEvent(data, $stateParams.id)
      .then(function(editingEvent){
        console.log('returned edited event', editingEvent);
        console.log('stateParams.id', $stateParams.id);
        $location.path('/events');
      });
    };
  }
]);