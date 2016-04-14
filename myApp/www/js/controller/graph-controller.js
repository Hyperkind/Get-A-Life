angular.module('graph.controllers', ['ui-leaflet', 'starter.factories','nvd3'])

.controller('GraphController', [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
    $scope.events = [];
    console.log('category', $scope.category);
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
      //accessing array of objects
      console.log('$scope.events', $scope.events[0].category);
      function filterByCategory(obj){
        if('category' in obj === 'Music' || 'Miscellaneous' || 'Arts & Theatre'){
          return true;
        }
      }
      var categoryArr = $scope.events.filter(filterByCategory);
      console.log('categoryArr', categoryArr);
    });

  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "Music",
                y: 60,
            },
            {
                key: "Arts & Theatre",
                y: 30
            },
            {
                key: "Miscellaneous",
                y: 10
            }
        ];
    }
    ]);