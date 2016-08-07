/**
 * Created by yj on 16/4/29.
 */
/**
 * 最小堆
  */
class MinHeap{
    constructor(cmp){
        this.cmp = cmp;
        this.queue = []
    }
    push(val){
        this.queue.push(val);
    }
    peek(){
        if(this.empty()){
            throw new Error("Can't peek an empty heap");
        }
        return this.queue.reduce((min,val) =>{
            if(this.cmp(min,val) < 0 ){
                return min;
            }else{
                return val;
            }
        })
    }
    pop(){
        if(this.empty()){
            throw new Error("Can't pop an empty heap");
        }
        let minIndex = 0;
        for(let i=1;i<this.queue.length;i++){
            if(this.cmp(this.queue[i],this.queue[minIndex])<0){
                minIndex = i;
            }
        }
        return this.queue.splice(minIndex,1)[0];
    }
    empty(){
        return this.queue.length <=0;
    }
    dump(){
        console.log('queue:',this.queue);
    }
}
/**
 * 工具函数
 */
class Utils {
    /**
     * 打乱数组,得到一组随机数
     * @param a
     */
    static shuffle(a) {
        for (let i = 1; i < a.length; i++) {
            let id = Math.floor(Math.random() * i);
            [a[id], a[i]] = [a[i], a[id]];
        }
    }

    /**
     * 深拷贝
     * @param dst
     * @param rest
     * @returns {*|{}}
     */
    static deepCopy(dst, ...rest) {
        dst = dst || {};
        for (let src of rest) {
            if (!src) return;
            for (let key in src) {
                if (src.hasOwnProperty(key)) {
                    if (typeof src[key] === 'object') {
                        dst[key] = Utils.deepCopy(dst[key], src[key]);
                    } else {
                        dst[key] = src[key];
                    }
                }
            }
        }
        return dst;
    }
}
class Event{
    constructor(){
        this.listeners = {}
    }
    on(type,handler){
        (this.listeners[type] || (this.listeners[type] = [])).push(handler);
        return this;
    }
    fire(type,data,context){
        let handlers = this.listeners[type];
        for(let handler of handlers){
            handler.apply(context,data)
        }
        return this;
    }
    off(type,handler){
        if(type == void 0){
            this.listeners = {}
            return this
        }
        if(handler == void 0){
            delete this.listeners[type]
            return this
        }
        let handlers = this.listeners[type] || [];
        let id = handlers.indexOf(handler);
        if(id != -1){
            handlers.splice(id,1);
            return this;
        }
        if(handlers.length == 0){
            delete this.listeners[type]
        }
        return this;
    }
}
/**
 * 游戏地图
 */
class GridMap {
    constructor(selector) {
        this.$el = document.querySelector(selector);
    }

    create(rows, cols) {
        let html = '';
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < cols; j++) {
                html += '<td class="map-box" data-type="empty">';
            }
            html += '</tr>';
        }
        this.rows = rows;
        this.cols = cols;
        this.$el.innerHTML = html;
        this.$boxes = this.$el.getElementsByTagName('td');
    }

    clear() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.type([i, j], 'empty');
            }
        }
    }

    type([x,y], type) {
        if (type == void 0) {
            return this.$boxes[y * this.cols + x].dataset.type;
        } else {
            this.$boxes[y * this.cols + x].dataset.type = type;
        }
    }
}
class PathFinder {
    constructor(map,cfg){
        this.map = map;
        this.rows = map.rows;
        this.cols = map.cols;
        this.search_type = cfg.search_type;
        this.path = [[0,1],[-1,0],[0,-1],[1,0]]
    }

    setSearchType(type) {
        this.search_type = type;
    }

    /**
     * 返回路径
     * @param src
     * @param dst
     * @returns {*|Array}
     */
    find_path(src, dst) {
        switch (this.search_type) {
            case 'dfs':
                return this.dfs(src, dst, {});
            case 'bfs':
                return this.bfs(src, dst, {});
            case 'astar':
                return this.astar(src, dst,{});
        }
    }

    /**
     * 判断坐标是否在地图内
     * @param i
     * @param j
     * @returns {boolean}
     */
    isValid(i, j) {
        return i >= 0 && i < this.rows && j >= 0 && j < this.cols;
    }
    /**
     * 深度优先搜索
     * @param src
     * @param dst
     * @param visited
     * @returns {*}
     */
    dfs(src, dst, visited) {
        if (src.x == dst.x && src.y == dst.y) {
            return [dst];
        } else {
            for (let [i,j] of this.path) {
                let x = src.x + i;
                let y = src.y + j;
                let next = {x, y};
                if (this.isValid(x, y) && !visited[x + '-' + y] && this.map.type([x, y]) === 'empty') {
                    visited[x + '-' + y] = true;
                    var path = this.dfs(next, dst, visited);
                    if (path) {
                        path.unshift(next);
                        return path;
                    }
                }
            }
        }
    }

    /**
     * 广度优先搜索
     */
    bfs(src, dst, visited) {
        if (src.x == dst.x && src.y == dst.y) {
            return [dst];
        } else {
            let queue = [];
            queue.push(src);
            let path = []
            while (queue.length > 0) {
                src = queue.shift();
                path.push(src);
                if(src.x == dst.x && src.y == dst.y){
                    return path;
                }
                for (let [i,j] of this.path) {
                    let x = src.x + i;
                    let y = src.y + j;
                    let next = {x, y}
                    if (this.isValid(x, y) && !visited[x + '-' + y] && this.map.type([x, y]) === 'empty') {
                        visited[x + '-' + y] = true
                        queue.push(next);
                    }
                }
            }
        }
    }
    /**
     * A* 寻路算法
     * @param src
     * @param dst
     * @param visited
     * @returns {*[]}
     */
    astar(src,dst,visited){
        if(src.x == dst.x && src.y == dst.y){
            return [dst]
        }
        let dist = (s1,s2)=>{
            return Math.abs(s1.x - s2.x) + Math.abs(s1.y - s2.y);
        };
        let hashPos = s => s.x + '-' + s.y;
        let cmp = (el1,el2) => dist(el1,dst) - dist(el2,dst);
        let heap = new MinHeap(cmp);
        heap.push(src);
        let path = []
        while(!heap.empty()){
            src = heap.pop();
            path.push(src);
            if(src.x == dst.x && src.y == dst.y){
                return path;
            }
            for(let [i,j] of this.path){
                let x = src.x  + i;
                let y = src.y + j;
                let next = {x,y};
                if(this.isValid(x,y) && !visited[x + '-' + y] && this.map.type([x,y]) == 'empty'){
                    visited[x + '-' + y] = true;
                    heap.push(next);
                }
            }
        }
    }
}
class Character{
    constructor(selector){
        if(typeof selector == 'string'){
            this.$el = document.querySelector(selector)
        }else if(selector.nodeType){
            this.$el = selector
        }else{
            this.$el = null
        }
    }
    setPos([x,y]){
        this.x = x;
        this.y = y;
        this.$el.style.left = x * 20 + 'px';
        this.$el.style.top = y * 20 + 'px';
    }
    getPos() {
        return {x: this.x, y: this.y};
    }
}
/**
 * 玩家类
 */
class Player extends Character{
    constructor(selector) {
        super(selector)
    }
    /**
     * 异步移动,实现动画效果
     * @param pos
     */
    goto(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.$el.style.left = this.x * 20 + 'px';
        this.$el.style.top = this.y * 20 + 'px';
    }
}
class Enemy extends Character{
}
class Target extends Character{
}
/**
 * 主游戏类
 */
class Game extends Event{
    constructor(cfg) {
        super()
        //初始化配置
        this.cfg = {
            rows: 20,
            cols: 20,
            search_type: 'dfs',
            duration: 100
        }
        Object.assign(this.cfg,cfg);

        //初始化数据
        this.map = new GridMap('#kingsman-map');
        this.player = new Player('#kingsman-player');
        this.target = new Target('#kingsman-target');
        this.map.create(this.cfg.rows, this.cfg.cols);
        this.pathFinder = new PathFinder(this.map,{
            search_type: this.cfg.search_type
        });

        //重置游戏状态
        this.reset();
    }
    /**
     * 设置玩家和目标
     */
    setPlayerAndTarget() {
        let positions = [];
        for (let i = 0; i < this.cfg.rows; i++) {
            for (let j = 0; j < this.cfg.cols; j++) {
                if (this.map.type([i, j]) == 'empty') {
                    positions.push([i, j]);
                }
            }
        }
        let len = positions.length;
        if (len < 2) {
            throw new Error('map is full');
        }
        Utils.shuffle(positions);
        let player = positions[0];
        let target = positions[1];
        this.player.setPos(player);
        this.target.setPos(target);
    }
    setEnemy(){

    }
    /**
     * 随机的修建障碍物 //todo 建筑迷宫算法
     */
    randBuild() {
        for (let i = 0; i < this.cfg.rows; i++) {
            for (let j = 0; j < this.cfg.cols; j++) {
                if (Math.random() > 0.9) {
                    this.map.type([i, j], 'wall');
                }
            }
        }
    }

    /**
     * 设置间隔时间
     * @param duration
     */
    setDuration(duration) {
        this.cfg.duration = duration;
        this.player.$el.style.transitionDuration = duration + 'ms';
    }

    /**
     * 设置地图尺寸
     * @param n
     */
    setSize(n) {
        this.cfg.rows = this.cfg.cols = n;
        this.map.create(this.cfg.cols, this.cfg.rows);
        this.randBuild();
    }

    /**
     * 设置寻路算法
     * @param search_type
     */
    setSearchType(search_type) {
        this.pathFinder.setSearchType(search_type);
    }

    move(pos) {
        this.player.goto(pos);
    }

    /**
     * 寻路
     * @param target
     */
    goto(dst) {
        //自动寻路
        if (dst == void 0) {
            dst = this.target.getPos();
        }
        let player = this.player.getPos();
        let path = this.find_path(player, dst);
        for (let next of path) {
            this.run_async(this.move, [next])
                .catch(err =>{
                    console.error(err)
                })
        }
        let target = this.target.getPos()
        if(dst.x == target.x && dst.y == target.y) {
            this.run_async(function(){
                this.fire('gameover'); // 游戏结束加载下一关卡
            });
        }
    }
    /**
     * 寻找路径
     * @param src
     * @param target
     * @returns {*|Array}
     */
    find_path(src, target) {
        return this.pathFinder.find_path(src, target);
    }

    /**
     * 运行异步函数
     * @param handler
     * @param args
     * @returns {Promise}
     */
    run_async(handler, args) {
        let promise = new Promise((resolve, reject)=> {
            this.queue.push({
                handler, args,
                callback: function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
            });
        });
        if (!this.running) {
            this.taskloop();
        }
        return promise;
    }

    /**
     * 主任务循环
     */
    taskloop() {
        this.running = true;
        if(this.isPaused) return;
        let task = this.queue.shift();
        if (task) {
            try {
                let ret = task.handler.apply(this, task.args);
                task.callback(null, ret); //成功回调
                setTimeout(this.taskloop.bind(this), this.cfg.duration);
            } catch (err) {
                this.running = false;
                this.queue = [];
                task.callback(err); //失败回调
            }
        } else {
            this.running = false;
        }
    }

    /**
     * 切换到下一关
     */
    next_level() {
        this.reset();
    }
    /**
     *
     * 重置游戏状态
     */
    reset() {
        this.map.clear();
        this.randBuild();
        this.setPlayerAndTarget();
        this.queue = [];
        this.running = false;
        this.isPaused = false;
    }

    /**
     * 暂停寻路动画
     */
    pause(){
        this.isPaused = true
    }

    /**
     * 恢复寻路动画
     */
    restart(){
        this.isPaused = false
        if(this.running){
            this.taskloop();
        }
    }
}
/**
 * 控制类
 */
class Application extends Event{
    constructor() {
        super();
        this.$controls = document.getElementById('kingsman-control');
        this.$duration = document.getElementById('duration');
        this.$search_type = document.getElementById('search_type');
        this.$size = document.getElementById('size');
        this.$map = document.getElementById('kingsman-map');
        this.$bg = document.getElementById('kingsman-bg');
        this.$pause_restart = document.getElementById('pause_restart');
        this.$game_level = document.getElementById('kingsman-game-state-level')
        this.level = 1;
        let cfg = this.readConfig();
        this.game = new Game(cfg);
        this.showGameState()
        this.bindUI();
    }
    /**
     * 初始化配置
     */
    readConfig(){
        let duration = this.$duration.value;
        let size = this.$size.value;
        let search_type = this.$search_type.value;
        return {duration,size,search_type}
    }
    showGameState(){
        this.$game_level.innerHTML = `第${this.level}关`;
    }
    /**
     * 进入下一关
     */
    next_level(){
        this.level++;
        this.showGameState();
        this.game.next_level();
    }
    /**
     * 绑定事件
     */
    bindUI() {
        this.game.on('gameover',this.next_level.bind(this))
        this.$controls.addEventListener('change', e => {
            switch (e.target.id) {
                case 'duration':
                    let duration = this.$duration.value;
                    this.game.setDuration(duration);
                    break;
                case 'search_type':
                    let search_type = this.$search_type.value;
                    this.game.setSearchType(search_type)
                    break;
                case 'size':
                    let size = this.$size.value;
                    this.game.setSize(size);
                    break;
                default:
                    break;
            }
        });
        this.$controls.addEventListener('click', e => {
            switch (e.target.id) {
                case 'goto_target':
                    this.game.goto(); //自动寻路
                    break;
                case 'next_level':
                    this.next_level();
                    break;
                case 'pause_restart':
                    let state = e.target.dataset.type
                    if(state == 'pause'){
                        e.target.dataset.type = 'restart';
                        e.target.textContent = '继续';
                        this.game.pause()
                    }else{
                        e.target.dataset.type= 'pause'
                        e.target.textContent = '暂停'
                        this.game.restart()
                    }
            }
        });
        this.$bg.addEventListener('click', e=> {
            let x,y;
            if (e.target.nodeName.toLowerCase() === 'td') {
                let cell = e.target;
                x = cell.cellIndex;
                y = cell.parentNode.rowIndex;
            }else if(e.target.id == 'kingsman-target') {
                let pos = this.game.target.getPos()
                x = pos.x;
                y = pos.y;
            }
            let target = {x, y};
            this.game.goto(target);//手动寻路
        });
    }
}
var app = new Application();
