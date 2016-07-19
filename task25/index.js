var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope){
    $scope.model = {
        value: 'Super',
        children:[
            {
                value: 'CellPhone1',
                children:[
                    {value: 'Pear1'},
                    {value: 'Pig1'},
                    {value: 'Test1'}
                ]
            },
            {
                value: 'CellPhone2',
                children:[
                    {value: 'Pear2'},
                    {value: 'Pig2'},
                    {value: 'Test2'}
                ]
            }
        ]
    }
});
app.controller('treeCtrl',function($scope){
    $scope.isFolder = function(){
        return $scope.model.children && $scope.model.children.length;
    };
    $scope.toggle = function(){
        return $scope.open = !$scope.open;
    };
    $scope.addItem = function(){
        var text = prompt('请输入节点内容');
        $scope.model.children = $scope.model.children || [];
        $scope.model.children.push({
            value: text
        })
    };
    $scope.open = false;
});
app.directive('treeDirective',function(){
    return{
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl:'partials/tree.html',
        controller:  'treeCtrl'
    }
});