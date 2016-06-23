'use strict';
 
angular.module('Profiles')
 
.controller('ProfileController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService) {
		
		$scope.loadProfile = function(){
			$scope.dataLoading = true;
			$scope.errors = null;
			
			ProfileService.LoadProfile($routeParams.id,
                function (response) {
				        $scope.$apply(function () {

                            // Set all the scope variables that matter the most.
				            $rootScope.containsPII = true;
						    $scope.dataLoading = false;
						    $scope.profileData = response.ReturnValue.Person;
						    $scope.isMyProfile = response.ReturnValue.IsMyProfile;
						    $scope.returnableFields = response.ReturnValue.ReturnableFields;
						    $scope.editableFields = response.ReturnValue.EditableFields;
						
                            // Set up all the dates to be actual Dates
						    $scope.profileData.DateOfBirth = new Date(response.ReturnValue.Person.DateOfBirth);
						    $scope.profileData.DateOfArrival = new Date(response.ReturnValue.Person.DateOfArrival);
						    $scope.profileData.DateOfDeparture = new Date(response.ReturnValue.Person.DateOfDeparture);
						    $scope.profileData.EAOS = new Date(response.ReturnValue.Person.EAOS);
						    $scope.profileData.ClaimTime = new Date(response.ReturnValue.Person.ClaimTime);
						
						    $scope.canSearchPersonField = function(field){
							    return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.searchable.indexOf(field) > -1);
						    }
						    $scope.canReturnPersonField = function(field){
							    return $scope.returnableFields.indexOf(field) > -1;
						    }
						    $scope.canEditPersonField = function(field){
							    return $scope.editableFields.indexOf(field) > -1;
						    }
						
						
					    });
					
				        ProfileService.TakeLock($scope.profileData.Id,
                            // If we succeed, this is our callback.
                            function (response) {
                                $scope.$apply(function () {
                                    // Hey, we have a lock. Sweet.
								    $scope.haveLock = true;
							    });
                            },
                            // If we fail, this is our call back (nearly the same for all backend calls)
                            function (response) {
                                $scope.$apply(function () {
                                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                        for (i = 0; i < response.ErrorMessages.length; i++) {
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
					
					    ProfileService.GetCommands(
                            // If we succeed, this is our callback
                            function (response) {
                                $scope.$apply(function () {
                                    // Give our scope the commands and a function we can use to search inside them
								    $scope.commandList = response.ReturnValue;
								    $scope.getByName = function(theThings, thingName) {
									    if(theThings){
										    for (var i = 0, len = theThings.length; i < len; i++) {
											    if (theThings[i].Name === thingName)
												    return theThings[i] // Return as soon as the object is found
											    }
									    }
									    return null; // The object was not found
								    };
								    $scope.command = $scope.getByName(response.ReturnValue, $scope.profileData.Command);
							    });
					        },
                            // If we fail, this is our call back (nearly the same for all backend calls)
                            function (response) {
                                $scope.$apply(function () {
                                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                        for (i = 0; i < response.ErrorMessages.length; i++) {
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
				    },
                    // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (i = 0; i < response.ErrorMessages.length; i++) {
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
		
		ProfileService.GetAllLists(
            // If we succeed, this is our call back
            function (response) {
			    $scope.$apply(function() {
				    $scope.lists = response.ReturnValue;
			    });
		    },
            // If we fail, this is our call back (nearly the same for all backend calls)
            function (response) {
                $scope.$apply(function () {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (i = 0; i < response.ErrorMessages.length; i++) {
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
		
		ProfileService.GetPermissionGroups(
            // If we succeed, this is our callback.
            function(response) {		    
                $scope.$apply(function() {		        
                    $scope.permissionGroups = response.ReturnValue;				
		        });
		    },
            // If we fail, this is our call back (nearly the same for all backend calls)
            function(response) {
                $scope.$apply(function () {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (i = 0; i < response.ErrorMessages.length; i++) {
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
		$scope.loadProfile();

		$scope.loadFullAccountHistory = function () {
		    ProfileService.LoadAccountHistory($scope.profileData.Id,
                // If we succeed, this is our call back
                function (response) {
		            $scope.$apply(function () {
		                $scope.profileData.AccountHistory = response.ReturnValue;
		            });
		        },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (i = 0; i < response.ErrorMessages.length; i++) {
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
		
		$scope.updateProfile = function() {
		    $scope.dataLoading = true;
            // Update the profile with the data currently on this page (used when "Save Profile" button is clicked)
			ProfileService.UpdateMyProfile($scope.profileData,
                // If we succeed, this is our callback
                function (response) {
			        $scope.$apply(function () {
			            $scope.loadProfile();
			        })
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function(response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
				        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
				            for (i = 0; i < response.ErrorMessages.length; i++) {
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
		
		$scope.makePreferred = function(listOfItems, preferredOne) {
			for (var i = 0; i < listOfItems.length; ++i) {
				listOfItems[i].IsPreferred = false;
			}
			listOfItems[listOfItems.indexOf(preferredOne)].IsPreferred = true;
			return listOfItems;
		};
		
		$scope.makeHome = function(listOfItems, home) {
			for (var i = 0; i < listOfItems.length; ++i) {
				listOfItems[i].IsHomeAddress = false;
			}
			listOfItems[listOfItems.indexOf(home)].IsHomeAddress = true;
			return listOfItems;
		};
		
		$scope.addNewNumber = function(number, contactable, preferred) {
			if(preferred) {
				for (var i = 0; i < $scope.profileData.PhoneNumbers.length; ++i) {
					$scope.profileData.PhoneNumbers[i].IsPreferred = false;
				}
			}
			$scope.profileData.PhoneNumbers.push({ "Number": number, "PhoneType" : phoneType, "IsContactable": contactable, "IsPreferred": preferred });
			
		};
		
		$scope.addNewEmail = function(email, contactable, preferred) {
			if(preferred) {
				for (var i = 0; i < $scope.profileData.EmailAddresses.length; ++i) {
					$scope.profileData.EmailAddresses[i].IsPreferred = false;
				}
			}
			$scope.profileData.EmailAddresses.push({ "Address": email ,  "IsContactable": contactable, "IsPreferred": preferred });
			
		};
		
		$scope.addNewAddress = function(number, street, city, state, zip, country, home) {
			if(home) {
				for (var i = 0; i < $scope.profileData.PhysicalAddresses.length; ++i) {
					$scope.profileData.PhysicalAddresses[i].IsHomeAddress = false;
				}
			}
			$scope.profileData.PhysicalAddresses.push({ "StreetNumber": number, "Route": street, "City": city, "State": state, "ZipCode": zip, "Country": country, "IsHomeAddress": home });
			
		};
		
		$scope.isValidEmail = function(email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		};
		
		$scope.isValidPhoneNumber = function(number) {
			var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
			return re.test(number);
		};
		
		$scope.isValidSSN = function(number) {
			var re = /^\d{3}-?\d{2}-?\d{4}$/
			return re.test(number);
		};
		
		$scope.trimString = function(str) {
			if(str) {
				return str.replace(/^\s+|\s+$/g,'');
			}
			return '';
		};
    }]);