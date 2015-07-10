angular.module('Canvas', ['ConfigService']).controller('CanvasCtrl', function($scope, Config) {
    $scope.canvas = null;
    $scope.video = null;

    $scope.initialize = function() {
        $scope.canvas = new fabric.Canvas('canvas');
        canvas.on('mouse:down', dragStart);
        canvas.on('mouse:up', dragEnd);
        $scope.video = new Whammy.Video(15);

    }

    $scope.createOverlay = function(rect, options)

});