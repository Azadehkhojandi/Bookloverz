'use strict';


/* Services */

myApp.factory('CurrentUserService', ['$rootScope', '$http',
    function ($rootScope, $http) {

        var CurrentUser = {
            profile: {
                image: '',
                email: '',
                displayName: '',
                circledByCount: '',
                tagline: '',
                aboutMe: '',
                url: '',
                id: ''
            },
            access_token: '',
            lat: 0,
            long: 0,
        };
        CurrentUser.UpdateProfile = function (data) {
            console.log('UpdateProfile');
            console.log(data);
            CurrentUser.profile = data;
            $rootScope.$broadcast('profile:updated', data);

        };
        CurrentUser.UpdateAccessToken = function (data) {
            CurrentUser.access_token = data;
            $rootScope.$broadcast('accessToken:updated', data);

        };
        $rootScope.$watch('geoPosition', function (newValue, oldValue) {
            if (oldValue != newValue) {
                //console.log('geoPosition changed');
                //console.log($rootScope.geoPosition);
                //console.log('ccccc geoPosition changed');


                //console.log('UpdateCoordinate data');
                //console.log(newValue);

                CurrentUser.lat = newValue.coords.latitude;
                CurrentUser.long = newValue.coords.longitude;


                $rootScope.$broadcast('coordinate:updated', { lat: CurrentUser.lat, long: CurrentUser.long });

                //console.log(oldValue);
                //CurrentUserService.UpdateCoordinate({ lat: newValue.coords.latitude, long: newValue.coords.longitude });
            }
        });
        return CurrentUser;
    }]);


myApp.factory('UserInteractionService', ['$http', 'CurrentUserService',
    function ($http, CurrentUserService) {
        //var postUserInfo = function () {

        //    var cUser = {
        //        name: CurrentUserService.profile.displayName,
        //        email: CurrentUserService.profile.email,
        //        lat: CurrentUserService.lat,
        //        long: CurrentUserService.long,
        //        GoogleAccessToken: CurrentUserService.access_token,
        //        GoogleUserId: CurrentUserService.profile.id,
        //        Image: CurrentUserService.profile.image

        //    };
        //    console.log(cUser);

        var userNearby = function () {
            return $http({
                //url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
                url: 'http://127.0.0.1:81/api/UserNearby',
                method: 'POST',
                data: {
                    name: 'Harry',
                    email: 'eail',
                    lat: CurrentUserService.lat,
                    long2: CurrentUserService.long,
                    GoogleAccessToken: '',
                    GoogleUserId: '',
                    Image: CurrentUserService.profile.image
                }
            });


        };

        var userNearbyPOST = function () {

            return $http.post('http://127.0.0.1:81/api/UserNearby', {
                name: 'Harry',
                email: 'eail',
                lat: 0,
                long2: 0,
                GoogleAccessToken: '',
                GoogleUserId: '',
                Image: ''

            });
        };

        return {
            //PostUserInfo: postUserInfo,
            UserNearby: userNearby,
            UserNearbyPOST: userNearbyPOST
        }

    }]);


// myApp.factory('UserInteractionService', ['$http','UserService',
//     function ($http,UserService) {
//   return {


//       PostUserInfo: function() {

//         var userjson={ 
//                         name : UserService.profile.displayName,
//                         email : UserService.profile.email,
//                         lat:UserService.lat,
//                         long:UserService.long,
//                         GoogleAccessToken:UserService.access_token,
//                         GoogleUserId:UserService.profile.id,
//                         Image:UserService.profile.image

//                     };
//         return $http({
//            // url: 'http://thesmartfoxies.cloudapp.net/api/User',
//         url:'http://127.0.0.1:81/api/user',
//             dataType: 'json',
//             method: 'POST',
//             data: userjson,
//             headers: {
//                 "Content-Type": "application/json"

//           }
//         })
//       },
//    UserNearby: function() {
//       return $http({
//           //url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
//           url:'http://127.0.0.1:81/api/UserNearby',
//           dataType: 'json',
//           method: 'POST',
//           data: { 
//                   name : UserService.profile.displayName,
//                   email : UserService.profile.email,
//                   lat:UserService.lat,
//                   long:UserService.long,
//                   GoogleAccessToken:UserService.access_token,
//                   GoogleUserId:UserService.id,
//                   Image:UserService.profile.image
//                   },
//           headers: {
//               "Content-Type": "application/json"

//         }
//       })
// }


// }}]);