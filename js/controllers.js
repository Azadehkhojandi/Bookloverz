'use strict';


myApp.controller('AroundMe', [
    '$rootScope', '$scope', 'UserInteractionService', 'CurrentUserService',
    function ($rootScope, $scope, UserInteractionService) {

        $rootScope.$on('profile:updated', function () {
            $scope.showNow = true;

        });

        $rootScope.$on('coordinate:updated', function () {
            console.log('AroundMe-coordinate:updated');

            UserInteractionService.UserNearby()
                .success(function(data) {
                    console.log('success-AroundMe-coordinate:updated');
                console.log(data);
                    if (data.success) {
                        var people = [];
                        angular.forEach(data.users.Collection, function (value, key) {
                            
                            this.push({
                                displayName: value.Name,
                                image: value.Image,
                                     volumeInfo: {
                                         imageLinks: {
                                             smallThumbnail: '/fake-img/Books/00.jpg'
                                         },
                                         title: "Bla"
                                     }
                                
                            });
                        }, people);
                        $scope.people = people;
                        console.log(people);

                    }
            }).error(function() {
                    console.log('error-AroundMe-coordinate:updated');
                });


        });



        //   $scope.people = [
        // {
        //     displayName: 'Allison Jones',
        //     image: '/fake-img/Avatars/avatar0.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/00.jpg'
        //         },
        //         title: "Bla"
        //     }
        // },
        // {
        //     displayName: 'Geoffrey Smith',
        //     image: '/fake-img/Avatars/avatar1.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/01.jpg'
        //         },
        //         title: "Bla"
        //     }
        // },
        // {
        //     displayName: 'Mary Foo',
        //     image: '/fake-img/Avatars/avatar2.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/02.jpg'
        //         },
        //         title: "Bla"
        //     }
        // },
        // {
        //     displayName: 'Linus Bar',
        //     image: '/fake-img/Avatars/avatar3.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/03.jpg'
        //         },
        //         title: "Bla"
        //     }
        // },
        // {
        //     displayName: 'Freddie Blercury',
        //     image: '/fake-img/Avatars/avatar4.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/04.jpg'
        //         },
        //         title: "Bla"
        //     }
        // },
        // {
        //     displayName: 'John Q Digest',
        //     image: '/fake-img/Avatars/avatar5.png',
        //     volumeInfo: {
        //         imageLinks: {
        //             smallThumbnail: '/fake-img/Books/05.jpg'
        //         },
        //         title: "Bla"
        //     }
        // }
        //   ];
    }]);

myApp.
    controller('SearchCtrl', [
        '$scope', '$http', 'CurrentUserService', function ($scope, $http, CurrentUserService) {

            $scope.showActionButtonNow = false;
            $scope.profile = CurrentUserService.profile;
            $scope.access_token = CurrentUserService.access_token;
            console.log('GoogleUserProfileCtrl');
            console.log(CurrentUserService);
            if ($scope.access_token != "" && $scope.access_token != null) {
                $scope.showActionButtonNow = true;
            }
            $scope.$on('profile:updated', function (event, data) {
                console.log('on-profile:updated');
                console.log(event);
                console.log(data);
                $scope.profile = data;
                $scope.$apply();
                console.log($scope.profile);
                console.log('profile-updated');

            });

            $scope.$on('accessToken:updated', function (event, data) {
                console.log('on-accessToken:updated');
                console.log(event);
                console.log(data);
                $scope.access_token = data;
                if ($scope.access_token != "" && $scope.access_token != null) {
                    $scope.showActionButtonNow = true;
                }
            });

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

            $scope.AddtoBookShelf = function (BookshelfId, book) {
                var url = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/addVolume?volumeId=' + book.id + '&access_token=' + $scope.access_token;
                $http({ method: 'POST', url: url }).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available
                       console.log(data);

                   }).
                   error(function (data, status, headers, config) {
                       // called asynchronously if an error occurs
                       // or server returns response with an error status.

                   });


            };
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
        '$rootScope', '$scope', '$http', 'CurrentUserService', function ($rootScope, $scope, $http, CurrentUserService) {
            $scope.showNow = false;
            $scope.profile = CurrentUserService.profile;
            $scope.access_token = CurrentUserService.access_token;
            console.log('GoogleUserProfileCtrl');

            console.log(CurrentUserService);

            $scope.$on('profile:updated', function (event, data) {
                console.log('on-profile:updated');
                console.log(event);
                console.log(data);
                $scope.profile = data;
                $scope.$apply();
                console.log($scope.profile);
                console.log('profile-updated');
                $scope.test();
                $scope.showNow = true;
            });

            $scope.$on('accessToken:updated', function (event, data) {
                console.log('on-accessToken:updated');
                console.log(event);
                console.log(data);
                $scope.access_token = data;
            });

            $scope.bookshelves = {
                items: {}
            };




            $scope.test = function () {



                console.log(CurrentUserService);
                console.log('CurrentUserService');

                // var url = 'https://www.googleapis.com/books/v1/user/' + uid + '/bookshelves/';
                var url = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves' + "?access_token=" + $scope.access_token;

                $http({ method: 'GET', url: url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.bookshelves = data;

                        for (var i = $scope.bookshelves.items.length - 1; i >= 0; i--) {
                            (function (i) {
                                if ($scope.bookshelves.items[i].volumeCount > 0) {

                                    var vurl = $scope.bookshelves.items[i].selfLink + "/volumes" + "?access_token=" + $scope.access_token;


                                    $http({ method: 'GET', url: vurl }).
	                                success(function (data, status, headers, config) {
	                                    console.log(data);
	                                    $scope.bookshelves.items[i].volumes = data;


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





