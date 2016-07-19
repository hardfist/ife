var app = angular.module('app',[]);
class Tree{
    constructor(value,children){
        this.value = value;
        this.parent = null;
        this.children = [];
        if(children && children.length >0) {
            for (let child of children) {
                this.addChild(child);
            }
        }
    }
    addChild(node){
        this.children.push(node);
        node.parent = this;
        return this;
    }
    deleteChild(node){
        node.parent = null;
        let index = this.children.indexOf(node);
        if(index!=-1){
            this.children.splice(index,1);
        }
        return this;
    }
    deleteSelf(){
        let parent = this.parent;
        if(parent){
            parent.deleteChild(this);
        }
        return this;
    }
}
var model = new Tree('Super',[
    new Tree('CellPhone1',[
        new Tree('Pear1'),
        new Tree('Pear2'),
        new Tree('Pear3')
    ]),
    new Tree('CellPhone2',[
        new Tree('Pear2'),
        new Tree('Pig2'),
        new Tree('Test2')
    ])
])
app.controller('MainCtrl',function($scope){
    $scope.model = model;
});
app.controller('treeCtrl',function($scope){
    $scope.isFolder = function(){
        return $scope.model.children && $scope.model.children.length;
    };
    $scope.toggle = function(){
        return $scope.open = !$scope.open;
    };
    $scope.addItem = function(){
        let text = prompt('请输入节点内容');
        let newNode = new Tree(text);
        $scope.model.addChild(newNode);
    };
    $scope.deleteItem = function(){
        $scope.model.deleteSelf();
    };
    $scope.showTip = function(){
        $scope.show = true;
    };
    $scope.hideTip = function(){
        $scope.show = false;
    };
    $scope.open = false;
    $scope.show = false;
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
