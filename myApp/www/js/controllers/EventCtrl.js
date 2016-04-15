angular.module('event.controller', ['ui-leaflet', 'starter.factories'])

.controller("EventCtrl", [
  '$scope',
  'EventFactory',
  function ($scope, EventFactory){
    $scope.eventLists = {categories: null};
    $scope.events = [];
    $scope.register = {};
    $scope.register.defaultValue = "Select All";
    EventFactory.getEvents()
      .then(function(events){
        $scope.events = events.data;
        $scope.eventLists.categories = $scope.events.reduce(function (list, event) {
          if (list.indexOf(event.category) === -1) {
            list.push(event.category);
          }
          return list;
        }, ["Show All"]);
        // TODO: fix show all filter
        // $scope.filterList = $scope.eventLists.categories[0];
        $scope.filterList = function(data) {
          if (data.category === $scope.eventLists.categories) {
            return true;
          } else if ($scope.eventLists.categories[0]) {
            return true;
          } else {
            return false;
          }
        };


        console.log('res', $scope.eventLists.categories);
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
    EventFactory.deleteEvent(data, event._id)
      .then(function(remove){
        EventFactory.getEvents()
          .then(function(events){
            $scope.events = events.data;
          });
          console.log(event._id);
      });
  };

  $scope.selectedAsset = {};
  $scope.groupid = 0;
  $scope.selectedGroup = {};
  $scope.selectGroup = function() {
    var grp = [];
    angular.forEach($scope.groups, function(v, i) {
      if ($scope.groupid == v.ID) {
        $scope.selectedGroup = v;
      }
    });
  };

}]);