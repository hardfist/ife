/**
 * Created by yj on 16/3/28.
 */
var x_limit= 10
var y_limit = 10
var box_height = 40
var box_width = 40
class Box{
    constructor($dom){
        //初始状态
        this.direction = 'top'
        this.x = 6
        this.y = 6
        this.$dom = $dom
        $dom.data('data',this)
        this.render()
    }
    render(){
        //位置
        /*
        this.$dom.animation({
            left: 40*this.x,
            top: 40*this.y
        },1000)
        */
        this.$dom.css({
            left: this.x*box_width,
            top: this.y*box_height,
        })
        
        //方向
        var prop
        switch(this.direction){
            case 'left':
                prop ={
                    left: 0,
                    top: 0,
                    width: 10,
                    height: 40
                }
                break
            case 'top':
                prop = {
                    left: 0,
                    top: 0,
                    width: 40,
                    height: 10 
                }
                break
            case 'right':
                prop = {
                    left: 30,
                    top: 0,
                    width: 10,
                    height: 40,

                }
                break
            case 'bottom':
                prop = {
                    left: 0,
                    top:30,
                    width: 40,
                    height: 10,
                }
            
        }
        this.$dom.find("#direction").css(prop)
    }
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
        this.render()
    }
    turn_left(){
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
        this.render()
    }
    turn_right(){
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
        this.render()
    }
    turn_back(){
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
        this.render()
    }
}
function init(){
    var $dom = $("#ship")
    var ship = new Box($dom)
    $("#execute").on("click",function(){
        var command = $("#command").val()
        switch(command){
            case 'GO':
                ship.go()
                break
            case 'TUN LEF':
                ship.turn_left()
                break
            case 'TUN RIG':
                ship.turn_right()
                break
            case 'TUN BAC':
                ship.turn_back()

        }
    })
}
init()