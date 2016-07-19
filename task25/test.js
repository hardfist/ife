//将hash转化为要Ajax请求的地址
function formatHash(hash) {
    hash = decodeURIComponent(hash);
    var hashFormatted = hash.replace(/#\/([^#]+)#?(.+)?/, function(a, m1) {
        return m1;
    }).replace(/&/, function(a, m){
        return '/';
    });
    var key = /(en_us)$/.test(hashFormatted) ? "productKey" : "docKey";
    var hashArr = [];
    hashFormatted.replace(/\/(\w+)_en_us(.*)/g, function(a, m1, m2) {
        hashArr.push(m1);
        hashArr.push(m2);
    });
    hashArr[0] = (key === 'docKey') ? (hashArr[0] + '_en_us') : hashArr[0];
    return baseHostUrl + "json/convert.jsonp?" + key + "=" + hashArr.join('') + "&callback=tryJSONPadding";
}
//将hash转化为要Ajax请求的地址
function formatHash(hash) {
    hash = decodeURIComponent(hash);
    var hashFormatted = hash.replace(/#\/([^#]+)#?(.+)?/, function (a, m1) {
        return m1;
    });
    console.log("hashFormatted: " + hashFormatted);
    var key;
    if(/(en_us)$/.test(hashFormatted)){
        key = "productKey";
        value = hashFormatted.replace("pub/","").replace("_en_us","");
    } else {
        key = "docKey";
        value = hashFormatted.replace("pub/","").replace("&amp;","/").replace("&","/");
    }
    return baseHostUrl + "json/convert.jsonp?" + key + "=" + value + "&callback=tryJSONPadding";
}