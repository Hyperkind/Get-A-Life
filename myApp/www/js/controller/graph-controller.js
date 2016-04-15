angular.module('graph.controllers', ['ui-leaflet', 'starter.factories','nvd3'])

.controller('GraphController', [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
    $scope.events = [];
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
      console.log('events.data', events.data);
      //accessing array of objects
      var categories = [];
      console.log($scope.events.length);
      for (var i = 0; i < $scope.events.length; i++){
        categories.push($scope.events[i].category);
      }
      console.log(categories);
      return categories;
    });

    var Miscellaneous = 0;
    var Music = 0;
    var ArtsAndMusic = 0;

    function distrCategories(category) {
      if(categories.indexOf(category) === 'Miscellaneous'){
        Miscellaneous++;
      }
      console.log('Miscellaneous', Miscellaneous);
      return Miscellaneous;
    }

    // categories.filter(distrCategories);
    // console.log(distrCategories);

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