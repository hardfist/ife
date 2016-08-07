/**
 * Created by yj on 16/4/8.
 */
class Application{
    constructor($el){
        this.$el = $el
        this.data = {
            '北京': [
                '北京大学',
                '清华大学'
            ],
            '天津': [
                '天津大学',
                '南开大学'
            ],
            '南京':[
                '南京大学',
                '东南大学'
            ]
        }
        this.init()
    }
    renderSchool(){
        let prov = this.$el.find('#province').val()
        let schools = this.data[prov]
        let $school = this.$el.find('#select-school')
        $school.empty()
        for(let school of schools){
            $('<option></option>').text(school).appendTo($school)
        }
    }
    renderTab(){
        let val = this.$el.find(':radio:checked').val()
        if(val == 'company'){
            $('#company').show()
            $('#school').hide()
        }else{
            $('#school').show()
            $('#company').hide()
        }
    }
    init() {
        this.renderTab()
        this.renderSchool()
        this.$el.find(':radio').on('change', this.renderTab.bind(this))
        this.$el.find('#province').on('change', this.renderSchool.bind(this))
    }
}
var app = new Application($('form'))