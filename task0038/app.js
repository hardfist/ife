/**
 * Created by yj on 16/4/5.
 */
class Editor{
    constructor(){
        this.$editor = $('#editor')
    }
    init(){

    }
    getCodes(){
        var values = this.$editor.val()
        var codes = values.split('\n')
        return codes.map(code => code.trim())
    }
}
class SortAlgorithm{
    constructor(app){
        this.app = app
        this.sort_type = this.bubble_sort
    }
    init(){

    }
    set_sort_type(){
        let sort_string = this.app.$sort_type.val()
        switch(sort_string){
            case 'bubble_sort':
                this.sort_type = this.bubble_sort
                break
            case 'select_sort':
                this.sort_type = this.select_sort
                break
            default:
                throw new Error('unsupported sort_type')
        }
    }
    /**
     * 运行排序指令
     */
    sort(){
        this.bubble_sort()
    }
    /**
     * 交换两个dom
     * @param i
     * @param j
     * @private
     */
    _swap(i,j){
        var cells = this.app.$cells
            ;[cells[i].style.height,cells[j].style.height] = [cells[j].style.height,cells[i].style.height]
    }

    /**
     * 冒泡排序
     */
    bubble_sort(){
        let arr =this.app.arr
        for(let i=0;i<arr.length;i++){
            for(let j=i;j>0 && arr[j] < arr[j-1];j--) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
                this.app.go(this._swap, [j, j - 1])
                    .then(data => {})
                    .catch(err => console.log(err))
            }
        }
        this.sorted =true
    }

    /**
     * 选择排序
     */
    select_sort(){
        let arr = this.app.arr
        for(let i=0;i<arr.length;i++){
            let minIndex = i
            for(let j=i+1;j<arr.length;j++){
                if(arr[j] < arr[minIndex]){
                    minIndex = j
                }
            }
            this._swap(minIndex,i)
        }
    }
}
class Application{
    constructor(){
        this.config = {
            width: 10,
            duration:10
        }
        this.editor = new Editor()
        this.$random = $('#random')
        this.$sort = $('#sort')
        this.$reset = $('#reset')
        this.$run_commands = $('#run_commands')
        this.$sort_type = $('#sort_type')
        this.sort_algorithm = new SortAlgorithm(this)
        this.commands =[
            {
                pattern: /swap\s+(\d+),(\d+)/i,
                fn: this._swap
            }
        ]
        this.init()
        this.reset()
    }

    /**
     * 初始化绑定事件
     */
    init(){
        this.$random.on('click',this.random.bind(this))
        this.$sort.on('click',this.sort.bind(this))
        this.$reset.on('click',this.reset.bind(this))
        this.$run_commands.on('click',this.run_commands.bind(this))
        this.$sort_type.on('change',this.set_sort_type.bind(this))
    }

    set_sort_type(){
    }
    /**
     * 重置应用
     */
    reset(){
        this.queue = []
        this.running = false
        this.sorted = false

        $('#container').empty()
        $('#editor').empty()
    }

    /**
     * 排序指令
     */
    sort(){
        this.sort_algorithm.sort()
    }

    /**
     * 将指令promisify化,并加入事件队列并执行
     * @param fn
     * @param args
     * @returns {Promise}
     */
    go(fn,args){
        var promise =  new Promise((resolve,reject)=>{
            this.queue.push({
                fn,args,
                callback:function(err,data){
                    if(err){
                        reject(err)
                    }else{
                        resolve(data)
                    }
                }
            })
        })
        if(!this.running){
            this.taskloop()
        }
        return promise
    }

    /**
     * 随机产生一组数
     */
    random(){
        this.reset()
        const n = 30
        let arr = []
        for(let i=0;i<n;i++){
            arr[i] = Math.floor(Math.random()*99+1)
        }
        this.arr = arr
        for(let i=0;i<n;i++){
            $('<div></div>')
                .addClass('cell')
                .height(arr[i])
                .width(this.config.width)
                .appendTo($('#container'))
        }
        this.$cells = $('.cell')
    }

    /**
     * 执行事件队列
     */
    taskloop(){
        this.running = true 
        setTimeout(function inner(){
            let task  = this.queue.shift()
            if(task){
                let {fn,args,callback} = task
                try{
                    var result = fn.apply(this,args)
                    callback(null,result)
                }catch(err){
                    callback(err)
                }
                if(this.queue.length > 0){
                    setTimeout(inner.bind(this),10)
                }else{
                    this.running = false
                }
            }else{
                this.running = false 
            }
            
        }.bind(this))
    }

    /**
     * 下一步.单步执行
     */
    next(){
        if(!this.sorted){
            this.sort()
        }
        if(!this.running){
            let task = this.queue.shift()
            if(task){
                let {fn,args,callback} = task
                try{
                    var result = fn.apply(this,args)
                    callback(null,result)
                }catch(err){
                    callback(err)
                }
            }
        }
    }

    /**
     * 执行命令编辑器里的指令
     */
    run_commands(){
        var codes = this.editor.getCodes()
        var parseError = false
        for(var i=0;i<codes.length;i++){
            if(codes[i] && !this.parse(codes[i])){
                console.log('parse error')
                parseError = true
            }
        }
        if(!parseError){
            for(var code of codes){
                if(code){
                    this.exec(code)
                        .then(data => { console.log(data)})
                        .catch(err => {console.log(err)})
                }
            }
        }

    }

    /**
     * 解析指令
     * @param string
     * @returns {{fn: *, args: *}}
     */
    parse(string){
        for(var i=0;i<this.commands.length;i++){
            var command = this.commands[i]
            var match = string.match(command.pattern)
            if(match){
                return { fn:command.fn,args:match.slice(1)}
            }
        }
    }

    /**
     * 运行指令
     * @param string
     * @returns {*}
     */
    exec(string){
        var command = this.parse(string)
        if(command){
            let {fn,args} = command
            var promise = this.go(fn,args)
            return promise
        }else{
            return Promise.reject('unsupport command')
        }
    }
}
var app = new Application()