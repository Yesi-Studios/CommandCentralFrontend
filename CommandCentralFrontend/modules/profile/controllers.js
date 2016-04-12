'use strict';
 
angular.module('Profiles')
 
.controller('ProfileController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService) {
		
		$scope.loadProfile = function(){
			$scope.dataLoading = true;
			$scope.error = "";
			
			ProfileService.LoadProfile($routeParams.id, function(response) {
				console.log(JSON.stringify(response));
				if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.dataLoading = false;
						$scope.profileData = response.ReturnValue.Person;
						$scope.isMyProfile = response.ReturnValue.IsMyProfile;
						$scope.returnableFields = response.ReturnValue.ReturnableFields;
						$scope.editableFields = response.ReturnValue.EditableFields;
						
						$scope.profileData.DateOfBirth = new Date(response.ReturnValue.Person.DateOfBirth);
						$scope.profileData.DateOfArrival = new Date(response.ReturnValue.Person.DateOfArrival);
						$scope.profileData.DateOfDeparture = new Date(response.ReturnValue.Person.DateOfDeparture);
						$scope.profileData.EAOS = new Date(response.ReturnValue.Person.EAOS);
						$scope.profileData.ClaimTime = new Date(response.ReturnValue.Person.ClaimTime);
						
						/*var adjustedDate = new Date(response.ReturnValue.DateOfBirth);
						adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset()/60)
						$scope.profileData.DateOfBirth = adjustedDate;
						
						adjustedDate = new Date(response.ReturnValue.DateOfArrival);
						adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset()/60)
						$scope.profileData.DateOfArrival = adjustedDate;
						
						adjustedDate = new Date(response.ReturnValue.DateOfDeparture);
						adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset()/60)
						$scope.profileData.DateOfDeparture = adjustedDate;
						
						adjustedDate = new Date(response.ReturnValue.EOAS);
						adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset()/60)
						$scope.profileData.EOAS = adjustedDate;
						
						adjustedDate = new Date(response.ReturnValue.ClaimTime);
						adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset()/60)
						$scope.profileData.ClaimTime = adjustedDate;*/
						
						$scope.canSearchPersonField = function(field){
							return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.searchable.indexOf(field) > -1);
						}
						$scope.canReturnPersonField = function(field){
							return $scope.returnableFields.indexOf(field) > -1;
							// OLD FUNCTIONALITY:
							//return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.returnable.indexOf(field) > -1);
						}
						$scope.canEditPersonField = function(field){
							return $scope.editableFields.indexOf(field) > -1;
							// OLD FUNCTIONALITY:
							//return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.editable.indexOf(field) > -1);
						}
						
						
					});
					
					ProfileService.TakeLock($scope.profileData.ID, function (response) {
						if(!response.HasError) {
							$scope.$apply(function() {
								$scope.haveLock = true;
							});
						} else {
							$scope.$apply(function() {
								$scope.haveLock = false;
								$scope.lockMessage = response.ErrorMessage;
							});
						}
					
					});
					
					ProfileService.GetCommands(function(response) {
						if(!response.HasError) {
							$scope.$apply(function() {
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
						} else {
							$scope.$apply(function() {
								$scope.error = response.ErrorMessage;
								$scope.dataLoading = false;
								AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessage);
								$location.path('/login');
							});
						}
					});
                } else {
					AuthenticationService.ClearCredentials();
                    $scope.$apply(function() {
						$scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
						AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessage);
						$location.path('/login');
					});
				}
			});
		};
		
		ProfileService.GetAllLists(function(response) {
			$scope.$apply(function() {
				$scope.lists = response.ReturnValue;
				$scope.getListOptions = function(listName) {
					for (var i = 0, len = $scope.lists.length; i < len; i++) {
						if ($scope.lists[i].Name === listName)
							return $scope.lists[i].Values; // Return as soon as the object is found
						}
					return null; // The object was not found
				};
			});
		 });
		
		ProfileService.GetPermissionGroups(function(response) {
			$scope.$apply(function() {
				$scope.permissionGroups = response.ReturnValue;
				
			});
		 });
		$scope.loadProfile();
		
		$scope.updateProfile = function() {
			$scope.dataLoading = true;
			ProfileService.UpdateMyProfile($scope.profileData, function(response) {
				if(!response.HasError) {
					$scope.$apply(function() {
							$scope.loadProfile();
					});
				} else {
					$scope.$apply(function() {
						$scope.error = response.ErrorMessage;
						$scope.dataLoading = false;
						AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessage);
						$location.path('/login');
					});
				}
			});
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