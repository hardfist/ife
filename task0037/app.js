/**
 * Created by yj on 16/4/1.
 */
class Editor {
    constructor(selector) {
        this.$element = $(selector)
        this.$lines = this.$element.find('.command_lines')
        this.$textarea = this.$element.find('.commander_editor')
        this.init()
        this.update()
    }

    /**
     * 事件绑定
     */
    init() {
        this.$textarea.on('input', this.update.bind(this))
        this.$textarea.on('scroll', this.scroll.bind(this))
    }
    /**
     * 代码行数同步滚动
     */
    scroll(event) {
        //todo
    }

    /**
     * 滚动到指定行数
     */
    scrollTo(line){
        this.$textarea.scrollTop = line*20
    }

    update(){
        var codes = this.$textarea.val()
        var lines = codes.match(/\n/g)
        lines = lines ? lines.length+1 : 1
        for(var l=1;l<lines;l++){
            $("<div></div>").addClass("commander-lines-item").text(l).appendTo(this.$lines)
        }
    }
}
class Application{
    constructor(){
        //初始状态
        this.state= {
            arr: [],
            queue: [],
            duration: 500,
            sort_type: 'bubble_sort',
            cells: [],
            running: false,
        }
        this.$sort = $('#sort')
        this.$random = $('#random')
        this.$duration = $('#duration')
        this.$sort_type = $('#sort_type')
        this.$reset = $('#reset')
        this.$container = $('#container')
        this.$next = $('#next')

        this.init()
    }

    /**
     * 初始化事件绑定
     */
    init(){
        this.$sort.on('click',this.sort.bind(this))
        this.$reset.on('click',this.reset.bind(this))
        this.$random.on('click',this.random.bind(this))
        this.$next.on('click',this.next.bind(this))
        this.$duration.on('change',this.setDuration.bind(this))
        this.$sort_type.on('change',this.setSortType.bind(this))

        this.state.duration = parseInt(this.$duration.val())
        this.state.sort_type = this.$sort_type.val()

    }
    setSortType(sort_type){
        this.state.sort_type = $("#sort_type").val()
    }
    setDuration(ms){
        this.state.duration = parseInt($('#duration').val())
        $('.cell').css({
            'transition-duration': ms+'ms'
        })
    }

    /**
     * 随机产生数组
     */
    random(){
        var arr = this.state.arr
        for(var i=0;i<20;i++){
            arr[i] = Math.floor(Math.random()*99)+1
        }
        var children = arr.map( el => {
            return $('<div></div>').addClass('cell').css({
                height: el
            })
        })
        this.$container.empty().append(children)
        this.state.cells = $('#container .cell')
    }
    sort(){
        switch(this.state.sort_type){
            case 'bubble_sort':
                this.bubble_sort()
                break
            case 'quick_sort':
                this.quick_sort()
                break
            case 'select_sort':
                this.select_sort()
                break
        }
    }

    /**
     * 重置应用
     */
    reset(){
        this.state.arr=[]
        this.$container.empty()
    }

    /**
     * 冒泡排序
     */
    bubble_sort(){
        var arr =this.state.arr
        for(let i=0;i<arr.length;i++){
            for(let j=i;j>0 && arr[j] < arr[j-1];j--){
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]]
                this.start(this.swapDomHeight,j-1,j).
                catch(err =>{
                    console.log('err',err)
                })
            }
        }
        console.log(arr)
    }

    /**
     * 选择排序
     */
    select_sort(){
        let arr = this.state.arr,
            length = arr.length
        for(let i=0;i<length;i++){
            let minIndex = i
            for(let j=i;j<length;j++){
                if(arr[j] < arr[minIndex]){
                    minIndex = j
                }
            }
            [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]]

            this.start(this.swapDomHeight,i,minIndex)
                .catch(err =>{
                    console.log('err',err)
                })
        }
        console.log(arr)
    }

    /**
     *
     */
    quick_sort(){

    }
    /**
     * 运行指令,将指令promisify化,以利用进行控制
     * @param func
     * @param args
     * @returns {Promise}
     */
    start(func,...args){
        var cnt = 0
        return new Promise((resolve,reject) => {
            this.state.queue.push({func, args,callback:function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            }})
            if (!this.state.running) {
                this.taskloop()
            }
        })
    }

    /**
     * 交换两个dom节点的高度
     * @param i
     * @param j
     */
    swapDomHeight(i,j){
        var cells= this.state.cells
        ;[cells[i].style.height,cells[j].style.height] = [cells[j].style.height,cells[i].style.height]
    }

    /**
     * 事件循环,自动执行异步事件
     */
    taskloop(){
        this.state.running = true
        var task = this.state.queue.shift()
        if(task) {
            let {func,args,callback} = task
            try {
                callback(null,func.apply(this, args))

            }catch(err){
                this.state.running = false
                this.state.queue = []
                callback(err)
            }
            setTimeout(this.taskloop.bind(this),this.state.duration)
        }else{
            this.state.running = false
        }
    }

    /**
     * 手动的执行异步事件队列,进行算法演示
     */
    next(){
        var queue = this.state.queue.shift()
        if(queue){
            let {func,args} = queue
            func.apply(this,args)
        }
    }
}
var app = new Application()