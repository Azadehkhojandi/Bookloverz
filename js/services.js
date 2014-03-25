'use strict';

/* Services */

myApp.factory('UserService', [ '$rootScope',
    function ($rootScope) {

    var service = {
          profile : {
            image:'',
            email:'',
            displayName:'',
            circledByCount:'',
          },
          access_token:'',
          lat:0,
          long:0,
    };


    service.UpdateProfile = function(data) {
      console.log('UpdateProfile');
      console.log(data);
      service.profile=data;
      $rootScope.$broadcast('profile:updated',data);
    };

    service.UpdateAccessToken = function(data) { 
     service.access_token=data;
     $rootScope.$broadcast('accessToken:updated',data);
   };

   service.UpdateCoordinate = function(data) {
     service.lat=data.lat;
     service.long=data.long;
     $rootScope.$broadcast('coordinate:updated',data);
   };


   return service;


}]);


myApp.factory('UserInteractionService', ['$http','UserService',
    function ($http,UserService) {
  return {
     

      postUserInfo: function() {

	
return $http({
    url: 'http://thesmartfoxies.cloudapp.net/api/User',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : UserService.profile.displayName,
                email : UserService.profile.email,
                lat:UserService.lat,
                long:UserService.long

            },
    headers: {
        "Content-Type": "application/json"
  
  }
})},
   postUserLoc: function() {

	
return $http({
    url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : UserService.profile.displayName,
                email : UserService.profile.email,
                lat:UserService.lat,
                long:UserService.long

            },
    headers: {
        "Content-Type": "application/json"
  
  }
})}


}}]);


