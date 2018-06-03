// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GlobleVar = require("GlobleVar")
cc.Class({
    extends: cc.Component,

    properties: {
        // timeLable: {
        //     default: null,
        //     type: cc.Node
        // },
        matchTime: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    //     cc.director.GlobalEvent.on(GlobleVar.SOCKET_EVENT_RECEIVE, (msgData) => {
    //         console.log("消息处收到事件：" + JSON.stringify(msgData.data));
    //     }, this);
    // },

    start() {
        let that = this;
        this.timer = setInterval(() => {
            that.matchTime += 1;
            if (that.matchTime < 60) {
                if (that.matchTime < 10) {
                    that.node.getComponent(cc.Label).string = "00:0" + that.matchTime;
                } else {
                    that.node.getComponent(cc.Label).string = "00:" + that.matchTime;
                }
            } else {
                if (that.matchTime % 60 < 10) {
                    that.node.getComponent(cc.Label).string = "0" + parseInt(that.matchTime / 60) + ":0" + that.matchTime % 60;
                } else {
                    that.node.getComponent(cc.Label).string = "0" + parseInt(that.matchTime / 60) + ":" + that.matchTime % 60;
                }
            }
        }, 1000);
        // that.node.getComponent(cc.Label).string = location.href;;
    },

    // update (dt) {},
});
