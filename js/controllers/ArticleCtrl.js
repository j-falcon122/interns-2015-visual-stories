angular.module('Article', ['AssetService', 'ui.bootstrap']).controller("ArticleCtrl", function ($rootScope, $scope, assets) {

    $scope.url = '';

    $scope.getArticle = function() {
        $rootScope.$broadcast('article:load', $scope.url);
    }

});
