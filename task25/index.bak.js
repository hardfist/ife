/**
 * Created by yj on 16/7/17.
 */
/**
 * Task调度器
 */
function isFunction(f){
    return Object.prototype.toString.call(f) == '[object Function]';
}
class Tree{
    constructor(root,container){
        this.root = root;
        this.container = container;
    }
    _render(root){
        let box = document.createElement('div')
        box.classList.add('box');
        let textNode = document.createTextNode(root.value)
        let span = document.createElement('span')
        span.appendChild(textNode);
        span.classList.add('value');
        box.appendChild(span)
        if(root.children && root.children.length > 0) {
            for (let ch of root.children) {
                box.appendChild(this._render(ch));
            }
        }
        return box;
    }
    render(){
        var $root = this._render(this.root)
        this.container.appendChild($root);
    }
}
class Task {
    constructor(interval) {
        this.queue = [];
        this.interval = interval;
        this.running = false;
        this.id = null;
    }

    _run() {
        let task = this.queue.shift();
        if (task) {
            let {handler, args, context} = task;
            try {
                handler.apply(context, args);
            }catch(err){
                this.running = false;
                this.queue = [];
            }
        } else {
            this.running = false;
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.id = setTimeout((function recur() {
                let self = this;
                self._run();
                if(task.queue.length > 0) {
                    setTimeout(recur.bind(self), self.interval);
                }else{
                    task.running = false;
                }
            }).bind(this), this.interval)
        }
    }

    push(task) {
        if (Object.prototype.toString.call(task) == '[object Function]') {
            this.queue.push({
                handler: task
            })
        } else {
            this.queue.push(task);
        }
    }

    stop() {
        clearInterval(this.id)
        this.running = false;
    }
}
var data = {
    value: 'Super',
    children:[
        {
            value: 'CellPhone1',
            children:[
                {value: 'Pear1'},
                {value: 'Pig1'},
                {value: 'Test1'}
            ]
        },
        {
            value: 'CellPhone2',
            children:[
                {value: 'Pear2'},
                {value: 'Pig2'},
                {value: 'Test2'}
            ]
        }
    ]
};
function clear(root){
    dfs(root,function(node){
        node.classList.remove('selected')
    })
}
var container = document.querySelector('.container');
var tree = new Tree(data,container);
tree.render();
var root = container.children[0];
var task = new Task(500);