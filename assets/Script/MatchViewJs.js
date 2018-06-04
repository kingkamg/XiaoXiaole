// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var GlobleData = require("GlobleData")
var UserDataBean = require("UserDataBean")
var ObjUtil = require("ObjUtil")
var GlobleVar = require("GlobleVar")
cc.Class({
    extends: cc.Component,

    properties: {
        myCoverSprite: {
            type: cc.Sprite,
            default: null
        },
        opCoverSprite: {
            type: cc.Sprite,
            default: null
        },
        myNameLable: {
            type: cc.Label,
            default: null
        },
        opInfoModul: {
            type: cc.Node,
            default: null
        },
        opNameLable: {
            type: cc.Label,
            default: null
        },
        socketModul: {
            default: null,
            type: cc.Node
        },
        socketComponent: null,
        myUserData: {   //我的数据
            type: UserDataBean,
            default: null
        },
        opUsersData: {      //所有玩家的数据（其中包括我自己的）
            type: [UserDataBean],
            default: []
        }
    },
    cancleMatch() {
        console.log("关闭游戏");
    },

    onLoad() {
        GlobleData.myUserInfo = new UserDataBean();
        let userId = (new Date()).getTime();
        GlobleData.myUserInfo.userId = userId + '';
        GlobleData.myUserInfo.userName = "雷帮文";
        GlobleData.myUserInfo.userCover = 'http://p003bt12y.bkt.clouddn.com/mycover.jpeg';
        GlobleData.myUserInfo.gender = 1;
        GlobleData.myUserInfo.city = '杭州';
        if (ObjUtil.isEmpty(this.socketModul)) {
            console.error("socketModul为空，请从层次管理器中拖动SocketModul绑定到属性检查器中的SocketModul");
            return;
        }
        this.openEvent();

        this.socketComponent = this.socketModul.getComponent("GameSocket");
        if (!ObjUtil.isEmpty(this.socketComponent)) {
            // WebSocket("ws://172.16.10.44:8888/webSocket");
            this.socketComponent.connectSocket('ws://172.16.10.44:8888/webSocket', 10000);
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
        console.log("打开连接完成：" + JSON.stringify(msgData));
        console.log('开始匹配动作');
        // userId = '';     //用户ID
        // userName = '';        //用户名称
        // userCover = '';     //用户头像
        // gameData = null      //用户游戏数据
        // gender = 0;             //性别
        // city = '';      //城市

        let jsonString = {
            mType: 1,
            bType: 1,
            uid: GlobleData.myUserInfo.userId,
            data: {
                openId: GlobleData.myUserInfo.userId,
                name: GlobleData.myUserInfo.userName,
                avatarUrl: GlobleData.myUserInfo.userCover,
                gender: GlobleData.myUserInfo.gender,
                city: GlobleData.myUserInfo.city
            }
        };
        console.log("发送匹配动作数据：" + JSON.stringify(jsonString));
        this.socketComponent.sendMsg(jsonString);
    },
    // closeHandle: function (msgData) {

    //     console.log("关闭连接：" + JSON.stringify(msgData));
    // },
    messageHandle: function (result) {
        console.log("接收到消息：" + JSON.stringify(result));
        if (!ObjUtil.isEmpty(result.data)) {
            console.log("数据流程1");
            if (!ObjUtil.isEmpty(result.data) && result.data.bType == 1 && result.data.code == 200) {        //数据上传成功，可以开始匹配了
                // let jsonString = {
                //     mType: 1,
                //     bType: 2,
                //     uid: GlobleData.myUserInfo.userId,
                //     data: {
                //         openId: GlobleData.myUserInfo.userId,
                //         subject: '连连看1区'
                //     }
                // };
                // console.log("开始发送匹配命令2");
                // this.socketComponent.sendMsg(jsonString);
                console.log("数据流程2");
                let jsonString = {
                    mType: 1,
                    bType: 2,
                    uid: GlobleData.myUserInfo.userId,
                    data: {
                        openId: GlobleData.myUserInfo.userId,
                        subject: '连连看1区'
                    }
                };
                console.log("开始发送匹配命令2");
                console.log("开始发送匹配命令2: " + JSON.stringify(jsonString));
                this.socketComponent.sendMsg(jsonString);
            } else if (!ObjUtil.isEmpty(result.data) && result.data.bType == 2 && result.data.code == 200) {
                console.log("房间创建成功，等待其它玩家加入：房间ID = " + result.data.data.roomId);
                GlobleData.roomId = result.data.data.roomId;
                if (!ObjUtil.isEmpty(result.data.data) && !ObjUtil.isEmpty(result.data.data.cAvatarUrl)) {
                    this.opInfoModul.active = true;
                }
            } else if (!ObjUtil.isEmpty(result.data) && result.data.bType == 3) {
                console.log("匹配成功，即将开始游戏 = " + result.data.data.roomId);
                this.opInfoModul.active = true;
            } else if (!ObjUtil.isEmpty(result.data) && result.data.bType == 4) {
                console.log("开始游戏");
                this.node.active = false;
                cc.director.GlobalEvent.emit(GlobleVar.SOCKET_EVENT_BEGINGAME, {
                    code: 200
                });
            } else {
                console.log("其它类型：" + result.data.bType + " + " + result.data.code);
            }
            // else if (!ObjUtil.isEmpty(result.data) && result.data.bType == 3 && result.data.code == 200) {
            //     // this.node.active = false;
            //     console.log("数据为空3");
            // } 

            // setTimeout(() => {
            //     this.node.active = false;
            // }, 2000);
        } else {
            console.log("数据为空2");
        }
    },
    closeEvent() {
        cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_OPEN);
        // cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_CLOSE);
        cc.director.GlobalEvent.off(GlobleVar.SOCKET_EVENT_RECEIVE);
    },

    // update (dt) {},
});
