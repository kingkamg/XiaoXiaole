
cc.Class({
    extends: cc.Component,

    properties: {
        socket: {
            default: null,
            type: WebSocket
        },
    },

    onDestroy() {
        /**
         * 当节点注销时需要把长连接关闭
         */
        this.colseSocket();
    },

    connectSocket(adress, timeOut = 10000, callBack = null) {
        if (adress && adress !== null) {

            this.socket = new WebSocket(adress);
            this.socket.onopen = function (event) {
                console.log("连接成功");
            };
            this.socket.onmessage = function (event) {
                console.log("接收到消息：" + event.data);
            };
            this.socket.onerror = function (event) {
                console.log("出现错误：" + event);
            };
            this.socket.onclose = function () {
                console.log("连接关闭:");
            };
        }

    },
    colseSocket() {
        if (this.socket && this.socket !== null) {
            this.socket.clear();
        }
    },
    openCB(callBack) {
        if (callBack && callBack !== null) {
            this.openCallBack = callBack;
        }
    },
    messageCB(callBack) {
        if (callBack && callBack !== null) {
            this.messageCallBack = callBack;
        }
    },
    errorCB(callBack) {
        if (callBack && callBack !== null) {
            this.errorCallBack = callBack;
        }
    },
    closeCB(callBack) {
        if (callBack && callBack !== null) {
            this.closeCallBack = callBack;
        }
    }
});
