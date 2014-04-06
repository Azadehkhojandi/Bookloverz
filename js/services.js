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
            
            CurrentUser.profile = data;
            $rootScope.$broadcast('profile:updated', data);

        };
        CurrentUser.UpdateAccessToken = function (data) {
            CurrentUser.access_token = data;
            $rootScope.$broadcast('accessToken:updated', data);

        };
        $rootScope.$watch('geoPosition', function (newValue, oldValue) {
            if (oldValue != newValue) {
            
                CurrentUser.lat = newValue.coords.latitude;
                CurrentUser.long = newValue.coords.longitude;

                $rootScope.$broadcast('coordinate:updated', { lat: CurrentUser.lat, long: CurrentUser.long });

            }
        });
        return CurrentUser;
    }]);


myApp.factory('UserInteractionService', ['$http', 'CurrentUserService',
    function ($http, CurrentUserService) {

        var postUserInfo = function() {

            var cUser = {
                name: CurrentUserService.profile.displayName,
                email: CurrentUserService.profile.email,
                lat: CurrentUserService.lat,
                long: CurrentUserService.long,
                GoogleAccessToken: CurrentUserService.access_token,
                GoogleUserId: CurrentUserService.profile.id,
                Image: CurrentUserService.profile.image

            };

            return $http({
                url: 'http://thesmartfoxies.cloudapp.net/api/User',
                //url: 'http://127.0.0.1:81/api/user',
                //dataType: 'json',
                method: 'POST',
                data: cUser
            });
        }


        var userNearby = function () {

            var cUser = {
                email: CurrentUserService.profile.email,
                lat: CurrentUserService.lat,
                long: CurrentUserService.long,
                
            };
            return $http({
                url: 'http://thesmartfoxies.cloudapp.net/api/UserNearby',
                //url: 'http://127.0.0.1:81/api/UserNearby',
                method: 'POST',
                data: cUser
            });


        };

        //var userNearbyPOST = function () {

        //    return $http.post('http://127.0.0.1:81/api/UserNearby', {
        //        name: 'Harry0',
        //        email: 'eail',
        //        lat: 0,
        //        long: 0,
        //        GoogleAccessToken: '',
        //        GoogleUserId: '',
        //        Image: ''

        //    });
        //};

        return {
            PostUserInfo: postUserInfo,
            UserNearby: userNearby,
            //UserNearbyPOST: userNearbyPOST
        }

    }]);


