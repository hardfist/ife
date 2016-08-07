/**
 * Created by yj on 16/4/1.
 */
var Promise = function(executor){
    executor(this.resolve.bind(this),this.reject.bind(this))
}
Promise.prototype.resolve = function(data){
    if(this.onResolve){
        this.onResolve(data)
    }
}
Promise.prototype.reject = function(err){
    if(this.onReject){
        this.onReject(err)
    }
}
Promise.prototype.then = function(onResolve,onReject){
    this.onResolve = onResolve
    this.onReject = onReject
}
var promise = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve(100)
    },5000)
})
promise.then(function(data){
    console.log('data:',data)
})