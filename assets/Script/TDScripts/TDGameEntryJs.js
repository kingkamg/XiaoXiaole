
var UserDataBean = require("UserDataBean")
var ObjUtil = require("ObjUtil")
var GameSocket = require("GameSocket")
var GlobleVar = require("GlobleVar")
cc.director.getPhysicsManager().enabled = true;
cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_centerOfMassBit;

//全局事件方法注册
cc.director.GlobalEvent = {
    handles_: {},
    //发送事件
    emit: function (eventName, data) {
        var returns = [] //返回值

        data.eventName = eventName//保存一下事件名字

        for (var findEvenName in this.handles_) {
            if (findEvenName == eventName) {
                for (var i = 0; i < this.handles_[findEvenName].length; i++) {
                    var returnValue = this.handles_[findEvenName][i](data)
                    returns.push(returnValue)
                }
            }
        }

        return returns
    },
    //添加普通事件
    on: function (eventName, callback, target) {
        // console.log('收到事件', eventName);
        this.handles_[eventName] = this.handles_[eventName] || []

        this.handles_[eventName].push(callback.bind(target))
    },
    //通过事件名和target移除一个监听器
    off: function (eventName) {
        for (var i = 0; i < this.handles_[eventName].length; i++) {
            this.handles_[eventName][i] = null
        }
    },
}


cc.Class({
    extends: cc.Component,

    // properties: {

    // },
    // onDestroy() {

    // },
    onLoad() {
        // return;

    },

});