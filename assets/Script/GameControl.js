
var UserDataBean = require("UserDataBean")
var ObjUtil = require("ObjUtil")
var GameSocket = require("GameSocket")
var GlobleVar = require("GlobleVar")

//全局事件注册
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

    properties: {
        socketModul: {
            default: null,
            type: cc.Node
        },
        socketComponent: null,
        matchView: {
            default: null,
            type: cc.Node
        }
    },
    onDestroy() {

    },
    onLoad() {
        return;
        if (ObjUtil.isEmpty(this.socketModul)) {
            console.error("socketModul为空，请从层次管理器中拖动SocketModul绑定到属性检查器中的SocketModul");
            return;
        }
        this.openEvent();

        this.socketComponent = this.socketModul.getComponent("GameSocket");
        if (!ObjUtil.isEmpty(this.socketComponent)) {
            this.socketComponent.connectSocket('ws://118.25.40.163:8088', 10000);
        }
    },
    // SOCKET_EVENT_OPEN: 'SOCKET_EVENT_OPEN', //socket连接建立成功事件
    // SOCKET_EVENT_CLOSE: 'SOCKET_EVENT_CLOSE', //socket连接关闭事件
    // SOCKET_EVENT_RECEIVE: 'SOCKET_EVENT_RECEIVE', //socket接收到消息事件
    // SOCKET_EVENT_ERROR: 'SOCKET_EVENT_ERROR', //socket连接错误事件
    // SOCKET_EVENT_OUTLINE: 'SOCKET_EVENT_OUTLINE', //socket连接掉线
    // SOCKET_EVENT_RELINK: 'SOCKET_EVENT_RELINK', //socket重新连接
    openEvent() {
        cc.director.GlobalEvent.on(GlobleVar.SOCKET_EVENT_OPEN, this.openHandle, this);
        // cc.director.GlobalEvent.on(GlobleVar.SOCKET_EVENT_CLOSE, this.closeHandle, this);
        cc.director.GlobalEvent.on(GlobleVar.SOCKET_EVENT_RECEIVE, this.messageHandle, this);
    },
    openHandle: function (msgData) {
        console.log("打开连接：" + JSON.stringify(msgData));
    },
    // closeHandle: function (msgData) {


    //     console.log("关闭连接：" + JSON.stringify(msgData));
    // },
    messageHandle: function (msgData) {
        console.log("接收到消息：" + JSON.stringify(msgData));
        setTimeout(() => {
            this.matchView.active = false;
        }, 2000);
    },
    closeEvent() {
        cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_OPEN);
        // cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_CLOSE);
        cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_RECEIVE);
    },
});
