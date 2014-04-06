'use strict';

/* Directives */


myApp.directive('geoLocation', ['$rootScope', 'CurrentUserService', 'UserInteractionService',
    function ($rootScope, CurrentUserService, UserInteractionService) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs, ctrl, $timeout) {

                console.log('geolocation');
                scope.showNotSupported = !window.navigator;

                window.navigator.geolocation.getCurrentPosition(
                    function (position) {

                        $rootScope.geoPosition = position;
                        $rootScope.$digest();

                    }, function (error) {
                        console.log(error);
                    });

            },
            templateUrl: '/templates/geolocation.html',
            replace: true
        };
    }]);



myApp.directive('googleConnect', ['$rootScope', 'CurrentUserService', 'UserInteractionService',
    function ($rootScope, CurrentUserService, UserInteractionService) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs, ctrl, $timeout) {
                console.log(CurrentUserService);
                console.log('CurrentUserService');
                scope.showConnect = true;
                scope.profile = {
                    image: ''
                };


                // Enter a client ID for a web application from the Google Developer Console.
                // The provided clientId will only work if the sample is run directly from
                // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
                // In your Developer Console project, add a JavaScript origin that corresponds to the domain
                // where you will be running the script.
                scope.clientId = '728809409719-f6u3ub15ntosdqkkdg908ahm0f72d9qg.apps.googleusercontent.com';

                // Enter the API key from the Google Develoepr Console - to handle any unauthenticated
                // requests in the code.
                // The provided key works for this sample only when run from
                // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
                // To use in your own application, replace this API key with your own.
                scope.apiKey = 'AIzaSyDs6vaRX_I0uiafVA9SUj88jNdzR5qy5zg';

                // To enter one or more authentication scopes, refer to the documentation for the API.
                scope.scopes = 'https://www.googleapis.com/auth/plus.me profile email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/books';

                // Use a button to handle authentication the first time.
                scope.handleClientLoad = function () {
                    console.log('handleClientLoad');
                    gapi.client.setApiKey(scope.apiKey);
                    window.setTimeout(scope.checkAuth, 1);
                };

                scope.gapiStatus = function () {
                    console.log('gapiStatus');
                    return (gapi !== undefined && gapi.client !== undefined && gapi.client.setApiKey !== undefined);
                };

                scope.checkAuth = function () {
                    gapi.auth.authorize({ client_id: scope.clientId, scope: scope.scopes, immediate: true }, scope.handleAuthResult);
                };



                scope.handleAuthResult = function (authResult) {
                    console.log('handleAuthResult');
                    console.log(authResult);
                    if (authResult && !authResult.error) {
                        scope.showConnect = false;
                        CurrentUserService.UpdateAccessToken(authResult.access_token);
                        CurrentUserService.access_token = authResult.access_token;
                        scope.makeApiCall();
                    } else {
                        scope.showConnect = true;

                    }
                };

                scope.handleAuthClick = function (event) {
                    console.log('handleAuthClick');
                    gapi.auth.authorize({ client_id: scope.clientId, scope: scope.scopes, immediate: false }, scope.handleAuthResult);
                    return false;
                };

                // Load the API and make an API call.  Display the results on the screen.
                scope.makeApiCall = function () {
                    console.log('makeApiCall');
                    gapi.client.load('plus', 'v1', function () {
                        var request = gapi.client.plus.people.get({
                            'userId': 'me',
                            //'fields':'aboutMe,currentLocation,id,tagline'
                        });
                        request.execute(function (resp) {
                            console.log(resp);

                            if (resp.image != undefined) {
                                scope.profile.image = resp.image.url;
                            }
                            scope.profile.email = resp.emails[0].value;
                            scope.profile.displayName = resp.displayName;
                            scope.profile.circledByCount = resp.circledByCount;
                            scope.profile.aboutMe = resp.aboutMe;
                            scope.profile.tagline = resp.tagline;
                            scope.profile.url = resp.url;
                            scope.profile.id = resp.id;
                            scope.$apply();

                            CurrentUserService.UpdateProfile(scope.profile);
                            //UserInteractionService.PostUserInfo();
                            UserInteractionService.PostUserInfo().
                                    success(function (data, status) {
                                        console.log('handleSuccess');
                                        console.log(data);
                                        console.log(status);
                                    }).
                                    error(function (data, status, headers, config) {
                                        console.log("PostUserInfo error");
                                        console.log(data);
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                        //$scope.books=[];
                                    });


                        });
                    });
                };



                scope.$watch('gapiStatus', function () {
                    console.log('watch gapiStatus');


                    if (scope.gapiStatus()) {
                        scope.handleClientLoad();
                    }
                });
                // scope.gapiStatus();
            },
            templateUrl: '/templates/googleconect.html',
            replace: true
        };
    }]);
