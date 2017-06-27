'use strict';

angular.module('Profiles')

    .controller('ProfileController',
        ['$scope', '$rootScope', '$location', '$routeParams', '$filter', 'AuthenticationService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, $filter, AuthenticationService, ProfileService, ConnectionService, config) {

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
                            $scope.returnableFields = response.ReturnValue.ResolvedPermissions.ReturnableFields.Person;
                            $scope.editableFields = response.ReturnValue.ResolvedPermissions.EditableFields.Person;

                            // Set up all the dates to be actual Dates
                            if (response.ReturnValue.Person.DateOfBirth) $scope.profileData.DateOfBirth = new Date(response.ReturnValue.Person.DateOfBirth);
                            console.log(response.ReturnValue.Person.DateOfBirth);
                            if (response.ReturnValue.Person.DateOfArrival) $scope.profileData.DateOfArrival = new Date(response.ReturnValue.Person.DateOfArrival);
                            if (response.ReturnValue.Person.DateOfDeparture) $scope.profileData.DateOfDeparture = new Date(response.ReturnValue.Person.DateOfDeparture);
                            if (response.ReturnValue.Person.EAOS) $scope.profileData.EAOS = new Date(response.ReturnValue.Person.EAOS);
                            if (response.ReturnValue.Person.PRD) $scope.profileData.PRD = new Date(response.ReturnValue.Person.PRD);
                            if (response.ReturnValue.Person.ClaimTime) $scope.profileData.ClaimTime = new Date(response.ReturnValue.Person.ClaimTime);
                            if (response.ReturnValue.Person.GTCTrainingDate) $scope.profileData.GTCTrainingDate = new Date(response.ReturnValue.Person.GTCTrainingDate);
                            if (response.ReturnValue.Person.ADAMSTrainingDate) $scope.profileData.ADAMSTrainingDate = new Date(response.ReturnValue.Person.ADAMSTrainingDate);

                            $scope.canSearchPersonField = function (field) {
                                return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.searchable.indexOf(field) > -1);
                            };
                            $scope.canReturnPersonField = function (field) {
                                return $scope.returnableFields.indexOf(field) > -1;
                            };
                            $scope.canEditPersonField = function (field) {
                                return $scope.editableFields.indexOf(field) > -1;
                            }
                        }, ConnectionService.HandleServiceError($scope, $location)
                    ).then(function () {
                        // This is where LoadProfile ends, and the follow ups begin. We use .then above to make sure we don't try to take a
                        // lock on a profile that we haven't loaded, or try to process commands when we haven't loaded the profile's command.

                        ProfileService.TakeLock($routeParams.id,
                            // If we succeed, this is our callback.
                            function (response) {
                                // Hey, we have a lock. Sweet.
                                $scope.haveLock = true;

                                // Hey, let's save that lock. Sweet.
                                $scope.profileLock = response.ReturnValue;

                                $scope.$on('$locationChangeStart', function (event, next, current) {
                                    if ($scope.profileLock && next.substr(next.length-5).toLowerCase() !== "login") {
                                        var lockId = $scope.profileLock.Id;
                                        $scope.profileLock = null;
                                        ProfileService.ReleaseLock(lockId, false, function (response) {},
                                            ConnectionService.HandleServiceError($scope, $location));
                                    }
                                });
                            }, ConnectionService.HandleServiceError($scope, $location));

                        $scope.loadFullAccountHistory();

                        ProfileService.GetCommands(
                            // If we succeed, this is our callback
                            function (response) {
                                // Give our scope the commands and a function we can use to search inside them
                                $scope.commandList = response.ReturnValue.Command;

                                $scope.command = $scope.getById(response.ReturnValue.Command, $scope.profileData.Command);

                                // Fill in the objects where currently only Ids exist.
                                $scope.profileData.Command = $scope.command;
                                if ($scope.profileData.Command) {
                                    $scope.profileData.Department = $scope.getById($scope.profileData.Command.Departments, $scope.profileData.Department);
                                    if ($scope.profileData.Department) {
                                        $scope.profileData.Division = $scope.getById($scope.profileData.Department.Divisions, $scope.profileData.Division);
                                    } else {
                                        $scope.profileData.Division = null;
                                    }
                                } else {
                                    $scope.profileData.Department = null;
                                }
                                if (config.debugMode) console.log($scope.form.$error);
                            }, ConnectionService.HandleServiceError($scope, $location));

                        ProfileService.GetChainOfCommand($routeParams.id, function (response) {if (config.debugMode) console.log("HERE");
                         if (config.debugMode) console.log(response);
                         $scope.chainOfCommand = response.ReturnValue;
                         }, ConnectionService.HandleServiceError($scope, $location));
                    });
                };

                ProfileService.LoadInputRequirements(function(response){
                    $scope.inputRequirements = response.ReturnValue;
                }, ConnectionService.HandleServiceError($scope, $location));

                ProfileService.GetAllLists(
                    // If we succeed, this is our call back
                    function (response) {
                        $scope.lists = response.ReturnValue;
                        $scope.defaultPhoneType = $filter('filter')(response.ReturnValue.PhoneNumberType, {Value: "Home"})[0];
                    }, ConnectionService.HandleServiceError($scope, $location));

                $scope.loadFullAccountHistory = function () {
                    ProfileService.LoadAccountHistory($routeParams.id,
                        // If we succeed, this is our call back
                        function (response) {
                            $scope.profileData.AccountHistory = response.ReturnValue;
                        }, ConnectionService.HandleServiceError($scope, $location));

                };

                $scope.loadProfile();

                $scope.updateProfile = function () {
                    $scope.dataLoading = true;
                    $scope.profileUpdateSuccess = false;
                    // Check to see if the Primary NEC is also one of the Secondary NECs. If it is, remove it.
                    for (var j in $scope.profileData.SecondaryNECs) {
                        if ($scope.profileData.SecondaryNECs[j].Id === $scope.profileData.PrimaryNEC.Id) {
                            $scope.profileData.SecondaryNECs.splice(j, 1);
                        }
                    }

                    for (var k in $scope.profileData.SubscribedEvents) {
                        if (!$scope.profileData.SubscribedEvents[k] || $scope.profileData.SubscribedEvents[k] === 'None') {
                            delete $scope.profileData.SubscribedEvents[k];
                        }
                    }

                    // Update the profile with the data currently on this page (used when "Save Profile" button is clicked)

                    ProfileService.UpdateMyProfile($scope.profileData,
                        // If we succeed, this is our callback
                        function (response) {
                            $scope.profileUpdateSuccess = true;
                            $scope.form.$setPristine();
                            $scope.loadProfile()
                        }, ConnectionService.HandleServiceError($scope, $location));
                };

                $scope.canDeleteEmail = function (email) {
                    if (email.substr(email.length - 4) != '.mil') {
                        return true;
                    }

                    var c = 0;
                    for (var i in $scope.profileData.EmailAddresses) {
                        if ($scope.profileData.EmailAddresses[i].Address.substr($scope.profileData.EmailAddresses[i].Address.length - 4) == '.mil') {
                            c += 1;
                        }
                    }
                    return c != 1;
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