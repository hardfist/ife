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
function travel(root,type, visit) {
    switch (type) {
        case 'pre':
            dfs(root, visit);
            break;
        case 'post':
            dfs(root, null, visit);
            break;
        case 'bfs':
            bfs(root, visit);
    }
}
function dfs(root, previsit, postvisit) {
    if (root) {
        if (previsit) {
            previsit(root);
        }
        for (let child of root.children) {
            if(!child.classList.contains('value')) {
                dfs(child, previsit, postvisit)
            }
        }
        if (postvisit) {
            postvisit(root)
        }
    }
}
function bfs(root, visit) {
    let queue = [];
    queue.push(root);
    while (queue.length > 0) {
        let node = queue.shift();
        visit(node);
        for (let v of children) {
            if(!v.classList.contains('value')) {
                queue.push(v);
            }
        }
    }
}
function query(root,pred){
    if(!isFunction(pred)){
        var tmp = pred;
        pred = function (val){
            return tmp == val;
        }
    }
    if(root){
        task.push({
            handler: blink,
            args: [root]
        });
        var value = root.querySelector('.value').textContent;
        if(pred(value)){
            return root;
        }else{
            for(let child of root.children){
                if(!child.classList.contains('value')) {
                    let res = query(child,pred);
                    if (res) {
                        return res;
                    }
                }
            }
        }
    }
}
function deleteNode(root){

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
var pre_btn = document.querySelector('#previsit');
var post_btn = document.querySelector('#postvisit');
var bfs_btn = document.querySelector('#bfsvisit');
var query_btn = document.querySelector('#query');
var query_input = document.querySelector('#query_input');
var delete_btn = document.querySelector('#delete');
var insert_btn = document.querySelector('#insert');
var insert_input = document.querySelector('#insert_input');
function blink(node) {
    node.classList.add('selected');
    setTimeout(function () {
        node.classList.remove('selected');
    }, task.interval)
}
query_btn.addEventListener('click',function(){
    var keyword = query_input.value;
    var res = query(root,keyword);
    task.push({
        handler:function(){
            res.classList.add('selected')
        }
    })
    task.start();
})
pre_btn.addEventListener('click', function () {
    if(task.running) return;
    travel(root,'pre', function (node) {
        task.push({
            handler: blink,
            args: [node]
        });
    });
    task.start();
});
post_btn.addEventListener('click', function () {
    if(task.running) return;
    travel(root,'post', function (node) {
        task.push({
            handler: blink,
            args: [node]
        })
    });
    task.start();
});
bfs_btn.addEventListener('click', function () {
    if(task.running) return;
    travel(root,'bfs', function (node) {
        task.push({
            handler: blink,
            args: [node]
        })
    });
    task.start();
});
container.addEventListener('click',function(evt){
    let target = evt.target;
    clear(root);
    if(target.classList.contains('value')){
        target=target.parentNode;
    }
    target.classList.add('selected');
});
delete_btn.addEventListener('click',function(evt){
    var selected = container.querySelector('.selected');
    if(selected){
        selected.remove();
    }
});
insert_btn.addEventListener('click',function(evt){
    let insert_value = insert_input.value;
    let node = document.createElement('div');
    node.classList.add('box');
    var textNode = document.createElement('span');
    textNode.appendChild(document.createTextNode(insert_value));
    node.appendChild(textNode);
    let selected = container.querySelector('.selected');
    selected.appendChild(node);
});