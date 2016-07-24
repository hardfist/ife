/**
 * Created by yj on 16/7/19.
 */
/**
 * 飞船类
 */
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
        this.broadCastId = null;
        this.initStyle();
        this.mediator.register(this);
        dataCenter.addInfo({
            id: this.id,
            state: this.state,
            power: this.power,
            powerName: this.config.powerName,
            energyName: this.config.energyName
        });
        this._broadCast();
    }
    _broadCast(info){
        let self = this;
        this.broadCastId = setInterval(function(){
            eventBus.fire('updateInfo',Adapter.encodeInfo({
                id: self.id,
                state: self.state,
                power: self.power
            }));
        },1000)
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
            this.timeId = setInterval(function () {
                self.rotate();
                self.power -= self.config.consume / 100;
                if (self.power <= 0) {
                    self.stop();
                    self.power = 0;
                    self.charge();
                }
                eventBus.fire('flying')
            }, 10)
        }
    }
    charge(){
        let self = this;
        this.timeId = this.$interval(function(){
            self.power += self.config.charge/100;
            if(self.power>=100){
                self.power =100;
                clearInterval(self.timeId);
                self.fly();
            }
        })
    }
    stop(){
        if(this.state == 'flying') {
            this.state = 'stoped';
            if (this.timeId) {
                clearInterval(self.timeId);
            }
        }
    }
    rotate(deg = 1){
        this.deg += this.config.speed/360;
        this.renderStyle();
    }
}
/**
 * 输出文件类
 */
class Writer{
    constructor(){
        this.container = document.querySelector('#log-out')
    }
    append(msg){
        let p = document.createElement('p');
        p.textContent = msg;
        this.container.appendChild(p);
        return this;
    }
}
/**
 * 日志类
 */
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
/**
 * 中继器类
 */
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
            cmd = Adapter.encode(cmd);
            for (let ship of self.ships) {
                ship.execCmd(cmd);
                eventBus.fire('refresh')
            }
        },1000);
    }

}
/**
 * 事件类
 */
class Event{
    constructor(){
        this.listeners = {}
    }
    on(type,listener) {
        (this.listeners[type] = this.listeners[type] || []).push(listener);
    }
    fire(type,data){
        let handlers = this.listeners[type] || [];
        for(let handler of handlers){
            handler(data);
        }
    }
}
class DataCenter{
    constructor(){
        this.infos = [];
    }
    getInfo(info){
        return this.infos;
    }
    addInfo(info){
        this.infos.push(info);
    }
    updateInfo(info){
        for(let item of this.infos){
            if(item.id == info.id){
                Object.assign(item,info);
            }
        }
    }
}

var dataCenter = new DataCenter();
// 适配器负责编码解码
var Adapter =(function(){
    var cmdMap = {
        '0001': 'launch',
        '0010': 'fly',
        '0011': 'stop',
        '0100': 'destroy'
    };
    var mapCmd = {
        'launch': '0001',
        'fly': '0010',
        'stop': '0011',
        'destroy': '0100'
    };
    var mapState = {
        'init': '0001',
        'flying': '0010',
        'stoped': '0011',
        'destroyed': '0100',
    };
    var stateMap = {
        '0001' : 'init',
        '0010' : 'flying',
        '0011': 'stoped',
        '0100' : 'destroyed'
    };
    return {
        decode:function(msg){
            let id = msg.slice(0,4);
            let cmd = msg.slice(4);
            return {
                id: str2int(id),
                command: cmdMap[cmd]
            }
        },
        encode: function(msg){
            let id = leftPad(int2str(msg.id),4,'0');
            let cmd = mapCmd[msg.command];
            return id+cmd;
        },
        encodeInfo:identify,
        decodeInfo: identify
        /*
        encodeInfo:function(info){
            let id = leftPad(int2str(info.id),4,'0');
            let state = mapState[info.state];
            let power = leftPad(int2str(info.power),8,'0');
            return id+state+power;

        },
        decodeInfo:function(msg){
            let id = msg.slice(0,4);
            let state = msg.slice(4,8);
            let power = msg.slice(8,12);
            return{
                id: str2int(id),
                state: stateMap[state],
                power: str2int(power)
            }
        }
        */
    }
}());
var eventBus = new Event;
var app = angular.module('app',['pascalprecht.translate']);
app.config(['$translateProvider',function($translateProvider){
    $translateProvider.translations('zh',{
        'flying': '飞行中',
        'init': '初始化',
        'stoped' : '暂停中',
        'destroyed': '销毁了'
    });
    $translateProvider.preferredLanguage('zh');
}]);
app.filter('digitsLimit',function(){
    return function(value,digits){
        return value.toFixed(digits);
    }
})
app.controller('MainCtrl',function($scope,$timeout,$interval){
    Ship.prototype.$interval = $interval;
    $scope.config = {};
    $scope.ships = [];
    $scope.infos = [];
    let uuid = 1;
    let uuradius = 100;
    let mediator = new Mediator();
    function refresh(){
        $scope.$digest();
    }
    eventBus.on('refresh',refresh);
    eventBus.on('flying',function(){
        $scope.$digest();
    });
    eventBus.on('updateInfo',function(info){
        info  = Adapter.decodeInfo(info);
        dataCenter.updateInfo(info);
        $scope.infos = dataCenter.getInfo();
        $scope.$digest();
    });
    $scope.createShip =function() {
        let id = uuid++;
        let radius = uuradius;
        let value = $scope.config.power.split(',');
        let speed = parseFloat(value[0]);
        let consume = parseFloat(value[1]);
        let powerName = value[2];
        let energy= $scope.config.charge.split(',');
        let charge = parseFloat(energy[0]);
        let energyName = energy[1];
        uuradius += 50;
        let ship = new Ship(
            {
                id:id,
                radius:radius,
                config: {
                    speed, consume, charge,powerName,energyName
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


/* 常用功能函数 */
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
    n = n.toFixed(0);
    let res = '';
    let q,r;
    do{
        [q,r] = divide(n,2);
        res += r;
        n=q;
    }while(n);
    return res.split('').reverse().join('');
}