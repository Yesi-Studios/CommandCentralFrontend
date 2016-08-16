'use strict';

angular.module('Connection')

    .factory('ConnectionService',
        ['$http', '$localStorage', '$rootScope',
            function ($http, $localStorage, $rootScope) {
                var service = {};

                // Information for connecting to the database, including the URL and API key.
                var apikey = "90fdb89f-282b-4bd6-840b-cef597615728";
                var backendURL = "http://73.20.152.170";  // Atwood's IP for working at home.
                //var backendURL = "http://147.51.62.19";     // Live service IP.

                // Here we check to see if we have a port stored in localStorage, and if not, we use 1113.
                // If it's enabled, there's a widget at the bottom of index.html, controlled by this module,
                // that allows the user to set the port to look for the service on. This is for development,
                // and must be disabled before live launch.
                var backendPort;
                if ($localStorage.backendPort) {
                    backendPort = $localStorage.backendPort;
                } else {
                    backendPort = "1113";
                }
                // Uncomment this before release to make sure the right port is set for the end user.
                // backendPort = "1113";

                // Create the base URL for all REST calls
                var baseurl = backendURL + ":" + backendPort;

                // If you can't figure out what this does, stop reading and go get an adult.
                /**
                 * @return {string}
                 */
                service.GetBackendURL = function () {
                    return backendURL + ":" + backendPort;
                };

                // This too.
                service.SetBackendPort = function (portnumber) {
                    backendPort = portnumber;
                    baseurl = backendURL + ":" + backendPort;
                    $localStorage.backendPort = portnumber;
                };

                // Ditto
                /**
                 * @return {string}
                 */
                service.GetAPIKey = function () {
                    return apikey;
                };

                // Login page error displaying. This seems like it should be in the Authentication module, but actually this is part of backend service error handling, and
                // belongs here. Also, keeping it here prevents a circular dependancy between Authentication and Connection.

                service.AddLoginMessage = function (loginMessage) {
                    if ($rootScope.globals.loginMessages) {
                        $rootScope.globals.loginMessages.push(loginMessage);
                    } else {
                        $rootScope.globals.loginMessages = [loginMessage];
                    }
                };

                service.ClearLoginMessages = function () {
                    $rootScope.globals.loginMessages = [];
                };

                service.GetLoginMessages = function () {
                    return $rootScope.globals.loginMessages;
                };

                service.AddLoginError = function (loginError) {
                    if ($rootScope.globals.loginErrors) {
                        $rootScope.globals.loginErrors.push(loginError);
                    } else {
                        $rootScope.globals.loginErrors = [loginError];
                    }
                };

                service.ClearLoginErrors = function () {
                    $rootScope.globals.loginErrors = [];
                };

                service.GetLoginErrors = function () {
                    return $rootScope.globals.loginErrors;
                };


                service.ClearCredentials = function () {
                    delete $rootScope.globals.currentUser;
                    delete $localStorage.globals
                };

                // This is a convenience function. Just about every controller handles service errors the same way, so we just feed this
                // function the appropriate $scope and the $location service and let it handle the work. The Authentication controller has
                // a customized version of this for handling errors when we're already on the login page.
                service.HandleServiceError = function (response, scope, location) {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                            service.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                        }
                        service.ClearCredentials();
                        location.path('/login');
                    } else {
                        // If it's any other type of error, we can just show it to them on this page.
                        scope.errors = response.ErrorMessages;
                    }
                    scope.dataLoading = false;

                };

                /** @param {String} endpoint
                 * @param {Function} success
                 * @param {Function} error
                 * @param {Object} params **/
                service.RequestFromBackend = function (endpoint, params, success, error) {
                    var reqData = { 'apikey': service.GetAPIKey() };
                    for (var attrname in params) { reqData[attrname] = params[attrname]; } // Merge params into our reqData

                    var serviceurl = service.GetBackendURL() + "/" + endpoint; // Make the url we need

                    var config = {
                        method: 'POST',
                        url: serviceurl,
                        data: reqData,
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8;'
                        }
                    };

                    return $http(config).then(function (response) { // The return here is important. $http returns a promise, and the controllers need that.
                            success(service.RestoreJsonNetReferences(JSON.parse(response.data)));
                            console.log(endpoint);
                            console.log(service.RestoreJsonNetReferences(response.data));
                        },
                        function (response) {
                            if (response.statusText == "") {
                                error({ "ErrorType": "Authentication", "ErrorMessages": ["The service is offline. If this message persists, please contact the developers."] });
                            } else {
                                error(service.RestoreJsonNetReferences(JSON.parse(response.data)));
                            }
                        });
                };

                service.RestoreJsonNetReferences = function (theJSON) {
                    if (typeof theJSON === "string") { theJSON = JSON.parse(theJSON); }

                    // We declare these up here and have a nested function so that we can keep track of some global things while we recurse.
                    var originals = {};
                    var failures = [];

                    /**
                     * Fixes JSON objects that have the $id kind of circular references.
                     * @param {Object} theObject
                     * @param {Array} oldParents
                     * @returns {Object}
                     */
                    function fixTheObject(theObject, oldParents) {
                        // Base Case: If it's primitive or an empty object, just return it.
                        if (typeof theObject !== 'object' || !theObject) { return theObject; }

                        // Create a new copy of the array we were passed. This is because it's (obviously) passed by reference, and we don't want to modify the
                        // Parents array of the previous level, as we may be iterating over an array somewhere down the recursion chain, and don't want one array
                        // item's parents to affect another.
                        var theParents = oldParents.slice();

                        // If it is an array, it will be represented as an object with a "$values" property containing the array, and an "$id".
                        // If it's an array...
                        if (theObject.hasOwnProperty("$values")) {

                            // ...create an array of corrected values, and use that.
                            var newArray = [];

                            // Add this object/array to the Parents before we iterate over its values.
                            theParents.push(theObject["$id"]);

                            for (var j in theObject["$values"]) {
                                newArray.push(fixTheObject(theObject["$values"][j], theParents));
                            }

                            // If it's an array, it will have an $id. If it doesn't, the object isn't from JSON.net, and this code SHOULD break,
                            // so I'm not checking for it. That's your job. :D
                            // Store the array in the array of $id/object pairs in case we need it again.
                            originals[theObject["$id"]] = newArray;

                            return newArray;
                        }

                        // If we have "$id", then we're an original copy of an object. Remove that $id, iterate over the object and fix its
                        // properties, then store it by its $id in our originals. This could be combined with the final case at the end of this
                        // function, but it looks weird and feels wrong, soo nanny-nanny poo-poo, I'm not doing it.
                        if ("$id" in theObject) {
                            // Save the id before we delete it from the object so we can use it as a key in the originals array.
                            var id = theObject["$id"];
                            delete theObject["$id"];
                            theParents.push(id);

                            // Fix all the properties of the object recursively
                            for (var k in theObject) {
                                theObject[k] = fixTheObject(theObject[k], theParents);
                            }

                            // Store this object in the array of originals for use later
                            originals[id] = theObject;

                            return theObject;
                        }

                        // If it has a "$ref" property, we have to go get it from our array of stored objects.
                        if ("$ref" in theObject) {
                            // If this $ref exists in our Parents array, then we have a circular definition. Return a blank object to prevent an infinite loop.
                            if (theParents.indexOf(theObject["$ref"]) != -1) { return {}; }

                            // If not, and the $ref is in our originals array, return that.
                            if (theObject["$ref"] in originals) {
                                return originals[theObject["$ref"]];
                            }

                            // If we didn't hit the return statements above, that means this object hasn't be discovered yet. This shouldn't happen,
                            // but we're good little programmers who protect against theoretically possible edge cases. So we store it to be fixed later.
                            failures.push(theObject);
                        }

                        // If we get here, this object is untouched by JSON.net. Just to be sure, we'll check all its properties, but really we just
                        // need to return the object.
                        for (var i in theObject) {
                            theObject[i] = fixTheObject(theObject[i], theParents);
                        }
                        return theObject;

                    }

                    // Now just go through our failures and fill them in.
                    for (var i in failures) {
                        failures[i] = originals[failures[i]["$ref"]];
                    }

                    return fixTheObject(theJSON, []);

                };


                return service;
            }]);