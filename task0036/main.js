/**
 * Created by yj on 16/3/28.
 */
var x_limit = 10 //棋盘宽度
var y_limit = 10 //棋盘高度
var box_height = 40 //棋盘单元高度
var box_width = 40 //棋盘单元宽度
var instruction_set = ['GO', 'TUN LEF', 'TUN RIG', 'TUN BAC',
    'MOV LEF', 'MOV TOP', 'MOV RIG', 'MOV BOT', 'TRA LEF', 'TRA TOP',
    'TRA RIG', 'TRA BOT', 'BUILD']  //支持的指令集

// 被操纵的盒子
class Box {
    //构造函数
    constructor($dom) {
        //初始状态
        this.direction = 'top'
        this.deg = 0
        this.x = 6
        this.y = 6
        this.$dom = $dom
        $dom.data('data', this)
        this.render()
        this.commands = {}
        this.register_commands({
            'GO': this.go,
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
            'TRA BOT': this.travel_bottom,
            'BUILD': this.build
        })
    }
    delay(func){
        return new Promise((resolve,reject) =>{
            var res = func()
            setTimeout(()=>{
                resolve()
            },1000)
        })
    }
    //运行接收的命令
    async run_command(command) {
        if (typeof this.commands[command] == 'function') {
            var command = this.commands[command]
            command = command.bind(this)
            var res = await this.delay(() => {
                command()
                this.render()
            })
        }
    }

    //渲染界面
    render() {
        this.$dom.css({
            left: this.x * box_width,
            top: this.y * box_height,

        })
        this.$dom.css({
            transform: `rotate(${this.deg}deg)`
        })
    }

    /**
     *
     * @param n 步数
     */
    go(n = 1) {

        switch (this.direction) {
            case 'top':
                if (this.y >= n) {
                    this.y -= n
                }
                break
            case 'bottom':
                if (this.y + n < y_limit) {
                    this.y += n
                }
                break
            case 'left':
                if (this.x >= n) {
                    this.x -= n
                }
                break
            case 'right':
                if (this.x + 1 < x_limit) {
                    this.x += n
                }
        }
    }

    //左转方向
    turn_left() {
        this.deg -= 90
        switch (this.direction) {
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
    turn_right() {
        this.deg += 90
        switch (this.direction) {
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
    turn_back() {
        this.deg += 180
        switch (this.direction) {
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
    travel_left(n=1) {
        if (this.x >= n) {
            this.x -= n
        }
    }

    //右移
    travel_right(n=1) {
        if (this.x + n < x_limit) {
            this.x += n
        }
    }

    //上移
    travel_top(n=1) {
        if (this.y >= n) {
            this.y -= n
        }
    }

    //下移
    travel_bottom(n=1) {
        if (this.y + n < y_limit) {
            this.y += n
        }
    }

    //todo: 旋转并移动时动画效果欠佳,待改进
    //旋转到某角度
    rotate_to(direction) {
        this.direction = direction
        var deg = Math.floor(this.deg / 360) * 360
        switch (this.direction) {
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
    move_left(n = 1) {
        this.rotate_to('left')
        this.go(n)
    }

    //右转并移动
    move_right(n = 1) {
        this.rotate_to('right')
        this.go(n)
    }

    //上转并移动
    move_top(n = 1) {
        this.rotate_to('top')
        this.go(n)
    }

    //下转并移动
    move_bottom(n = 1) {
        this.rotate_to('bottom')
        this.go(n)
    }

    //注册常用命令
    register_commands(prop) {
        for (name in prop) {
            this.commands[name] = prop[name]
        }
    }
    //对面点的坐标
    opposite_index(x,y){
        switch(this.direction){
            case 'left':
                return {x:x-1,y}
            case 'right':
                return {x:x+1,y}
            case 'top':
                return {x,y:y-1}
            case 'bottom':
                return {x,y:y+1}
        }
    }
    // 判断坐标是否合法
     is_valid_index(i,j){
        return i >= 0 && i <= x_limit && j >= 0 && j <= y_limit
    }
    // 在对面建墙
    build_oppsite(){
        var pos = this.opposite_index(this.x,this.y)
        if(this.is_valid_index(pos.x,pos.y)){
            this.build_wall(pos.x,pos.y)
        }
    }
    //随机搭建墙
    random_build_wall() {
        var res = []
        var board = this.board
        for(var i=0;i<board.length;i++){
            for(var j=0;j<board[i].length;j++){
                if(board[i][j].state == 0){
                    res.push({i,j})
                }
            }
        }
        var length = res.length
        var index = Math.floor(Math.random()*length)
        if(index == -1){
            console.error("没有空余的位置了")
            return
        }
        this.build_wall(res[index].i,res[index].j)
    }
    //建墙
    build_wall(i, j) {
        this.board[i][j].state = 1
        this.board[i][j].$dom.addClass("wall")
    }

    //初始化棋盘
    build_board() {
        this.board = []
        for(var i=0;i<x_limit;i++){
            this.board[i] = []
        }
        var $board = $("#board")
        for (var i = 0; i < x_limit; i++) {
            var $row = $("<tr></tr>").appendTo($board)
            for (var j = 0; j < y_limit; j++) {
                var $cell = $("<td></td>").appendTo($row)
                // state=1有墙,state=0没墙
                this.board[j][i] = {
                    state: 0,
                    $dom: $cell
                }
            }
        }
    }
    //重新绘制棋盘
    render_board() {
        var board = this.board
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[j].length; i++) {
                if (board[i][j][state] == 0) {
                    board[i][j][$dom].addClass('wall')
                } else {
                    board[i][j][$dom].removeClass('wall')
                }
            }
        }
    }
    //粉刷墙
    brush_wall(color){
        var pos = this.opposite_index(this.x,this.y)
        var x = pos.x,
            y = pos.y
       if(!this.is_valid_index(x,y) || this.board[x][y].state != 1){
           console.log("对不起,这里没有墙")
       }else{
           this.board[x][y].$dom.css({
               'background-color': color
           })
       }
    }
    //随机的画一幅画 todo
    draw_picture(){

    }
    //寻路  todo
    moveto(x,y){
        var queue = []
    }
}
//判断指令是否有效
function isValidCommand(command) {
    return instruction_set.indexOf(command) != -1
}
function init() {
    var $dom = $("#ship")
    var ship = new Box($dom)
    ship.build_board() //初始化棋盘
    $("#instructions").on("click", function (evt) {
        switch(evt.target.id) {
            case 'execute':
                var commands = $("#commands_input").val().split('\n')
                    .map(el => el.trim())
                for (var command of commands) {
                    ship.run_command(command)
                }
                break
            case 'refresh':
                $("#commands_input").val("")
                commands_render()
                break
            case 'build':
                ship.build_oppsite()
                break
            case 'brush':
                ship.brush_wall($("#brush_color").val())
                break
            case 'draw_pic':
                ship.draw_picture()
                break
            case 'move_to':
                ship.moveto()
        }
    })
    function commands_render() {
        var commands = $("#commands_input").val().split('\n')
            .map(el => el.trim())
        $("#line_num").empty()
        //生成行号
        for (var i = 0; i < commands.length; i++) {
            var $num = $("<div></div>").addClass("num")
                .appendTo($("#line_num"))
                .text(i)
            if (!isValidCommand(commands[i])) {
                $num.addClass("warning")
            }
        }
    }

    $("#commands_input").on("keyup", function () {
        commands_render()
    })
    //滚动条同步
    $("#commands_input").on("scroll", function () {
        $("#line_num").scrollTop($(this).scrollTop())
    })
    $("#line_num").on("scroll", function () {
        $("#commands_input").scrollTop($(this).scrollTop())
    })
    $
}
init()