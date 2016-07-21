/**
 * Created by yj on 16/7/19.
 */
let cmdMap = {
    '0001': 'launch',
    '0010': 'fly',
    '0011': 'stop',
    '0100': 'destroy'
};
let mapCmd = {
    'launch': '0001',
    'fly': '0010',
    'stop': '0011',
    'destroy': '0100'
};
var Adapter = {
    decode:function(msg){
        let id = msg.slice(0,4);
        let cmd = msg.slice(4);
        return {
            id: str2int(id),
            command: cmdMap[cmd]
        }
    },
    encode: function(msg){
        let id = leftPad(int2str(msg.id),4);
        let cmd = mapCmd[msg.command]
        return id+cmd;
    }
};
class Event{
    constructor(){
        this.listeners = {}
    }
    on(type,listener) {
        (this.listeners[type] = this.listeners[type] || []).push(listener);
    }
    fire(type){
        let handlers = this.listeners[type] || [];
        for(let handler of handlers){
            handler();
        }
    }
}
let eventBus = new Event;
function identify(msg){
    return msg;
}
function leftPad(str,n,ch){
    let len = str.length;
    if(n<=len) return str;
    return new Array(n-len+1).join(ch||' ')+str;
}
function divide(m,n){
    let q = Math.floor(m/n)
    let r = m - n*q;
    return [q,r];
}
function str2int(str){
    return parseInt(str,2);
}
function int2str(n){
    let res = '';
    let q,r;
    do{
        [q,r] = divide(n,2);
        res += r;
        n=q;
    }while(n);
    return res.split('').reverse().join('');
}
class Ship{
    constructor({id,radius,config,mediator}){
        console.log('config:',config);
        this.id = id;
        this.radius = radius;
        this.config = config;
        this.deg = 0;
        this.power = 100;
        this.state = 'destroyed';
        this.shipWidth = 500;
        this.shipHeight = 200;
        this.mediator = mediator;
        this.timeId = null;
        this.initStyle();
        this.mediator.register(this);
    }
    execCmd(cmd){
        cmd = Adapter.decode(cmd);
        if(cmd.id == this.id){
            switch(cmd.command){
                case 'launch':
                    this.launch();
                    break;
                case 'fly':
                    this.fly();
                    break;
                case 'stop':
                    this.stop();
                    break;
                case 'destroy':
                    this.destroy();
                    break;
                default:
                    throw new Error('不支持的命令');
            }
        }
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
        this.state = 'destroyed';
    }
    launch(){
        this.state = 'init';
        this.deg = 0;
        this.initStyle();
    }
    fly(){
        if(this.state != 'destroyed' && this.state!= 'flying') {
            this.state = 'flying';
            let self = this;
            this.timeId = this.$interval(function () {
                self.rotate();
                self.power -= self.config.consume / 100;
                if (self.power <= 0) {
                    self.stop();
                    self.power = 0;
                    self.charge();
                }
            }, 10)
        }
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
        if(this.state == 'flying') {
            this.state = 'stoped';
            if (this.timeId) {
                this.$interval.cancel(this.timeId);
            }
        }
    }
    rotate(deg = 1){
        this.deg += this.config.speed/360;
        this.renderStyle();
    }
}
class Writer{
    constructor(){
        this.container = document.querySelector('#log-out')
    }
    append(msg){
        let p = document.createElement('p')
        p.textContent = msg;
        this.container.appendChild(p);
        return this;
    }
}
class Logger{
    constructor(writer){
        this.writer = writer;
    }
    log(msg){
        let time = new Date();
        console.log(msg);
        this.writer.append(`${time.toUTCString()}: ${JSON.stringify(msg)}`);
    }
}
class Mediator{
    constructor(logger){
        this.ships = [];
        this.logger = new Logger(new Writer());
    }
    register(ship){
        this.ships.push(ship);
    }
    deregister(ship){
        let index = this.ships.indexOf(ship);
        if(ship!=-1){
            this.ships.splice(index,1);
        }
    }
    broadCast(cmd){
        //模拟1秒延时
        this.logger.log(cmd);
        let self = this;
        setTimeout(function() {
            for (let ship of self.ships) {
                cmd = Adapter.encode(cmd);
                ship.execCmd(cmd);
                eventBus.fire('refresh')
            }
        },1000);
    }

}
var app = angular.module('app',[]);
app.controller('MainCtrl',function($scope,$timeout,$interval){
    Ship.prototype.$interval = $interval;
    $scope.config = {};
    $scope.ships = [];
    let uuid = 1;
    let uuradius = 100;
    let mediator = new Mediator();
    function refresh(){
        $scope.$digest();
    }
    eventBus.on('refresh',refresh)
    $scope.createShip =function() {
        let id = uuid++;
        let radius = uuradius;
        let value = $scope.config.power.split(',');
        let speed = parseFloat(value[0]);
        let consume = parseFloat(value[1]);
        let charge = $scope.config.charge;
        uuradius += 50;
        let ship = new Ship(
            {
                id:id,
                radius:radius,
                config: {
                    speed, consume, charge
                },
                mediator:mediator
            });
        $scope.ships.push(ship);
    };
    $scope.destroy = function(id){
        mediator.broadCast({
            id:id,
            command: 'destroy'
        })
    };
    $scope.launch =function(id){
        mediator.broadCast({
            id: id,
            command: 'launch'
        })
    };
    $scope.fly = function(id){
        mediator.broadCast({
            id: id,
            command: 'fly'
        })
    };
    $scope.stop = function(id){
        mediator.broadCast({
            id: id,
            command: 'stop'
        })
    };
});
