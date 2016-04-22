angular.module('event.controller', ['ui-leaflet', 'event.factories', 'angularMoment'])

.controller("EventCtrl", [
  '$scope',
  '$filter',
  'EventFact',
  '$ionicModal',
  // 'angularMoment',
  function ($scope, $filter, EventFact, $ionicModal, leafletData){
    $ionicModal.fromTemplateUrl('templates/edit-event.html', {
      scope: $scope
    }).then(function(editEventModal) {
      $scope.editEventModal = editEventModal;
    });

    $scope.editEvent = function() {
      $scope.editEventModal.show();
    };

    $scope.closeEdit = function() {
      $scope.editEventModal.hide();
    };
    $scope.eventLists = {categories: null};
    $scope.events = [];
    $scope.register = {};
    $scope.register.defaultValue = "Select All";
    EventFact.getEvents()
      .then(function(events){
        $scope.events = events.data;
        console.log(events.data[0].start_date);
        $scope.date = moment(events.data.start_date).format('L');
        $scope.time = moment(events.data.start_date).format('LT');
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
          category: $scope.category,
          created_by: $scope.created_by,
          description: $scope.description,
          start_date: $scope.start_date,
        };
        EventFact.postEvent(data)
          .then(function(newEvent){
            console.log('NEW event created!');
            $scope.events = $scope.events.concat(newEvent.data);
            $scope.title = '';
            $scope.created_by = '';
            $scope.description = '';
            $scope.start_date = '';
            $scope.lat = '';
            $scope.lng = '';
          });
      }
        console.log(newEvent.data);
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
  }
]);