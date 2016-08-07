/**
 * Created by yj on 16/3/28.
 */
var x_limit= 10 //棋盘宽度
var y_limit = 10 //棋盘高度
var box_height = 40 //棋盘单元高度
var box_width = 40 //棋盘单元宽度
var instruction_set = ['GO','TUN LEF','TUN RIG','TUN BAC',
'MOV LEF','MOV TOP','MOV RIG','MOV BOT','TRA LEF','TRA TOP',
'TRA RIG','TRA BOT']  //支持的指令集

// 被操纵的盒子
class Box{
    //构造函数
    constructor($dom){
        //初始状态
        this.direction = 'top'
        this.deg = 0
        this.x = 6
        this.y = 6
        this.$dom = $dom
        $dom.data('data',this)
        this.render()
        this.commands = {}
        this.register_commands({
            'GO' : this.go,
            'TUN LEF': this.turn_left,
            'TUN RIG': this.turn_right,
            'TUN BAC': this.turn_back,
            'MOV LEF': this.move_left,
            'MOV TOP': this.move_top,
            'MOV RIG': this.move_right,
            'MOV BOT': this.move_bottom,
            'TRA LEF': this.travel_left,
            'TRA TOP': this.travel_top,
            'TRA RIG': this.travel_right,
            'TRA BOT': this.travel_bottom
        })
    }
    //运行接收的命令
    run_command(command){
        if(typeof this.commands[command] == 'function'){
            var command = this.commands[command]
            command.call(this)
            this.render()
        }
    }
    //渲染界面
    render(){
        this.$dom.css({
            left: this.x*box_width,
            top: this.y*box_height,

        })
        this.$dom.css({
            transform: `rotate(${this.deg}deg)`
        })
    }

    /**
     *
     * @param n 步数
     */
    go(n=1){

        switch(this.direction){
            case 'top':
                if(this.y >=n) {
                    this.y-=n
                }
                break
            case 'bottom':
                if(this.y + n <y_limit) {
                    this.y += n
                }
                break
            case 'left':
                if(this.x >= n) {
                    this.x -= n
                }
                break
            case 'right':
                if(this.x +1 < x_limit) {
                    this.x += n
                }
        }
    }
    //左转方向
    turn_left(){
        this.deg -= 90
        switch(this.direction){
            case 'top':
                this.direction = 'left'
                break
            case 'right':
                this.direction = 'top'
                break
            case 'bottom':
                this.direction = 'right'
                break
            case 'left':
                this.direction = 'bottom'
                break
        }
    }
    //右转方向
    turn_right(){
        this.deg +=90
        switch(this.direction){
            case 'top':
                this.direction = 'right'
                break
            case 'right':
                this.direction = 'bottom'
                break
            case 'bottom':
                this.direction = 'left'
                break
            case 'left':
                this.direction = 'top'
                break
        }
    }
    //调头方向
    turn_back(){
        this.deg += 180
        switch(this.direction){
            case 'top':
                this.direction = 'bottom'
                break
            case 'bottom':
                this.direction = 'top'
                break
            case 'left':
                this.direction = 'right'
                break
            case 'right':
                this.direction = 'left'
                break
        }
    }
    //左移
    travel_left(){
        if(this.x >= n){
            this.x -= n
        }
    }
    //右移
    travel_right(){
        if(this.x + n< x_limit ){
            this.x+= n
        }
    }
    //上移
    travel_top(){
        if(this.y >= n){
            this.y -= n
        }
    }

    //下移
    travel_bottom(){
        if(this.y + n < y_limit){
            this.y += n 
        }
    }
    
    //todo: 旋转并移动时动画效果欠佳,待改进
    //旋转到
    rotate_to(direction){
        this.direction = direction
        var deg = Math.floor(this.deg/360)*360
        switch(this.direction){
            case 'top':
                this.deg = deg + 0
                break
            case 'right':
                this.deg = deg + 90
                break
            case 'bottom':
                this.deg = deg + 180
                break
            case 'left':
                this.deg = deg + 270
        }
    }
    //左转并移动
    move_left(n=1){
        this.rotate_to('left')
        this.go(n)
    }

    //右转并移动
    move_right(n=1){
        this.rotate_to('right')
        this.go(n)
    }

    //上转并移动
    move_top(n=1){
        this.rotate_to('top')
        this.go(n)
    }

    //下转并移动
    move_bottom(n=1){
        this.rotate_to('bottom')
        this.go(n)
    }
    //注册常用命令
    register_commands(prop){
        for( name in prop) {
            this.commands[name] = prop[name]
        }
    }
}
//判断指令是否有效
function isValidCommand(command){
    return instruction_set.indexOf(command) != -1
}
function init(){
    var $dom = $("#ship")
    var ship = new Box($dom)
    $("#execute").on("click",function(){
        var commands = $("#commands_input").val().split('\n')
            .map( el => el.trim())
        for(var command of commands){
            ship.run_command(command)
        }
    })
    $("#commands_input").on("keyup",function(){
        var commands = $("#commands_input").val().split('\n')
            .map(el => el.trim())
        $("#line_num").empty()
        //生成行号
        for(var i=0;i<commands.length;i++){
            var $num = $("<div></div>").addClass("num")
                .appendTo($("#line_num"))
                .text(i)
            if(!isValidCommand(commands[i])){
                $num.addClass("warning")
            }
        }
    })
    //滚动条同步
    $("#commands_input").on("scroll",function(){
        $("#line_num").scrollTop($(this).scrollTop())
    })
    $("#line_num").on("scroll",function(){
        $("#commands_input").scrollTop($(this).scrollTop())
    })
}
init()