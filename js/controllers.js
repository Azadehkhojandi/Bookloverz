'use strict';

myApp.
    controller('SearchCtrl', [
        '$scope','$http', function ($scope, $http) {

            $scope.terms = [
                { value: '', text: 'all' },
                { value: 'intitle', text: 'the title' },
                { value: 'inauthor', text: 'the author' },
                { value: 'inpublisher', text: 'the publisher' },
                { value: 'subject', text: 'the category list of the volume' },
                { value: 'isbn', text: 'the ISBN number' },
                { value: 'lccn', text: 'the Library of Congress Control Number' },
                { value: 'oclc', text: 'the Online Computer Library Center number' }
            ];
            $scope.term = $scope.terms[0].value; // default


            $scope.search = function () {
                if ($scope.keyword) {
                    console.log($scope.keyword);

                    console.log($scope.term);
                    var url = 'https://www.googleapis.com/books/v1/volumes?q=' + $scope.keyword;
                    if ($scope.term.length > 0) {
                        url = url + "+" + $scope.term;
                    }
                    console.log(url);
                    $http({ method: 'GET', url: url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.books = data;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.books = [];
                    });

                }
                else {
                    $scope.books = [];
                }

            };
        }
    ]);



// myApp.
//     controller('GoogleUserBookshelvesCtrl', [
//         '$scope', '$http', function ($scope, $http) {
// }]);

myApp.
    controller('GoogleUserProfileCtrl', [
        '$scope', '$http','UserService', function ($scope, $http,UserService) {
          
          $scope.bookshelves={
            items:{}
          };

            $scope.test = function () {

                console.log(UserService);
                console.log('UserService');

               // var url = 'https://www.googleapis.com/books/v1/user/' + uid + '/bookshelves/';
               var url='https://www.googleapis.com/books/v1/mylibrary/bookshelves'+"?access_token="+UserService.access_token;

                $http({ method: 'GET', url: url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.bookshelves=data;
                        
                        for (var i = $scope.bookshelves.items.length - 1; i >= 0; i--) {
                        	(function(i) {
	                        	if ($scope.bookshelves.items[i].volumeCount>0)
	                            {
	                            
	                                var vurl=$scope.bookshelves.items[i].selfLink+"/volumes"+"?access_token="+UserService.access_token;

	
	                                $http({ method: 'GET', url: vurl }).
	                                success(function (data, status, headers, config) {
	                                    console.log(data);
	                                   $scope.bookshelves.items[i].volumes=data;
	                                  
	                                  
	                                }).
	                                error(function (data, status, headers, config) {
	                                    console.log(data);
	                                    // called asynchronously if an error occurs
	                                    // or server returns response with an error status.
	                                    //$scope.books=[];
	                                });
	
	                            }

	                        	
                        	}(i));
                        };
                        //$scope.books=data;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        //$scope.books=[];
                    });


            };
        }
    ]);


myApp.
    controller('mainCtrl', [
        '$scope', 'geolocation', function ($scope,geolocation) {
          
    $scope.coords = geolocation.getLocation().then(function(data){
      return {lat:data.coords.latitude, long:data.coords.longitude};
    });
}]);

myApp.
    controller('GeoTestCtrl', ['$scope', '$window'
,function ($scope, $window) {
    $scope.supportsGeo = $window.navigator;
    $scope.position = null;
     window.setTimeout($scope.getCurrentPosition, 1);
      $scope.getCurrentPosition = function() {
        window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.position = position;
            });
        }, function(error) {
            alert(error);
        });
    };

    $scope.doTest1 = function() {
        window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.position = position;
            });
        }, function(error) {
            alert(error);
        });
    };
    $scope.doTest2 = function() {
        $window.navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            $scope.$apply(function() {
                $scope.position = position;
            });
        }, function(error) {
            alert(error);
        });
    };

}]);

myApp.controller('geolocCtrl', ['$geolocation', '$scope', function($geolocation, $scope) {
        $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
        });
        $scope.myCoords = $geolocation.position.coords; // this is regularly updated
        $scope.myError = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
    }]);
