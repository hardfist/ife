/**
 * Created by yj on 16/3/28.
 */
var x_limit= 10
var y_limit = 10
var box_height = 40
var box_width = 40
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
    //直行
    go(){
        switch(this.direction){
            case 'top':
                if(this.y>0) {
                    this.y--
                }
                break
            case 'bottom':
                if(this.y<y_limit-1) {
                    this.y++
                }
                break
            case 'left':
                if(this.x > 0) {
                    this.x--
                }
                break
            case 'right':
                if(this.x < x_limit-1) {
                    this.x++
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
        if(this.x > 0){
            this.x--
        }
    }
    //右移
    travel_right(){
        if(this.x < x_limit - 1){
            this.x++
        }
    }
    //上移
    travel_top(){
        if(this.y > 0){
            this.y--
        }
    }

    //下移
    travel_bottom(){
        if(this.y < y_limit -1){
            this.y++
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
    move_left(){
        this.rotate_to('left')
        this.go()
    }

    //右转并移动
    move_right(){
        this.rotate_to('right')
        this.go()
    }

    //上转并移动
    move_top(){
        this.rotate_to('top')
        this.go()
    }

    //下转并移动
    move_bottom(){
        this.rotate_to('bottom')
        this.go()
    }
    //注册常用命令
    register_commands(prop){
        for( name in prop) {
            this.commands[name] = prop[name]
        }
    }
}
function init(){
    var $dom = $("#ship")
    var ship = new Box($dom)
    $("#execute").on("click",function(){
        var command = $("#command").val().trim()
        ship.run_command(command)
    })
}
init()