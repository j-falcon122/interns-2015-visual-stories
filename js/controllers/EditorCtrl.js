angular.module('Editor', ['ConfigService']).controller('EditorCtrl', function($scope, Config) {
    $scope.autoPositions = [
        {value:null, label:'none'},
        {value:"tb", label:'top banner'},
        {value:"tli", label:'top left inset'},
        {value:"tri", label:'top right inset'},
        {value:"cb", label:'centered banner'},
        {value:"bli", label:'bottom left inset'},
        {value:"bri", label:'bottom right inset'},
        {value:"bb", label:'bottom banner'}
    ];
    $scope.autoPosition = $scope.autoPositions[1];
    $scope.manualPosition = [0, 0, 0, 0];

    $scope.overlay = {
        enabled : true,
        opacity: 0.8,
        overlayColor: '#000000',
    };

    $scope.fonts = ['NYTCheltenhamBdCon', 'NYTCheltenhamBdXCon', 'NYTCheltenhamBold', 'NYTCheltenhamBook', 'NYTCheltenhamExtBd', 'NYTCheltenhamExtLt', 'NYTCheltenhamLt', 'NYTCheltenhamLtCon', 'NYTCheltenhamLtSC', 'NYTCheltenhamMedCon', 'NYTCheltenhamMedium', 'NYTCheltenhamWide', 'NYTFranklinBold', 'NYTFranklinExtraBd', 'NYTFranklinHeadline', 'NYTFranklinLight', 'NYTFranklinMedium', 'NYTFranklinSemiBold', 'NYTImperial', 'NYTImperialSemiBold', 'NYTKarnakDisplay', 'NYTKarnakText', 'NYTStymieLight', 'NYTStymieMedium']
    $scope.text = {
        content: '',
        color: '#ffffff',
        size: 24,
        font: $scope.fonts[0]
    };

    $scope.saveConfigs = function() {
        Config.set({overlay: $scope.overlay, text : $scope.text});
    }

});