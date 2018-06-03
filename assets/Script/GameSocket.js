
var UserDataBean = require("UserDataBean")
var ObjUtil = require("ObjUtil")
var GlobleVar = require("GlobleVar")
cc.Class({
    extends: cc.Component,
    properties: {
        socket: {       //socket实例
            default: null,
            type: WebSocket,
        },
        socketAdress: '',
        lastHeartTime: 0, //最后收到心跳的时间
        isOver: false,//长连接是否已经结束，用该字段判断连接是否需要在断开之后重新连接
        usersInfo: {        //所有玩家的数据,通过键值对存储
            default: null,
            type: Map,
        },
        checkHeartTimer: { //测试心跳的计时器
            default: null
        },
    },
    /**
            * 
            * @param {*} userId 用户ID，通过用户ID来取用户数据，返回UserDataBean对象
            */
    getUser(userId) {
        if (ObjUtil.isEmpty(userId)) {
            return null;
        }
        if (ObjUtil.isEmpty(this.usersInfo)) {
            return null;
        }
        if (this.usersInfo.has(userId + '')) {
            return this.usersInfo.get(userId + '');
        }
        return null;
    },

    /**
     * 
     * @param {*} userId 用户ID
     * @param {*} userData 用户数据
     */
    setUser(userId, userData) {
        if (ObjUtil.isEmpty(userId)) {
            return;
        }
        if (ObjUtil.isEmpty(userData)) {
            return;
        }
        if (userData instanceof UserDataBean) {
            if (ObjUtil.isEmpty(this.usersInfo)) {
                this.usersInfo = new Map();
            }
            this.usersInfo.set(userId + '', userData)
        } else {
            console.error("存储的用户对象类型不是UserDataBean");
        }
    },
    connectSocket(adress, timeOut = 10000) {

        let that = this;
        if (ObjUtil.isEmpty(adress)) {
            cc.director.GlobalEvent.emit("SOCKET_EVENT_ERROR",
                {
                    errCode: 301,
                    msg: 'adress is empty'
                }
            );
            return;
        }
        if (adress === that.socketAdress && !ObjUtil.isEmpty(that.socket) && that.socket.readyState === WebSocket.OPEN) {    //已存在长连接
            cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_OPEN, //连接成功，向全游戏发送事件通知，并附带长链接的地址
                {
                    msgCode: 201,
                    msg: 'socket is existed',
                    adress: adress
                }
            );
            return;
        }
        that.socket = new WebSocket(adress);

        that.socket.onopen = function (event) {
            // console.log("onopen," + ObjUtil.isEmpty(that.node));
            cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_OPEN, //连接成功，向全游戏发送事件通知，并附带长链接的地址
                {
                    msgCode: 200,
                    msg: 'socket is open success',
                    adress: adress
                }
            );
            // console.log("onopen事件发送完成");
        };
        that.socket.onmessage = function (socketData) {
            console.log("onmessage");
            cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_RECEIVE, //接收到消息
                {
                    msg: 'received message',                             //描述
                    adress: adress,                                      //地址
                    data: socketData                                //接收到的数据
                }
            );
            console.log("onmessage事件发送完成");
        };
        that.socket.onerror = function (errData) {
            console.log("onerror");
            cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_ERROR, //连接错误
                {
                    errCode: 302,
                    msg: 'socket error',
                    adress: adress,
                    err: errData.data
                }
            );
        };
        that.socket.onclose = function () {
            console.log("onclose");
            cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_CLOSE, //连接关闭
                {
                    msg: 'socket closed',
                    adress: adress,
                }
            );
            that.socket = null;
        };

    },

    closeSocket() {
        this.cancleCheckHeart();
        this.isOver = true;     //正常对连接进行断开
        if (!ObjUtil.isEmpty(this.socket) && this.socket.readyState === WebSocket.OPEN) {    //检测是否存在长连接
            this.socket.clear();
        }
        this.socket = null;
    },

    /**
     * 测试心跳，以保证长连接可用
     */
    checkHeart() {
        this.checkHeartTimer = setInterval(() => {
            if ((new Date()).getTime() - this.lastHeartTime > 10000) {
                console.log("连接断开");
            }
        }, 10000);
    },
    /**
     * 关闭心跳检测
     */
    cancleCheckHeart() {
        if (!ObjUtil.isEmpty) {
            clearInterval(this.checkHeartTimer);     //关闭心跳检测
        }
    },
    onDestroy() {
        /**
         * 当节点注销时需要把长连接关闭
         */
        this.closeSocket();
    },

    checkReConnect() {
        if (this.isOver) {
            console.log("游戏已结束，不需要重新连接");
        } else {
            console.log("需要重连接");
        }
    },

    sendMsg(data) {
        if (ObjUtil.isEmpty(data)) {
            console.error("消息体为空，发送失败");
            return;
        }
        if (!ObjUtil.isEmpty(this.socket) && this.socket.readyState === WebSocket.OPEN) {    //检测是否存在长连接
            this.socket.send(JSON.stringify(data));
        } else {
            this.checkReConnect();
        }
    }

});
