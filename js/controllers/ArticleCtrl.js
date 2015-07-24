angular.module('Article', ['AssetService', 'ui.bootstrap']).controller("ArticleCtrl", function ($rootScope, $scope, $modal, assets) {

    $scope.url = '';

    $scope.getArticle = function() {
        $scope.modalInstance.close();
        console.log($scope.url);
        $rootScope.$broadcast('article:load', $scope.url);
    }

    var template = '<form ng-submit="$parent.getArticle()" id="search" class="navbar-right input-group input-group-lg row-fluid"><input ng-model="$parent.url" type="text" class="form-control karnak" placeholder="Enter article URL here"><button type="submit" class="input-group-addon btn btn-lg"><span class="glyphicon glyphicon-search"></span></button></form>'


    $scope.open = function() {
        $scope.modalInstance = $modal.open({
            animation: true,
            template: template,
            controller: 'ArticleCtrl',
            backdrop: 'static',
            scope: $scope, //the parent of the modal scope.
        });
    };
});
