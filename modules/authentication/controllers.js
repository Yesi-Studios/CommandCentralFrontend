'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ModalService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ModalService, ConnectionService, config) {
        // Reset login status
        AuthenticationService.ClearCredentials();

        // Display error messages and messages stored in the AuthenticationService
        $scope.errors = ConnectionService.GetLoginErrors();
        $scope.messages = ConnectionService.GetLoginMessages();
        ConnectionService.ClearLoginErrors();
        ConnectionService.ClearLoginMessages();

        // When they click login...
        $scope.login = function () {
            // Show that data is loading and clear the error message
            $scope.dataLoading = true;
            $scope.errors = [];

            ModalService.showModal({
                templateUrl: 'modules/modals/views/privacyact.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {

                        AuthenticationService.Login($scope.username, $scope.password,
                            // If we succeed this is our call back
                            function (response) {
                                if(config.debugMode) console.log(response);
                                AuthenticationService.SetCredentials($scope.username, response.ReturnValue.AuthenticationToken, response.ReturnValue.PersonId);
                                AuthorizationService.SetPermissions(response.ReturnValue.ResolvedPermissions);
                                AuthorizationService.GetPermissionGroups(
                                        // If we succeed, this is our callback
                                        function (response) {
                                            AuthorizationService.SetPermissionGroups(response.ReturnValue);
                                        },
                                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                        function (response) {
                                            ConnectionService.HandleServiceError(response, $scope, $location);
                                        }
                                    )
                                    .then(function () {
                                        var test = ConnectionService.GetRedirectURL();
                                        ConnectionService.ClearRedirectURL();
                                        if(config.debugMode) console.log(test);
                                        $location.path(test);
                                    });
                            },
                            // If we fail, this is our call back. This one must differ from the convenience function in Connection service because we
                            // are already on the login page. 
                            function (response) {
                                // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                    for (var i = 0; i < response.ErrorMessages.length; i++) {
                                        ConnectionService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                                    }
                                    AuthenticationService.ClearCredentials();
                                    $location.path('/login');
                                    // Since we're already at the login page, go ahead and get the Errors.
                                    $scope.errors = ConnectionService.GetLoginErrors();
                                    ConnectionService.ClearLoginErrors();
                                } else {
                                    // If it's any other type of error, we can just show it to them on this page.
                                    $scope.errors = response.ErrorMessages;
                                }
                                $scope.dataLoading = false;

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
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
        // reset login status
        //AuthenticationService.ClearCredentials();
        $scope.accepted = null;
        $scope.beginRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.BeginRegistration($scope.password,
                function (response) {
                    $scope.accepted = true;
                    $scope.dataLoading = false;

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])

.controller('FinishRegisterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ConnectionService, config) {
        $scope.finishRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishRegistration($scope.username, $scope.password, $routeParams.id,
                function (response) {
                    ConnectionService.AddLoginMessage("Account created. Login with your new account");
                    $location.path('/login');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
    .controller('ForgotController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                // reset login status
                // AuthenticationService.ClearCredentials();

                $scope.forgotpassword = function () {
                    $scope.dataLoading = true;
                    $scope.errors = null;
                    AuthenticationService.ForgotPassword($scope.email, $scope.ssn,
                        function (response) {
                            $scope.confirmation = "Got it. Check your .mil email for further instructions.";
                            $scope.dataLoading = false;

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
    .controller('ForgotUsernameController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                // reset login status
                // AuthenticationService.ClearCredentials();

                $scope.forgotusername = function () {
                    $scope.dataLoading = true;
                    $scope.errors = null;
                    AuthenticationService.ForgotUsername($scope.ssn,
                        function (response) {

                            ConnectionService.AddLoginMessage("Your username was sent to your .mil email.");
                            $location.path('/login');

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
    .controller('ChangePasswordController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                $scope.changePassword = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.ChangePassword($scope.oldPassword, $scope.newPassword,
                        function (response) {
                            ConnectionService.AddLoginMessage("Password successfully changed. Please log in with your new password.");
                            $location.path('/login');

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
	.controller('FinishResetController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ConnectionService, config) {
        $scope.finishReset = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishReset($scope.password, $routeParams.id,
                function (response) {
                    ConnectionService.AddLoginMessage("Password reset. Please login with your new password.");
                    $location.path('/login');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
	.controller('CreateUserController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, ConnectionService, config) {

        $scope.errors = [];
        $scope.messages = [];
        $scope.newUser = {};

        ProfileService.GetAllLists(
            // If we succeed, this is our call back
            function (response) {
                $scope.lists = response.ReturnValue;

            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        $scope.trimString = function (str) {
            if (str) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            return '';
        };

        $scope.isValidSSN = function (number) {
            var re = /^\d{3}-?\d{2}-?\d{4}$/;
            return re.test(number);
        };

        $scope.createUser = function () {
            $scope.errors = [];
            $scope.messages = [];
            $scope.dataLoading = true;
            AuthenticationService.CreateUser($scope.newUser,
                function (response) {
                    $scope.messages.push("User created. Please instruct them to register their account.");
                    $scope.dataLoading = false;
                    $location.path('/profile/' + response.ReturnValue);

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }]);