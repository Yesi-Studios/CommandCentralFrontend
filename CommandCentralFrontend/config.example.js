/**
 * Created by Angus on 9/15/2016.
 */
'use strict';


var backendURL = 'http://localhost';
var backendPort = '1337';
var apiKey = "90fdb89f-282b-4bd6-840b-cef597615728";
var debugMode = true;


angular.module('Connection').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Administration').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Authentication').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Authorization').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Muster').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Profiles').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
angular.module('Search').constant('config', {
    backendURL: backendURL,
    backendPort: backendPort,
    apiKey: apiKey,
    debugMode: debugMode

});
