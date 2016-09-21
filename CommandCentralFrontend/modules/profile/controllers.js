'use strict';

angular.module('Profiles')

    .controller('ProfileController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, ConnectionService, config) {

                /*
                 *   This function chain is a little hefty, so a preface is warranted.
                 *
                 *   This is how we actually load the profile.
                 *   In this explanation, I'm assuming success on all backend calls. If that's not the case, the error is displayed at
                 *   the top of the screen, and, depending on the error, we may be kicked back to the login screen.
                 *
                 *   First, we call LoadProfile. We take the response and apply all appropriate data to the scope, converting anything
                 *   that needs it. We create functions the scope can use to check to see if the user has permission to search, return,
                 *   or edit a field, making properly displaying of the data easier.
                 *
                 *   After that, in the .then() after LoadProfile, we call TakeLock. The .then() call works because we return the promise
                 *   from the http call all the way up to the controller. This allows the user to edit the profile, making sure that no
                 *   one else is at the moment. Successfully acquiring the lock enables saving.
                 *
                 *   At the same time as we request a lock, we also GetCommands. This gets the structure of all available commands, so
                 *   that we can properly prompt the user with the right divisions in departments in commands, e.g., if they select
                 *   10 department at NIOC GA, we know to show them 11, 12, and 13 divisions. We also use this information to fill in the command,
                 *   department, and division information in $scope.profileData, since the backend doesn't want to send it through JSON to avoid
                 *   dealing with excessive circular dependancies.
                 */
                $scope.loadProfile = function () {
                    $scope.dataLoading = true;
                    $scope.errors = [];

                    $scope.getByName = function (theThings, thingName) {
                        if (theThings) {
                            for (var i = 0, len = theThings.length; i < len; i++) {
                                if (theThings[i].Name === thingName)
                                    return theThings[i]; // Return as soon as the object is found
                            }
                        }
                        return null; // The object was not found
                    };

                    $scope.getById = function (theThings, thingId) {
                        if (theThings) {
                            for (var i = 0, len = theThings.length; i < len; i++) {
                                if (theThings[i].Id === thingId)
                                    return theThings[i]; // Return as soon as the object is found
                            }
                        }
                        return null; // The object was not found
                    };

                    ProfileService.LoadProfile($routeParams.id,
                        function (response) {

                            // Set all the scope variables that matter the most.
                            $rootScope.containsPII = true;
                            $scope.dataLoading = false;
                            $scope.friendlyName = response.ReturnValue.FriendlyName;
                            $scope.profileData = response.ReturnValue.Person;
                            $scope.isMyProfile = response.ReturnValue.IsMyProfile;
                            $scope.returnableFields = response.ReturnValue.ResolvedPermissions.ReturnableFields.Main.Person;
                            $scope.editableFields = response.ReturnValue.ResolvedPermissions.EditableFields.Main.Person;

                            // Set up all the dates to be actual Dates
                            $scope.profileData.DateOfBirth = new Date(response.ReturnValue.Person.DateOfBirth);
                            $scope.profileData.DateOfArrival = new Date(response.ReturnValue.Person.DateOfArrival);
                            $scope.profileData.DateOfDeparture = new Date(response.ReturnValue.Person.DateOfDeparture);
                            $scope.profileData.EAOS = new Date(response.ReturnValue.Person.EAOS);
                            $scope.profileData.ClaimTime = new Date(response.ReturnValue.Person.ClaimTime);


                            $scope.canSearchPersonField = function (field) {
                                return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.searchable.indexOf(field) > -1);
                            };
                            $scope.canReturnPersonField = function (field) {
                                return $scope.returnableFields.indexOf(field) > -1;
                            };
                            $scope.canEditPersonField = function (field) {
                                return $scope.editableFields.indexOf(field) > -1;
                            }
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    ).then(function () {
                        // This is where LoadProfile ends, and the follow ups begin. We use .then above to make sure we don't try to take a
                        // lock on a profile that we haven't loaded, or try to process commands when we haven't loaded the profile's command.

                        ProfileService.TakeLock($routeParams.id,
                            // If we succeed, this is our callback.
                            function (response) {
                                // Hey, we have a lock. Sweet.
                                $scope.haveLock = true;
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );

                        ProfileService.GetCommands(
                            // If we succeed, this is our callback
                            function (response) {
                                // Give our scope the commands and a function we can use to search inside them
                                $scope.commandList = response.ReturnValue.Command;

                                $scope.command = $scope.getById(response.ReturnValue.Command, $scope.profileData.Command);

                                // Fill in the objects where currently only Ids exist.
                                $scope.profileData.Command = $scope.command;
                                if($scope.profileData.Command) {
                                    $scope.profileData.Department = $scope.getById($scope.profileData.Command.Departments, $scope.profileData.Department);
                                    if ($scope.profileData.Department) {
                                        $scope.profileData.Division = $scope.getById($scope.profileData.Department.Divisions, $scope.profileData.Division);
                                    } else {
                                        $scope.profileData.Division = {};
                                    }
                                } else {
                                    $scope.profileData.Department = {};
                                }
                                if(config.debugMode) console.log($scope.form.$error);
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );
                    });
                };

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

                /*ProfileService.GetPermissionGroups(
                 // If we succeed, this is our callback.
                 function (response) {
                 $scope.permissionGroups = response.ReturnValue;

                 },
                 // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                 function (response) {
                 ConnectionService.HandleServiceError(response, $scope, $location);
                 }
                 );*/
                $scope.loadProfile();

                $scope.loadFullAccountHistory = function () {
                    ProfileService.LoadAccountHistory($scope.profileData.Id,
                        // If we succeed, this is our call back
                        function (response) {
                            $scope.profileData.AccountHistory = response.ReturnValue;

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );

                };

                $scope.updateProfile = function () {
                    $scope.dataLoading = true;
                    $scope.profileUpdateSuccess = false;
                    // Update the profile with the data currently on this page (used when "Save Profile" button is clicked)

                    ProfileService.UpdateMyProfile($scope.profileData,
                        // If we succeed, this is our callback
                        function (response) {
                            $scope.profileUpdateSuccess = true;
                            $scope.loadProfile()
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };

                $scope.makePreferred = function (listOfItems, preferredOne) {
                    for (var i = 0; i < listOfItems.length; ++i) {
                        listOfItems[i].IsPreferred = false;
                    }
                    listOfItems[listOfItems.indexOf(preferredOne)].IsPreferred = true;
                    return listOfItems;
                };

                $scope.makeHome = function (listOfItems, home) {
                    for (var i = 0; i < listOfItems.length; ++i) {
                        listOfItems[i].IsHomeAddress = false;
                    }
                    listOfItems[listOfItems.indexOf(home)].IsHomeAddress = true;
                    return listOfItems;
                };

                $scope.addNewNumber = function (number, phoneType, contactable, preferred) {
                    if (preferred) {
                        for (var i = 0; i < $scope.profileData.PhoneNumbers.length; ++i) {
                            $scope.profileData.PhoneNumbers[i].IsPreferred = false;
                        }
                    }
                    $scope.profileData.PhoneNumbers.push({ "Number": number, "PhoneType": phoneType, "IsContactable": contactable, "IsPreferred": preferred });

                };

                $scope.addNewEmail = function (email, contactable, preferred) {
                    if (preferred) {
                        for (var i = 0; i < $scope.profileData.EmailAddresses.length; ++i) {
                            $scope.profileData.EmailAddresses[i].IsPreferred = false;
                        }
                    }
                    $scope.profileData.EmailAddresses.push({ "Address": email, "IsContactable": contactable, "IsPreferred": preferred });

                };

                $scope.addNewAddress = function (street, city, state, zip, country, home) {
                    if (home) {
                        for (var i = 0; i < $scope.profileData.PhysicalAddresses.length; ++i) {
                            $scope.profileData.PhysicalAddresses[i].IsHomeAddress = false;
                        }
                    }
                    $scope.profileData.PhysicalAddresses.push({ "Address": street, "City": city, "State": state, "ZipCode": zip, "Country": country, "IsHomeAddress": home });

                };

                $scope.isValidEmail = function (email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };

                $scope.isValidPhoneNumber = function (number) {
                    var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
                    return re.test(number);
                };

                $scope.isValidSSN = function (number) {
                    var re = /^\d{3}-?\d{2}-?\d{4}$/;
                    return re.test(number);
                };

                $scope.trimString = function (str) {
                    if (str) {
                        return str.replace(/^\s+|\s+$/g, '');
                    }
                    return '';
                };
            }]);