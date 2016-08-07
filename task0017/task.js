/**
 * Created by yj on 16/3/21.
 */
var rDate = /(\d{4})-(\d{2})-(\d{2})/;
var aqiSourceData = {
    "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
    }
}
var colors = ['#32710f', '#e43026', '#631f6f', '#2e2e2e']
function getDateStr(data) {
    var y = data.getFullYear();
    var m = data.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = data.getDate()
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var data = new Date('2016-01-01');
    var dataStr = "";
    for (var i = 1; i < 92; i++) {
        dataStr = getDateStr(data)
        returnData[dataStr] = Math.ceil(Math.random() * seed)
        data.setDate(data.getDate() + 1)
    }
    return returnData

}
var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
var chartData = {}
/**
 * 记录当前页面的表单选项
 */
var pageState = {
    nowSelectCity: -1, //选择的城市
    nowGraTime: "day", //选择的显示日期格式(天,周,月)
    max_height: 600,
    max_width: 800
}

/**
 * 更新页面配置并格式化数据,以便于渲染
 */
function updateChart(prop) {
    if (prop != null) {
        for (name in prop) {
            pageState[name] = prop[name]
        }
    }
    var time = pageState.nowGraTime
    chartData = aqiSourceData[pageState.nowSelectCity]
    switch (time) {
        case 'day':
            pageState.max_width = 800
            break;
        case 'week':
            pageState.max_width = 400
            var res = {}
            for(var date in chartData){
                var week =  getYearWeek(new Date(date))
                if(!res[week]) res[week] = []
                res[week].push(chartData[date])
            }
            chartData = {}
            for (var date in res) {
                chartData[date] = res[date].reduce(function (x, y) {
                        return x + y
                    }, 0) / res[date].length  //求月平均降水量
            }
            break;
        case 'month':
            pageState.max_width = 200
            var res = {}
            for (var date in chartData) {
                var month = date.split('-')[1]
                if (!res[month]) res[month] = []
                res[month].push(chartData[date])
            }
            chartData = {}
            for (var date in res) {
                chartData[date] = res[date].reduce(function (x, y) {
                        return x + y
                    }, 0) / res[date].length  //求月平均降水量
            }
            break;
        default:
            throw new Error("Unsupported type")
    }
}
/**
 * 计算当前日期为第几周
 *
 */
function getYearWeek(date){
    var date2=new Date(date.getFullYear(), 0, 1);
    var day1=date.getDay();
    if(day1==0) day1=7;
    var day2=date2.getDay();
    if(day2==0) day2=7;
    d = Math.round((date.getTime() - date2.getTime()+(day2-day1)*(24*60*60*1000)) / 86400000);
    return Math.ceil(d /7)+1;
}
function getChartInstance() {
    if ($("#aqi-chart").length == 0) {
        $("<div></div>", {
            id: 'aqi-chart'
        }).css({
            height: pageState.max_height,
            width: pageState.max_width,
            position: 'relative',
            margin: '0 auto',
        }).appendTo("body")

    }
    return $("#aqi-chart").css({
        height: pageState.max_height,
        width: pageState.max_width
    }).empty() //删除以前的内部数据
}
/**
 * 渲染图表
 */
function renderChart() {
    var max_height = pageState.max_height;
    var max_width = pageState.max_width;
    var $chart = getChartInstance()
    var data = []
    for (var key in chartData) {
        data.push(chartData[key])
    }
    var max_value = -1
    data.forEach(function (el) {
        max_value = Math.max(max_value, el)
    })
    max_value = 600
    var width = max_width / data.length
    var i = 0
    for (var date in chartData) {
        var value = chartData[date]
        var height = value / max_value * max_height
        var color = colors[Math.floor(height / (max_height + 1) * 4)]
        $(`<div></div>`, {
            "title": `${date}:${value}`
        }).css({
            height: height,
            width: width,
            background: color,
            position: 'absolute',
            left: width * i + i,
            bottom: 0,
        }).appendTo($chart)
        i++;
    }
}
/**
 * 日,周,月的radio事件点击时的处理函数
 */
function graTimeChange() {
    var prop = $(this).val()
    pageState.nowGraTime = prop
    prop = {
        nowGraTime: prop
    }
    updateChart(prop)
    renderChart()
}

/**
 * select 发生变化时的处理函数
 */
function citySelectChange() {
    var city = $(this).val()
    var prop = {
        nowSelectCity: city
    }
    updateChart(prop)
    renderChart()
}

/**
 * 初始化日,周,月的radio事件,当点击时,调用函数graTimeChange
 */
function initGraTimeForm() {
    $("[name='gra-time']").change(graTimeChange)
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    var cities = Object.keys(aqiSourceData)
    cities.forEach(function (el) {
        $(`<option value="${el}">${el}</option>`).appendTo($("#city-select"))
    })
    var $city_select = $("#city-select")
    $city_select.change(citySelectChange)
    if ($city_select.children().length > 0) {
        pageState.nowSelectCity = $city_select.children()[0].value
    }
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    updateChart()
    renderChart()
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm() //初始化radio事件
    initCitySelector() //初始化城市select事件
    initAqiChartData() //初始化图表需要的数据格式
    renderChart()
}

init()