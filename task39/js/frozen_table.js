/**
 * Created by yj on 16/4/12.
 */
class Widget{
    constructor(){
        this.listeners = {}
        this.boundingBox = null
    }
    on(type,handler){
        this.listeners[type] || (this.listeners[type] = [])
        this.listeners[type].push(handler)
    }
    fire(type,data){
        let handlers = this.listeners[type] || []
        for(let handler of handlers){
            handler && handler()
        }
    }
    render(container){
        this.boundingBox && this.boundingBox.remove()
        this.renderUI()
        this.listeners = {}
        this.bindUI()
        this.syncUI()
        $(container || document.body).append(this.boundingBox)
    }
    destroy(){
        this.destructor()
        this.boundingBox && this.boundingBox.remove()
    }
    /**
     * 添加dom节点
     */
    renderUI(){

    }

    /**
     * 绑定事件
     */
    bindUI(){

    }

    /**
     * 初始化组件属性
     */
    syncUI(){

    }

    /**
     * 销毁前回调函数
     */
    destructor(){

    }

}
class FrozenTable extends Widget{
    constructor(){
        super()
        this.cfg={
            'headers':['姓名','语文','数学','英语','总分'],
            'rows':[
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240],
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240],
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240],
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240],
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240],
                ['小红',80,90,70,240],
                ['小亮',60,100,70,230],
                ['小明',80,90,70,240]
            ]
        }
    }
    static generateTable(cfg){
        let self = new FrozenTable()
        $.extend(this.cfg,cfg)
        self.render($('#container'))
        return self
    }
    renderUI(){
        this.boundingBox = $('<table></table>').addClass('table')

        let $thead = this._thead = $('<thead></thead>')
            .appendTo(this.boundingBox)
        let $tr = $('<tr></tr>').appendTo($thead)
        for(let header of this.cfg.headers){
            $('<td></td>').text(header).appendTo($tr)
        }
        let $tbody = this._tbody = $('<tbody></tbody>').appendTo(this.boundingBox)
        for(let row of this.cfg.rows){
            let $tr = $('<tr></tr>').appendTo($tbody)
            for(let col of row){
                $('<td></td>').text(col).appendTo($tr)
            }
        }
        return this
    }
    bindUI(){
        let self = this
        let clone = null
        $(document).on('scroll',function(){
            let top = self._thead.offset().top - $(window).scrollTop()
            let bottom = top+ self.boundingBox.height()
            if(top <= 0 && bottom >=0){
                if(clone) return
                clone = self._thead.clone()
                clone.addClass('fixed').appendTo(self.boundingBox)
            }else{
                clone && clone.remove()
                clone = null
            }

        })
    }
}
class Application{
    constructor(){
        this.init()
    }
    init(){
        let table = FrozenTable.generateTable()
    }
}
let app = new Application()