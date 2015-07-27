angular.module('Article', ['AssetService', 'ui.bootstrap']).controller("ArticleCtrl", function ($rootScope, $scope, $modal, assets) {

    $scope.url = '';

    $scope.getArticle = function() {
        $scope.modalInstance.close();
        $rootScope.$broadcast('article:load', $scope.url);
    }

    $scope.open = function() {
        $scope.modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modal.html',
            controller: 'ArticleCtrl',
            scope: $scope, //the parent of the modal scope.
        });
    };

    $scope.recentArticles = [];

    $scope.recents = function(){
        $("#recents").css("display","block");
        console.log("working!");
        for (var i = 0; i < localStorage.length; i++){
            $scope.recentArticles.push({
                headline: localStorage.key(i),
                url: localStorage.getItem(localStorage.key(i)).slice(5)
            });
            console.log($scope.recentArticles);
        }
    }
});
