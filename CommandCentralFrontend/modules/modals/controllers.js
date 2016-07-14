'use strict';

angular.module('Modals')

.controller('ModalServiceController',
    ['$scope', 'ModalService',
    function ($scope, ModalService) {
        $scope.show = function () {
            ModalService.showModal({
                templateUrl: 'modules/modals/views/pii.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $scope.message = "You said " + result;
                });
            });
        };

        $scope.show();
    }]
)
.controller('ModalController', ['$scope', 'close', function ($scope, close) {

    $scope.close = function (result) {
        close(result, 250); // close, but give 500ms for bootstrap to animate
    };

}]);