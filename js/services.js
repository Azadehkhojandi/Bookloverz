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
            tagline:'',
            aboutMe:'',
            url:'',
            id:''
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
           //url:'http://127.0.0.1:81/api/user',
            dataType: 'json',
            method: 'POST',
            data: { 
                        name : UserService.profile.displayName,
                        email : UserService.profile.email,
                        lat:UserService.lat,
                        long:UserService.long,
                        GoogleAccessToken:UserService.access_token,
                        GoogleUserId:UserService.profile.id,
                        Image:UserService.profile.image

                    },
            headers: {
                "Content-Type": "application/json"
          
          }
        })
      },
   UserNearby: function() {
      return $http({
          url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
          //url:'http://127.0.0.1:81/api/UserNearby',
          dataType: 'json',
          method: 'POST',
          data: { 
                  name : UserService.profile.displayName,
                  email : UserService.profile.email,
                  lat:UserService.lat,
                  long:UserService.long,
                  GoogleAccessToken:UserService.access_token,
                  GoogleUserId:UserService.id,
                  Image:UserService.profile.image
                  },
          headers: {
              "Content-Type": "application/json"
        
        }
      })
}


}}]);


