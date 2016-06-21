'use strict';
 
angular.module('Profiles')
 
.factory('ProfileService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
        /*service.GetList = function (name, callback) {
			var reqData = {'name' : name, 'apikey' : apikey};
			var serviceurl = baseurl + "/LoadReferenceLists";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
					callback({'HasError': true, 'ErrorMessage' : "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers."});
				}
			});

        };*/
		
		service.GetAllLists = function (callback) {
			var reqData = {'apikey' : apikey};
			var serviceurl = baseurl + "/LoadLists";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});

        };
		service.GetPermissionGroups = function (callback) {
			var reqData = {'apikey' : apikey};
			var serviceurl = baseurl + "/LoadPermissionGroups";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});

        };
		
		service.GetCommands = function (callback) {
			var reqData = {'Name' : name, 'apikey' : apikey, 'acceptcachedresults' : true};
			var serviceurl = baseurl + "/LoadCommands";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});

        };
		
		service.LoadMyProfile = function(callback) {
			var reqData = {'authenticationtoken' : AuthenticationService.GetAuthToken(), 'apikey' : apikey};
			var serviceurl = baseurl + "/LoadSessionUsersFullProfile";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});
		};

		service.UpdateMyProfile = function (person, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'person': person };
		    var serviceurl = baseurl + "/UpdatePerson";
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
                    console.log(response)
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};

		service.CreatePerson = function (callback) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey };
		    var serviceurl = baseurl + "/CreatePerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});
		};
		
		service.TakeLock = function(personid, callback) {
			var reqData = {'authenticationtoken' : AuthenticationService.GetAuthToken(), 'apikey' : apikey, 'personid' : personid};
			var serviceurl = baseurl + "/TakeProfileLock";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					callback(returnContainer);
				},
				error: function (xhr, status, errortext) {
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});
		};

		service.LoadProfile = function (personid, callback) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl = baseurl + "/LoadPerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});
		};

		service.LoadAccountHistory = function (personid, callback) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl = baseurl + "/LoadAccountHistoryByPerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});
		};
		 
        return service;
    }]);