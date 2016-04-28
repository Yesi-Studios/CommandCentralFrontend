'use strict';
 
angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ModalService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ModalService) {
        // reset login status
        AuthenticationService.ClearCredentials();
		
		// Show user appropriate message depending on where they came from. To be replaced with inter-page message service
		$scope.showresetmessage = $routeParams.wherefrom=="reset";
		$scope.showregistermessage = $routeParams.wherefrom=="registered";
		$scope.showlogoutmessage = $routeParams.wherefrom=="loggedout";
		$scope.wherefrom = $routeParams.wherefrom;
		
		$scope.errors = AuthenticationService.GetLoginErrors();
		$scope.messages = AuthenticationService.GetLoginMessages();
		
		// When they click login...
        $scope.login = function () {
			// Show that data is loading and clear the error message
            $scope.dataLoading = true;
            $scope.error = null;

            ModalService.showModal({
                templateUrl: 'modules/modals/views/privacyact.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if(result){

                        AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(!response.HasError) {
					console.log(response);
                    AuthenticationService.SetCredentials($scope.username, response.ReturnValue.AuthenticationToken, response.ReturnValue.PersonID);
					AuthorizationService.GetPersonsPermissions(function(response) {
						if(!response.HasError) {
							AuthorizationService.SetPermissions(response.ReturnValue.SearchableFields, response.ReturnValue.ReturnableFields, response.ReturnValue.EditableFields);
							
						} else {
							$scope.$apply(function() {
								$scope.error = response.ErrorMessage;
								$scope.dataLoading = false;
							});
						}
					}).then( function () {
						AuthorizationService.GetPermissionGroups(function(response) {
							if(!response.HasError) {
								AuthorizationService.SetPermissionGroups(response.ReturnValue);
							} else {
								$scope.$apply(function() {
									$scope.error = response.ErrorMessage;
									$scope.dataLoading = false;
								});
							}
						})
					})
					.done(function() {
						$scope.$apply(function() {
								$location.path('/');
							});
					});
                } else {
                    $scope.$apply(function() {
						$scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
					});
                }
            });
                    } else {
                        $scope.dataLoading = false;
                        $scope.error = "You must accept the Privacy Act Statement to continue";
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
            AuthenticationService.BeginRegistration($scope.password, function(response) {
                if(!response.HasError) {
					$scope.$apply(function() {
						$scope.accepted = true;
						$scope.dataLoading = false;
					});					
                } else {
					$scope.$apply(function() {
						$scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
					});
				}
            });
        };
    }])
	
.controller('FinishRegisterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {
		$scope.finishRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishRegistration($scope.username, $scope.password, $routeParams.id, function(response) {
                if(!response.HasError) {
                    $scope.$apply(function() {
						AuthenticationService.AddLoginMessage("Account created. Login with your new account");
						$location.path('/login');
					});
                } else {
					$scope.$apply(function() {
					    $scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
					});
                }
            });
        };
	}])
	.controller('ForgotController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        // AuthenticationService.ClearCredentials();
 
        $scope.forgotpassword = function () {
            $scope.dataLoading = true;
			$scope.error = "";
            AuthenticationService.ForgotPassword($scope.email, $scope.ssn, function(response) {
                if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.confirmation = "Got it. Check your .mil email for further instructions.";
						$scope.dataLoading = false;
					});
                } else {
					$scope.$apply(function() {
					    $scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
					});
                }
            });
        };
    }])
	.controller('FinishResetController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {
		$scope.finishReset = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishReset($scope.password, $routeParams.id, function(response) {
                if(!response.HasError) {
					$scope.$apply(function () {
						AuthenticationService.AddLoginMessage("Password reset. Please login with your new password.");
						$location.path('/login');
					});
                } else {
					$scope.$apply(function () {
						$scope.error = response.message;
						$scope.dataLoading = false;
					});
                }
            });
        };
	}]);