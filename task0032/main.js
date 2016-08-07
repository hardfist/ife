/**
 * Created by yj on 16/4/9.
 * 基于配置文件生成表单生成器,再基于表单生成器的选项,生成表单内容
 */
class Form {
    constructor({label, type, validator, rules, success, fail,style}) {
        this.label = label
        this.type = type
        this.validator = validator
        this.rules = rules
        this.success = success
        this.fail = fail
        this.style = style
        this.init(this.label, this.type)
        this.bind()
    }

    init(label, type) {
        let $label = $('<label></label>').attr('for', label).text(label)
        let $input = $('<input>').attr('id', label).attr('type', type)
        let $prompt = $('<div></div>').addClass('prompt')
        this.$prompt = $prompt
        this.$input = $input
        this.$el = $('<div></div>')
            .addClass('wrapper')
            .append($label)
            .append($input)
            .append($prompt)
    }

    bind() {
        this.$input.on('focus', ()=> {
            this.$prompt.text(this.rules)
        })
        function invert(str) {
            if (str == 'success') {
                return 'error'
            } else {
                return 'success'
            }
        }

        this.$input.on('blur', ()=> {
            let inputVal = this.$input.val()
            let res = this.validator(inputVal) ? 'success' : 'error'
            this.$prompt
                .addClass(res)
                .removeClass(invert(res))
                .text(this[res])
            this.$input
                .addClass(res)
                .removeClass(invert(res))
        })
    }
    validate(){
        this.$input.trigger('blur')
        return this.$input.find('.error').length  == 0
    }
}
class FormFactory {
    constructor($el,config,$container) {
        this.$el = $el
        this.$container = $container
        this.config = config
        this.forms = []
        this.init()
    }
    reset(){
        this.$forms = []
        this.$container.empty()
        this.$container.removeClass(this.config.styles.join(' '))
    }
    init() {
        this.render()
        let btn = this.$el.find(':button')
        btn.on('click',this.generateForms.bind(this))
    }
    generateForms() {
        this.reset()
        let values = this.getForms()
        let style = this.getStyle()
        for (let form of this.config.forms) {
            if (values.indexOf(form.label) > -1) {
                let newForm = new Form(form)
                this.$container.append(newForm.$el)
                this.forms.push(newForm)
            }
        }
        $(`<button type="submit" class="submit">提交</button>`).appendTo(this.$container)
        if (style) {
            this.$container.addClass(style)
        }
        this.$container.find('.submit').on('click', this.validate.bind(this))
    }
    validate(){
        let allPassed = true 
        for(let form of this.forms){
            if(!form.validate()){
                allPassed = false
            }
        }
        if(allPassed){
            alert('提交成功')
        }else{
            alert('存在错误')
            return false
        }
    }
    getForms(){
        let $checkedForms = this.$el.find('[type="checkbox"]:checked')
        return $.map($checkedForms,function(e){
            return e.value
        })
    }
    getStyle(){
        return this.$el.find('[type="radio"]:checked').val()
    }
    render(){
        for(let form of this.config.forms){
            $(`<label><input type="checkbox" name="form" value=${form.label}>${form.label}</label>`).appendTo(this.$el)
        }
        for(let i=0;i<this.config.styles.length;i++){
            let style = this.config.styles[i]
            let $label = $(`<label><input type="radio" name="style" value="${style}">${'样式'+(i+1)}</label>`).appendTo(this.$el)
            if(i==0){
                $label.find('input').attr('checked','checked')
            }
        }
        $(`<input type="button" value="生成表单">`).appendTo(this.$el)
    }
}
class Application {
    constructor() {
        this.init()
    }
    init() {
        let config = {
            styles: ['style1','style2'],
            forms: [
                {
                    label: '用户名',
                    type: 'input',
                    validator: function (str) {
                        return str.length > 0
                    },
                    rules: '必要,长度为4-16个字符',
                    success: '格式正确',
                    fail: '名称不能为空'
                },
                {
                    label: '密码',
                    type: 'input',
                    validator: function (str) {
                        return str.length > 10
                    },
                    rules: '必要密码长度大于10个字符',
                    success: '格式正确',
                    fail: '名称不能为空'
                },
                {
                    label: '邮箱',
                    type: 'input',
                    validator: function (str) {
                        return str.length > 0
                    },
                    rules: '必要,长度为4-16个字符',
                    success: '格式正确',
                    fail: '名称不能为空'
                },
                {
                    label: '手机',
                    type: 'input',
                    validator: function (str) {
                        return str.length > 10
                    },
                    rules: '必要密码长度大于10个字符',
                    success: '格式正确',
                    fail: '名称不能为空'
                }
            ]
        }
        let factory = new FormFactory($('#generator'),config,$('#container'))
    }
}
var app = new Application()