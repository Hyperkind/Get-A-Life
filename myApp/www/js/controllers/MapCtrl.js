angular.module('map.controller', ['ui-leaflet', 'event.factories'])

.controller('MapCtrl', [
  '$scope',
  '$filter',
  'filterFilter',
  '$compile',
  '$ionicModal',
  'EventFact',
  'leafletData',
  function  ($scope, $filter, filterFilter, $compile, $ionicModal, EventFact, leafletData) {
    angular.extend($scope, {
      center: {
        autoDiscover: true,
        zoom: 18
      }
    });

    var trafficData = MQ.mapLayer(), mapid;



    var heat = {};
    var points = [];
    var heatmap = {
        name: 'Heat Map',
        type: 'heat',
        data: points,
        visible: true
    };
    $scope.layers = {
      baselayers: {
          stamen_toner: {
              name: 'Toner',
              url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
              type: 'xyz'
          },
          Aerial: {
            name:'Open Aerial',
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz'
          },
          // Night: {
          //   name:'Night',
          //   url: 'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
          //   attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
          //   format: 'jpg',
          //   time: '',
          //   type:'xyz',
          //   tilematrixset: 'GoogleMapsCompatible_Level'
          // },
          Thunder_Forest: {
            name: 'Flames',
            url: 'http://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            type: 'xyz',
            maxZoom: 11
          }

        }
    };
    $scope.markerData = [];
    $scope.markers = [];

    leafletData.getMap().then(function(map) {
       $scope.baseLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        attributionControl: true,
        maxZoom: 18,
        accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA',
        noWrap: true,
        trackResize: true,
        setView: true,
      }).addTo(map);

       L.control.locate({
          position: 'bottomright',  // set the location of the control
          layer: undefined,  // use your own layer for the location marker, creates a new layer by default
          drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
          follow: true,  // follow the user's location
          setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
          keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
          stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
          remainActive: true, // if true locate control remains active on click even if the user's location is in view.
          markerClass: L.circleMarker, // L.circleMarker or L.marker
          circleStyle: {},  // change the style of the circle around the user's location
          markerStyle: {},
          followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
          followMarkerStyle: {},
          icon: 'ion-android-navigate',  // class for icon, fa-location-arrow or fa-map-marker
          iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
          iconElementTag: 'span',  // tag for the icon element, span or i
          circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
          metric: true,  // use metric or imperial units
          // onLocationError: function(err) {alert(err.message)},  // define an error callback function
          // onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
          //         alert(context.options.strings.outsideMapBoundsMsg);
          // },
          showPopup: true, // display a popup when the user click on the inner marker
          strings: {
              title: "Show me where I am",  // title of the locate control
              metersUnit: "meters", // string for metric units
              feetUnit: "feet", // string for imperial units
              popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle
              outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
          },
          locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
        }).addTo(map);
      MQ.trafficLayer().addTo(map);

      var heatArray = [];
      EventFact.getEvents()
      .then(function loadEventMarkers(events) {
        $scope.markerData = events.data;
        // console.log($scope.markerData.length);

        for (var i = 0; i < $scope.markerData.length; i++) {
          // console.log(i);
          $scope.date = $filter('date')($scope.markerData[i].start_date, 'MM-dd-yyyy');
          $scope.time = $filter('date')($scope.markerData[i].start_date, 'hh:mm:a');          var dataMarker = {
            lat: $scope.markerData[i].latitude,
            lng: $scope.markerData[i].longitude,
            message: '<h4>' + $scope.markerData[i].title + '</h4>' +
                     '<div>' + "<b>CREATED BY</b>: " + $scope.markerData[i].created_by + '</div>' +
                     '<div>'+ "<b>VENUE</b>: " + $scope.markerData[i].venue_name +'</div>' +
                     '<div>'+ "<b>DATE</b>: " + $scope.date +'</div>' +
                     '<div>' + "<b>TIME</b>: " + $scope.time + '</div>' +
                     '<div>' + "<b>ADDRESS</b>: " + $scope.markerData[i].address + '</div>' +
                     '<div>' + "<b>CITY</b>: " + $scope.markerData[i].city+ '</div>'+
                     '<div>' + "<b>ZIP</b>: " + $scope.markerData[i].zip+ '</div>'+
                     '<div>' + "<b>CATEGORY</b>: " + $scope.markerData[i].category + '</div>'
                     // $scope.markerData[i].post
          };
          //points are the data fed into the heat map [lat, lng, intensity]
        $scope.markers.push(dataMarker);
        var points = [$scope.markerData[i].latitude, $scope.markerData[i].longitude];
          if(points.every(Number)) {
            heatArray.push(points);

          }
        }
        console.log(heatArray);
        console.log($scope.markers);
        $scope.layers.overlays =  {
            heat: {
              name:'Heat Map',
              type: 'heat',
              data: heatArray,
              layerOptions: {radius: 15, blur: 15},
              visible: true
            },
        };
      });
    //data needs and array of arrays [[lat, lng]]
        //adds markers
      $scope.$on("leafletDirectiveMap.dblclick", function(event, args){
        var leafEvent = args.leafletEvent;
        var html = '<button ng-click="addEvent(' + leafEvent.latlng.lat + ',' + leafEvent.latlng.lng + ')">Add Event Here</button>';
        var newScope = $scope.$new(true);
        newScope.addEvent = $scope.addEvent;
        console.log($compile(html)(newScope)[0]);
        $scope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: html,
            getMessageScope: function() { return $scope; }
        });
      });

      // $scope.newEvent = {};
      // $scope.doEvent = function() {
      //   $http.post(ENDPOINT + '/api/events', $scope.newEvent)
      //   .success(function(data) {
      //     $scope.newEvent = {};
      //     $scope.todos  = $scope.newEvent;
      //   })
      //   .error(function(data) {
      //     console.log('Error: ' + $scope.newEvent);
      //   });
      //   $timeout(function(data) {
      //     $scope.closeEvent();
      //   }, 1000);
      // };

  });
}]);