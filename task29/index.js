var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope){

});
app.directive('validName',function(){
    function isValid(str){
        return str && str.length >=4 && str.length <=16;
    }
    return{
        restrict: 'A',
        require: 'ngModel',
        link:function($scope,$element,$attrs,ngModelCtrl){
            ngModelCtrl.$parsers.unshift(function(value){
                console.log('$parsers:',value);
                var valid = isValid(value);
                ngModelCtrl.$setValidity('validName',valid);
                return valid ? value: undefined
            });
            ngModelCtrl.$formatters.unshift(function(value){
                console.log('$formatters:',value);
                var valid = isValid(value);
                ngModelCtrl.$setValidity('validName',valid);
                return value+value;
            })
        }
    }
});