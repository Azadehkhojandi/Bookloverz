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
    url: 'http://thesmartfoxies.cloudapp.net/api/user',
    dataType: 'json',
    method: 'POST',
    data: { 
                name : UserService.profile.name,
                email : UserService.profile.email,
                lat:-33.8707953,
                long:151.1966107

            },
    headers: {
        "Content-Type": "application/json"
  
  }
})}}}]);