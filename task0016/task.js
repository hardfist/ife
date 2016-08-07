/**
 * Created by yj on 16/3/21.
 */
(function() {
    /* element */
    var aqiData = {};
    /* valid regExp */
    var rInteger = /^[1-9]\d*$/; /* 整数 */
    var rValidCity = /^[\u4e00-\u9fa5a-zA-Z]+$/; /* 中英文字符 */

    function addBtnHandle(evt) {
        // 清除以前的错误提示
        $("#aqi-city-input").parent().removeClass("city-error")
        $("#aqi-value-input").parent().removeClass("value-error")
        var value = $("#aqi-value-input").val()
        var city = $("#aqi-city-input").val()
        var valid = true
        if(!rValidCity.test(city)){
            $("#aqi-city-input").parent().addClass("city-error");
            valid = false
        }
        if(!rInteger.test(value)){
            $("#aqi-value-input").parent().addClass("value-error")
            valid = false
        }
        if(valid) {
            $(`<tr><td>${city}</td><td>${value}</td><td><button>删除</button></td></tr>`).appendTo($("#aqi-table"))
        }
    }

    function delBtnHandle(evt) {
        if(evt.target.nodeName.toLowerCase() == 'button'){
            $(evt.target).parent().parent().remove()
        }
    }

    function init() {
        $("#add-btn").on("click",addBtnHandle)
        $("#aqi-table").on("click",delBtnHandle)
    }
    init()
}());