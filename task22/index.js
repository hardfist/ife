/**
 * Created by yj on 16/7/17.
 */
/**
 * Task调度器
 */
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
                setTimeout(recur.bind(self), self.interval);
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
function Deferred() {
    const p = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    this.then = p.then.bind(p);
    this.catch = p.catch.bind(p);
}
function travel(type, visit) {
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
            dfs(child, previsit, postvisit)
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
        for (let v of node.children) {
            queue.push(v);
        }
    }
}
var root = document.querySelector('.container');
var task = new Task(500);
var pre_btn = document.querySelector('#previsit');
var post_btn = document.querySelector('#postvisit');
var bfs_btn = document.querySelector('#bfsvisit')
function blink(node) {
    node.style.backgroundColor = 'red';
    setTimeout(function () {
        node.style.backgroundColor = 'transparent';
    }, task.interval)
}
pre_btn.addEventListener('click', function () {
    travel('pre', function (node) {
        task.push({
            handler: blink,
            args: [node]
        });
    });
    task.start();
});
post_btn.addEventListener('click', function () {
    travel('post', function (node) {
        task.push({
            handler: blink,
            args: [node]
        })
    });
    task.start();
});
bfs_btn.addEventListener('click', function () {
    travel('bfs', function (node) {
        task.push({
            handler: blink,
            args: [node]
        })
    });
    task.start();
});