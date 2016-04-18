angular.module('tktmstr.controller', ['ui-leaflet', 'event.factories'])

.controller('TktMstrCtrl', [
  "$scope",
  'EventFact',
  function($scope, EventFact) {
    $scope.tktMstrEvents = [];
    $scope.evntBriteEvents = [];

    EventFact.getTktMstr()
      .then(function(res) {
        $scope.tktMstrEvents = res.data;
        console.log('tktmstr', res.data);
      });

    EventFact.getEvntBrite()
      .then(function(res) {
        $scope.evntBriteEvents = res.data;
        console.log('evntbrite', res.data);
      });

  }
]);