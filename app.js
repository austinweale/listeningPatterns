Parse.initialize("8LiZGBvExsCRqQIlwP8GB1q1yh7ShdmxIMYB882g", "FmLeLaAltBlxJSyFPy7sOHzyqQCxLrz2zA1l3Goy");
var BandData = Parse.Object.extend('BandData');

var lastFmBase = "http://ws.audioscrobbler.com/2.0/";
var googleMapBase = "https://maps.googleapis.com/maps/api/geocode/json"; //eventually want to map the locations
var musicBrainzBase = "http://musicbrainz.org/ws/2/artist/";
var lastFmKey = "ef2f18ff332a62f72ad46c4820bdb11b";
var googleKey = "AIzaSyBIFJX-BioTGbdc5g80uSqKCM8EtUdyuqs";

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
var myApp = angular.module('myApp', [])

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  
  $scope.iterator = [];
  $scope.bands = [];
  $scope.locations = [];
  $scope.user = "";
  $scope.tab = 1;
  $scope.error = false;
  $scope.keyWord = "";
  $scope.songs = [];
  $scope.audioObject = {};
  $scope.about = false;

  //This is for caching the data that is retrieved from the APIs. So if a band has been searched 
  //before, its data is saved on parse so this call will not have to be done again in the future
  $scope.saveLocation = function(text, index){
      var json = JSON.parse(text);
      var artists = json.artists[0];
      var address = "";
      var currentBand = new BandData;
      currentBand.set("band", $scope.bands[index]);
      if(artists == undefined || artists['begin-area'] == undefined || artists.area == undefined){
        address = "unknown";
      }else{
        address = artists['begin-area'].name + ", " + artists.area.name;
      }
      currentBand.set("address", address);

      
      currentBand.save();
      $scope.locations[index] = address;
        if(!$scope.$$phase) {
          $scope.$apply();
        }


  };

  //makes the ajax request to the musicBrainz API to get the band location
  $scope.ajaxRequest = function(sync, destination, currentUrl, index){

    $.ajax({
      url : currentUrl,
      data : { param : "value" },
      dataType : 'text',
      async: sync,
      type : 'get',
      success : function(text) {
        // called after the ajax has returned successful response
        destination(text, index); 
        
      },
      error : function(){
        //if there's an error, this band is set to unknown
        var currentBand = new BandData;
        currentBand.set("band", $scope.bands[index]);
        currentBand.set("address", "unknown");
        currentBand.save();
        $scope.locations[index] = "unknown";
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      }
    });
  }

  //finds all the band locations for every band in the bands array
  //populates the locations array
  $scope.getLocations = function(){
    
    for(var j = 0; j < $scope.bands.length; j++){
      (function(j){
        var query = new Parse.Query(BandData);
        query.equalTo("band", $scope.bands[j]);

        query.find({
            success:function(results){
              if(results.length == 0){

                $scope.ajaxRequest("true", $scope.saveLocation, musicBrainzBase + "?query=artist:" + $scope.bands[j] +"&fmt=json", j);
                
              }else{
                $scope.locations[j] = results[0].get("address");
                
              }
              if(!$scope.$$phase) {
                $scope.$apply();
              }
            },
            error:function(error){
              alert("An error occurred");

            }
        }) 
      })(j);
    } 
  };

  //gets the top artists of the last.fm user
  //triggers the location search as well
  $scope.getArtists = function(){
    $scope.iterator = [];
    $scope.bands = [];
    $scope.locations = [];
    $scope.error = false;

    
    $http.get(lastFmBase + "?user=" + $scope.user + "&method=user.gettopartists&api_key=ef2f18ff332a62f72ad46c4820bdb11b&format=json").then(function(response){
      
      if(response.data.message != "User not found"){
        $scope.iterator = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var artists = response.data.topartists.artist;
        for(var i = 0; i < 10; i++){
          
          $scope.bands[i] = artists[i].name;

        }
        
        $scope.getLocations();
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      }else{
        $scope.error = true;
      }
      
    })
  };

  //toggles which form and which table is shown on the page
  $scope.toggle = function(curr){
    $scope.iterator = [];
    $scope.bands = [];
    $scope.songs = [];
    $scope.locations = [];
    $scope.tab = curr;
  }

  //contacts the spotify API to find songs that match the input keyword
  //Triggers the search for the artist locations as well
  $scope.searchSpotify = function(){
    $scope.iterator = [];
    $scope.bands = [];
    $scope.songs = [];
    $scope.locations = [];
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
      for (var i = 0; i < $scope.tracks.length; i++){
        $scope.iterator[i] = i;

        var currName = $scope.tracks[i].artists[0].name;
        var currSong = $scope.tracks[i].name;
        $scope.bands[i] = currName;
        $scope.songs[i] = currSong;

      }
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      $scope.getLocations();
    })

  };

  //toggles whether or not the "about this page" section is displayed
  $scope.displayAbout = function(display){
    $scope.about = display;
  };

})

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
