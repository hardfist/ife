var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope){
    $scope.name = 'MainCtrl';
    $scope.forms = [
        {
            title: '名称'
        }
    ]
})
app.directive('validForm',function(){
    function isValid(str){
        return str && str.length >=4 && str.length <=16;
    }
    return{
        restrict: 'A',
        scope:{
            title: '=',
        },
        templateUrl:'form.html',
        require: ['^form','ngModel'],
        link:function($scope,$element,$attrs,[formCtrl,ngModelCtrl]){
            var $input = $element.find('input');
            ngModelCtrl.$parsers.unshift(function(value){
                console.log('$parsers:',value,isValid(value));
                var valid = isValid(value);
                ngModelCtrl.$setValidity('validForm',valid);
                return valid ? value: undefined
            });
            ngModelCtrl.$formatters.unshift(function(value){
                console.log('$formatters:',value);
                var valid = isValid(value);
                ngModelCtrl.$setValidity('validForm',valid);
                return value+value;
            });
            ngModelCtrl.$render(function(value){
                console.log('$render:',value);
               var value = ngModelCtrl.$viewValue;
                $input.val(value);
            });
            $element.find('input').on('input',function(evt){
                console.log('dom:');
                $scope.$apply(function(){
                    var value = $input.val();
                    ngModelCtrl.$setViewValue(value);
                })
            })
        }
    }
});