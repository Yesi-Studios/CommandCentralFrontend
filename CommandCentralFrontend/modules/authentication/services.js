'use strict';
 
angular.module('Authentication')
 
.factory('AuthenticationService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout',
    function (Base64, $http, $localStorage, $rootScope, $timeout) {
        var service = {};
        var apikey = "768482c5-e5fb-43f2-a7f7-10c2b961fad3";//"0ab78de1-b5b5-4a07-a272-219cbd103436"; //"f6ec2c55-7571-43bb-8a6e-f1eccc76244b"; //*/"33e0e8d0-0d1c-4880-9ba7-069eea5d1210"; //"C7C6A39A-C75F-433E-A808-E8A8922ED2FC" Slightly old API Key    // "A114899B-DC0B-4A71-8BB8-9C65B5748B6C" Old API Key
        var backendURL = "http://73.20.152.170";//*/ "http://147.51.62.19";
        var backendPort = $localStorage.backendPort;
        var baseurl = backendURL + ":" + backendPort;

        service.GetBackendURL = function () {
            return backendURL + ":" + backendPort;
        }

        service.SetBackendPort = function (portnumber) {
            backendPort = portnumber;
            baseurl = backendURL + ":" + backendPort;
            $localStorage.backendPort = portnumber;
        }

        service.GetAPIKey = function () {
            return apikey;
        }		
		
        service.Login = function (username, password, success, error) {
			var reqData = {'username' : username, 'password': password, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/Login";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    if (status == "error") {
				        error({ "ErrorType": "Authentication", "ErrorMessages": ["The service is offline. If this message persists, please contact the developers."] });
				    } else {
				        var returnContainer = JSON.parse(response.responseJSON);
				        error(returnContainer);
				    }
				}
			});
		
            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------
            $timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);*/

        };
		
		service.AddLoginMessage = function(loginMessage) {
			if($rootScope.globals.loginMessages){
				$rootScope.globals.loginMessages.push(loginMessage);
			} else {
				$rootScope.globals.loginMessages = [loginMessage];
			}
		}
		
		service.ClearLoginMessages = function(){
			$rootScope.globals.loginMessages = [];
		}
		
		service.GetLoginMessages = function(){
			return $rootScope.globals.loginMessages;
		}
		
		service.AddLoginError = function(loginError) {
			if($rootScope.globals.loginErrors){
				$rootScope.globals.loginErrors.push(loginError);
			} else {
				$rootScope.globals.loginErrors = [loginError];
			}
		}
		
		service.ClearLoginErrors = function(){
			$rootScope.globals.loginErrors = [];
		}
		
		service.GetLoginErrors = function(){
			return $rootScope.globals.loginErrors;
		}
		
		
		service.Logout = function (success, error) {
			var reqData = {'authenticationtoken': $localStorage.globals.currentUser.authtoken, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/Logout";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};
		
		service.FinishRegistration = function (username, password, id, success, error) {
			var reqData = {'username' : username, 'password' : password, 'accountconfirmationid' : id, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/CompleteRegistration";
			
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};
		
		service.BeginRegistration = function (ssn, success, error) {
			var reqData = {'ssn' : ssn, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/BeginRegistration";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};
		
		service.ForgotPassword = function (email, ssn, success, error) {
			var reqData = {'email' : email, 'ssn' : ssn, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/BeginPasswordReset";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};
		
		service.FinishReset = function (password, id, success, error) {
			var reqData = {'Password' : password, 'PasswordResetid' : id, 'apikey' : apikey};
			var serviceurl =  service.GetBackendURL() + "/CompletePasswordReset";
			
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};
		
        service.SetCredentials = function (username, authtoken, userID) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authtoken: authtoken,
					userID: userID
                }
            };
 
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $localStorage.globals = $rootScope.globals;
        };
 
        service.ClearCredentials = function () {
            delete $rootScope.globals.currentUser;
            delete $localStorage.globals
            //$http.defaults.headers.common.Authorization = 'Basic ';
        };
		
		service.GetAuthToken = function () {
			if( $localStorage.globals && $localStorage.globals.currentUser && $localStorage.globals.currentUser.authtoken){
				return $localStorage.globals.currentUser.authtoken;
			} else {
				return null;
			}
				
		};
		
		service.GetCurrentUserID = function () {
		    if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.userID) {
				return $rootScope.globals.currentUser.userID;
			} else {
				return null;
			}
		
		};
 
        return service;
    }])
 
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});