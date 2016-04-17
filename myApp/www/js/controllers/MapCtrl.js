angular.module('map.controller', ['ui-leaflet', 'starter.factories'])

.controller('MapCtrl', [
  '$scope',
  'filterFilter',
  '$compile',
  '$ionicModal',
  'EventFactory',
  'leafletData',
  function  ($scope, filterFilter, $compile, $ionicModal, EventFactory, leafletData) {
    angular.extend($scope, {
      center: {
        autoDiscover: true,
        zoom: 18,
        continuousWorld: false
      }
    });
     $ionicPlatform.ready(function() {
        if(window.navigator && window.navigator.splashscreen) {
          window.plugins.orientationLock.unlock();
      }
    });
    $scope.$on('$ionicView.beforeEnter', function(){
      screen.lockOrientation('portrait');
    });
    // var mapdata = MQ.mapLayer(), mapid;
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
          }
        }
    };
    $scope.markerData = [];
    $scope.markers = [];
    // console.log($scope.markers);
    // 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png
  //'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png'
    leafletData.getMap().then(function(map) {
       $scope.baseLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        attributionControl: true,
        maxZoom: 18,
        // id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaHlwZXJraW5kIiwiYSI6ImNpbTV4cTNkeDAxd3h1Mm00cmVlM242dzgifQ.z3qbberA-XEQkuZQdbDMVA',
        // continuousWorld: false,
        noWrap: true,
        trackResize: true,
        setView: true,
      }).addTo(map);

       L.control.locate({
          position: 'topright',  // set the location of the control
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
          icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
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

      var heatArray = [];
      EventFactory.getEvents()
      .then(function loadEventMarkers(events) {
        $scope.markerData = events.data;
        // console.log($scope.markerData.length);

        for (var i = 0; i < $scope.markerData.length; i++) {
          // console.log(i);
          var dataMarker = {
            lat: $scope.markerData[i].latitude,
            lng: $scope.markerData[i].longitude,
            message: $scope.markerData[i].title +
                     // $scope.markerData[i].location_name +
                     $scope.markerData[i].venue_name +
                     $scope.markerData[i].address +
                     $scope.markerData[i].city+
                     $scope.markerData[i].zip+
                     $scope.markerData[i].category
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
        var html = '<span ng-click="addEvent()">Add Event Here</span>';
        var newScope = $scope.$new(true);
        newScope.addEvent = $scope.addEvent;
        console.log($compile(html)(newScope)[0]);
        var leafEvent = args.leafletEvent;
        $scope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "My Added Marker"
        });
      $scope.addEvent();
      });
  });
}]);