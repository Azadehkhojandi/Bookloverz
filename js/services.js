'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('myApp.services', []).
//   value('version', '0.1');


myApp.factory('UserService', ['$http',
    function ($http) {
  return {
      profile : {},
      access_token:'',
      lat:0,
      long:0,
      postUserInfo: function() {

	
return $http({
    url: 'http://thesmartfoxies.cloudapp.net/api/user',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : profile.name,
                email    : profile.email
            },
    headers: {
        "Content-Type": "application/json"
  
  }
})}}}]);


myApp.factory('UserInteractionService', ['$http','UserService',
    function ($http,UserService) {
  return {
     

      postUserInfo: function() {

	
return $http({
    url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : UserService.profile.name,
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
    url: 'http://127.0.0.1:81/api/UserNearby',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : UserService.profile.name,
                email : UserService.profile.email,
                lat:UserService.lat,
                long:UserService.long

            },
    headers: {
        "Content-Type": "application/json"
  
  }
})}


}}]);


