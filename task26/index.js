/**
 * Created by yj on 16/7/19.
 */
class Ship{
    constructor(id,radius){
        this.id = id;
        this.deg = 0;
        this.speed = 100;
        this.state = 'destroyed'

    }
    destroy(){
        this.state = 'destroyed'
    }
    launch(){
        this.state = 'init'
    }
    fly(){
        this.state = 'flying'
    }
    stop(){
        this.state = 'stoped'
    }
    rotate(deg = 1){
        this.deg += deg;
        this.style = {
            transform: `translate(-50%,-50%) rotate(${this.deg}deg)`
        }
    }
}

var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope,$timeout,$interval){
    let timeId = null;
    $scope.ships = [
        new Ship(1),
        new Ship(2),
        new Ship(3),
        new Ship(4)
    ];
    $scope.destroy = function(id){
        let ship = findById(id);
        if(ship){
            ship.destroy()
        }
    };
    $scope.launch =function(id){
        let ship = findById(id);
        if(ship){
            ship.launch()
        }
    };
    $scope.fly = function(id){
        let ship = findById(id);
        if(ship){
            ship.fly();
            timeId= $interval(function(){
                ship.rotate(1)
            },0)
        }
    };
    $scope.stop = function(id){
        let ship = findById(id);
        if(ship){
            ship.stop();
            $interval.cancel(timeId);
        }
    };
    function findById(id){
        for(let ship of $scope.ships){
            if(ship.id == id){
                return ship;
            }
        }
        return null;
    }
});
