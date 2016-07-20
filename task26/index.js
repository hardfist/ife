/**
 * Created by yj on 16/7/19.
 */
class Ship{
    constructor(id,radius){
        this.id = id;
        this.radius = radius;
        this.deg = 0;
        this.speed = 100;
        this.state = 'destroyed';
        this.shipWidth = 500;
        this.shipHeight = 200;
        this.timeId = null;
        this.initStyle();
    }
    initStyle(){
        this.orbitStyle = {
            width: this.radius+'px',
            height: this.radius + 'px'
        };
        this.style = {
            transform : 'translate(-50%,-50%)',
            width: '26px',
            height: '10px',
            transformOrigin: `13px ${this.radius/2+5}px`
        }
    }
    renderStyle(){
        this.style.transform = `translate(-50%,-50%) rotate(${this.deg}deg)`

    }
    destroy(){
        this.state = 'destroyed'
    }
    launch(){
        this.state = 'init';
        this.deg = 0;
        this.initStyle();
    }
    fly(){
        this.state = 'flying'
    }
    stop(){
        this.state = 'stoped'
    }
    rotate(deg = 1){
        this.deg += deg;
        this.renderStyle();
    }
}

var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope,$timeout,$interval){
    let uuid = 1;
    let uuradius = 100;
    init();
    function clear(ship){
        if(ship.timeId){
            $interval.cancel(ship.timeId);
        }
    }

    function init(){
        $scope.ships = [];
        for(let i=0;i<4;i++){
            createShip();
        }
    }
    function createShip() {
        let id = uuid++;
        let radius = uuradius;
        uuradius += 50;
        $scope.ships.push(new Ship(id, uuradius));
    }
    $scope.createShip = createShip;
    $scope.destroy = function(id){
        let ship = findById(id);
        if(ship && ship.state !='destroyed'){
            ship.destroy();
            clear(ship);
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
        if(ship && ship.state !='flying'){
            ship.fly();
            ship.timeId= $interval(function(){
                ship.rotate(1)
            },0)
        }
    };
    $scope.stop = function(id){
        let ship = findById(id);
        if(ship && ship.state == 'flying'){
            ship.stop();
            clear(ship);
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
