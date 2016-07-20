/**
 * Created by yj on 16/7/19.
 */
class Ship{
    constructor(id,radius,config){
        console.log('config:',config);
        this.id = id;
        this.radius = radius;
        this.config = config;
        this.deg = 0;
        this.power = 100;
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
        this.state = 'flying';
        let self = this;
        this.timeId = this.$interval(function(){
            self.rotate();
            self.power -= self.config.consume/100;
            if(self.power <=0){
                self.stop();
                self.power = 0;
                self.charge();
            }
        },10)
    }
    charge(){
        let self = this;
        this.timeId = this.$interval(function(){
            self.power += self.config.charge/100;
            if(self.power>=100){
                self.power =100;
                self.$interval.cancel(self.timeId);
                self.fly();
            }
        })
    }
    stop(){
        this.state = 'stoped';
        if(this.timeId){
            this.$interval.cancel(this.timeId);
        }
    }
    rotate(deg = 1){
        this.deg += this.config.speed/360;
        this.renderStyle();
    }
}
var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope,$timeout,$interval){
    Ship.prototype.$interval = $interval;
    $scope.config = {};
    $scope.ships = [];
    let uuid = 1;
    let uuradius = 100;
    let mediator = new Meditator();
    $scope.createShip =function() {
        let id = uuid++;
        let radius = uuradius;
        let value = $scope.config.power.split(',');
        let speed = parseFloat(value[0]);
        let consume = parseFloat(value[1]);
        let charge = $scope.config.charge;
        uuradius += 50;
        $scope.ships.push(new Ship(id, uuradius,{
            speed,consume,charge
        }));
    };
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
        }
    };
    $scope.stop = function(id){
        let ship = findById(id);
        if(ship && ship.state == 'flying'){
            ship.stop();
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
    function init(){
        $scope.ships = [];
        for(let i=0;i<4;i++){
            createShip();
        }
    }

});
