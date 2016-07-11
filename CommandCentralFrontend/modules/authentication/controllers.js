'use strict';
 
angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ModalService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ModalService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        // Show user appropriate message depending on where they came from. To be replaced with inter-page message service
        $scope.showresetmessage = $routeParams.wherefrom == "reset";
        $scope.showregistermessage = $routeParams.wherefrom == "registered";
        $scope.showlogoutmessage = $routeParams.wherefrom == "loggedout";
        $scope.wherefrom = $routeParams.wherefrom;

        $scope.errors = AuthenticationService.GetLoginErrors();
        $scope.messages = AuthenticationService.GetLoginMessages();
        AuthenticationService.ClearLoginErrors();
        AuthenticationService.ClearLoginMessages();

        // When they click login...
        $scope.login = function () {
            // Show that data is loading and clear the error message
            $scope.dataLoading = true;
            $scope.errors = null;

            ModalService.showModal({
                templateUrl: 'modules/modals/views/privacyact.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {

                        AuthenticationService.Login($scope.username, $scope.password,
                            function (response) {
                                AuthenticationService.SetCredentials($scope.username, response.ReturnValue.AuthenticationToken, response.ReturnValue.PersonId);
                                AuthorizationService.GetPersonMetadata(
                                    // If we succeed this is our call back
                                    function (response) {
                                        AuthorizationService.SetPermissions(response.ReturnValue.SearchableFields, response.ReturnValue.ReturnableFields);

                                    },
                                    // If we fail, this is our call back (nearly the same for all backend calls)
                                    function (response) {
                                        $scope.$apply(function () {
                                            // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                            // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                            if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                                for (var i = 0; i < response.ErrorMessages.length; i++) {
                                                    AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                                                }
                                                AuthenticationService.ClearCredentials();
                                                $location.path('/login');
                                            } else {
                                                // If it's any other type of error, we can just show it to them on this page.
                                                $scope.errors = response.ErrorMessages;
                                            }
                                            $scope.dataLoading = false;
                                        }
                                    );
                                    }).then(function () {
                                        AuthorizationService.GetPermissionGroups(
                                            // If we succeed, this is our callback
                                            function (response) {
                                                AuthorizationService.SetPermissionGroups(response.ReturnValue);
                                            },
                                            // If we fail, this is our call back (nearly the same for all backend calls)
                                            function (response) {
                                                $scope.$apply(function () {
                                                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                                                            AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                                                        }
                                                        AuthenticationService.ClearCredentials();
                                                        $location.path('/login');
                                                    } else {
                                                        // If it's any other type of error, we can just show it to them on this page.
                                                        $scope.errors = response.ErrorMessages;
                                                    }
                                                    $scope.dataLoading = false;
                                                }
                                                );
                                            }
                                        )
                                        .done(function () {
                                            $scope.$apply(function () {
                                                $location.path('/');
                                                if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.permissionGroups) {
                                                    for (var i = 0; i < $rootScope.globals.currentUser.permissionGroups.length; i++) {
                                                        if ($rootScope.globals.currentUser.permissionGroups[i].SpecialPermissions.indexOf("CreatePerson") != -1) {
                                                            AuthorizationService.SetCanCreatePerson(true);
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                    })
                            },
                            // If we fail, this is our call back (nearly the same for all backend calls)
                            function (response) {
                                $scope.$apply(function () {
                                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                                            AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                                        }
                                        AuthenticationService.ClearCredentials();
                                        $location.path('/login');
                                        $scope.errors = AuthenticationService.GetLoginErrors();
                                        AuthenticationService.ClearLoginErrors();
                                    } else {
                                        // If it's any other type of error, we can just show it to them on this page.
                                        $scope.errors = response.ErrorMessages;
                                    }
                                    $scope.dataLoading = false;
                                });
                            }
                        );
                    } else {
                        $scope.dataLoading = false;
                        $scope.errors.push("You must accept the Privacy Act Statement to continue");
                    }
                });
            });
        };
    }])
.controller('RegisterController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
        $scope.accepted = null;
        $scope.beginRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.BeginRegistration($scope.password,
                function (response) {
                    $scope.$apply(function () {
                        $scope.accepted = true;
                        $scope.dataLoading = false;
                    });
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
        };
    }])

.controller('FinishRegisterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {
        $scope.finishRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishRegistration($scope.username, $scope.password, $routeParams.id,
                function (response) {
                    $scope.$apply(function () {
                        AuthenticationService.AddLoginMessage("Account created. Login with your new account");
                        $location.path('/login');
                    });
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
        };
    }])
	.controller('ForgotController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        // AuthenticationService.ClearCredentials();

        $scope.forgotpassword = function () {
            $scope.dataLoading = true;
            $scope.errors = null;
            AuthenticationService.ForgotPassword($scope.email, $scope.ssn,
                function (response) {
                    $scope.$apply(function () {
                        $scope.confirmation = "Got it. Check your .mil email for further instructions.";
                        $scope.dataLoading = false;
                    });
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
        };
    }])
	.controller('FinishResetController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {
        $scope.finishReset = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishReset($scope.password, $routeParams.id,
                function (response) {
                    $scope.$apply(function () {
                        AuthenticationService.AddLoginMessage("Password reset. Please login with your new password.");
                        $location.path('/login');
                    });
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
        };
    }])
	.controller('CreateUserController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService) {

        $scope.errors = [];
        $scope.messages = [];
        ProfileService.GetAllLists(
            // If we succeed, this is our call back
            function (response) {
                $scope.$apply(function () {
                    $scope.lists = response.ReturnValue;
                });
            },
            // If we fail, this is our call back (nearly the same for all backend calls)
            function (response) {
                $scope.$apply(function () {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                            AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                        }
                        AuthenticationService.ClearCredentials();
                        $location.path('/login');
                    } else {
                        // If it's any other type of error, we can just show it to them on this page.
                        $scope.errors = response.ErrorMessages;
                    }
                    $scope.dataLoading = false;
                });
            }
        );

        $scope.trimString = function (str) {
            if (str) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            return '';
        };

        $scope.isValidSSN = function (number) {
            var re = /^\d{3}-?\d{2}-?\d{4}$/
            return re.test(number);
        };

        $scope.createUser = function () {
            $scope.errors = [];
            $scope.messages = [];
            $scope.dataLoading = true;
            AuthenticationService.CreateUser($scope.newUser,
                function (response) {
                    $scope.$apply(function () {
                        $scope.messages.push("User created. Please instruct them to register their account.");
                        $scope.dataLoading = false;
                        $location.path('/profile/' + response.ReturnValue);
                    });
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
        };
    }])
    .controller('SetPortController',
    ['$scope', '$rootScope', 'AuthenticationService',
        function ($scope, $rootScope, AuthenticationService) {
            $scope.setPort = function (thePort) { AuthenticationService.SetBackendPort(thePort); $scope.currentURL = $scope.getCurrentUrl() };
            $scope.getCurrentUrl = function () { return AuthenticationService.GetBackendURL(); };
            $scope.currentURL = $scope.getCurrentUrl();
        }]);