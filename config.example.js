/**
 * Created by Angus on 9/15/2016.
 */
'use strict';

var constants = {
    backendURL: 'http://localhost',
    backendPort: '1113',
    apiKey: "90fdb89f-282b-4bd6-840b-cef597615728",
    debugMode: true

};

angular.module('Connection').constant('config', constants);
angular.module('Administration').constant('config', constants);
angular.module('Authentication').constant('config', constants);
angular.module('Authorization').constant('config', constants);
angular.module('Muster').constant('config', constants);
angular.module('Profiles').constant('config', constants);
angular.module('Watchbill').constant('config', constants);
angular.module('Feedback').constant('config', constants);
angular.module('FAQ').constant('config', constants);
angular.module('Search').constant('config', constants);
