
var objBean = require('NodeBean')
var typeBean = require('TypeBean')
cc.Class({
    extends: cc.Component,

    properties: {
        _bgMusicPlay: {
            default: null
        },
        overDialog: {
            type: cc.Node,
            default: null
        },
        winLable: {
            default: null,
            type: cc.Label
        },
        leftTime: 60,   //剩余时间的秒数
        myLeft: 80,
        opponentLeft: 80,
        leftTimeCompnent: {
            type: cc.Label,
            default: null
        },   //剩余时间的秒数
        myLeftCompnent: {
            type: cc.Label,
            default: null
        },
        opponentLeftCompnent: {
            type: cc.Label,
            default: null
        },
        myuuid: 0,
        time: 0,
        ws: {
            default: null,
            type: WebSocket
        },
        rowCount: 8,
        columCount: 10,
        xiaocuMusic: {
            default: null,
            url: cc.AudioClip
        },
        bgm: {
            default: null,
            url: cc.AudioClip
        },
        selectedBgm: {
            default: null,
            url: cc.AudioClip
        },
        desAnim: {
            default: null,
            type: cc.Prefab
        },
        bgNode: {           //背景节点预制体
            default: null,
            type: cc.Prefab
        },
        bgNodes: [],        //背景节点数组
        gameObjs: {     //预制体
            default: [],
            type: [cc.Prefab]
        },
        gameNodes: {
            default: [],
            type: objBean
        },       //游戏节点
        linecanvas: {
            default: null,
            type: cc.Node
        },
        nodeContaint: {
            default: null,
            type: cc.Node,
        },

        // 匹配界面
        pipeiView: {
            default: null,
            type: cc.Node
        },
        pipeiMyName: {
            default: null,
            type: cc.Label
        },
        pipeiOpName: {
            default: null,
            type: cc.Label
        },
        pipeiMyCover: {
            default: null,
            type: cc.Sprite
        },
        pipeiOpCover: {
            default: null,
            type: cc.Sprite
        },
        pipeiTimeLable: {
            default: null,
            type: cc.Label
        },
        pipeiTimer: null,
        pipeiTime: 0,
        rootIds: ''
    },


    popGame() {
        cc.director.popScene();
    },

    restartGame() {
        if (this.nodeContaint) {
            // let removeAction = cc.removeSelf(false);
            this.nodeContaint.removeAllChildren();
        }
        this.overDialog.active = false;
        // if (this.currentBgm) {
        //     cc.audioEngine.stop(this.currentBgm);
        //     // cc.audioEngine.play(that.bgm, true, 1);
        // }
        this.startGame();
    },

    // //生成背景节点列表
    // createBGNodes() {
    //     let that = this;
    //     let width = that.nodeContaint.width;
    //     let height = that.nodeContaint.height;
    //     for (let i = 0; i < that.columCount + 2; ++i) {
    //         let rowNode = [];
    //         if (i > 0 && i < (that.columCount + 1)) {        //第一行和最后一行为空
    //             for (let j = 0; j < that.rowCount + 2; ++j) {
    //                 if (j > 0 && j < (that.columCount + 1)) {        //第一列和最后一列置空
    //                     let newNodeObj = new objBean();
    //                     let newNode = cc.instantiate(this.bgNode);
    //                     let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
    //                     let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
    //                     newNode.setPosition(x, y);
    //                     // gameNewNode.setPosition(x, y);
    //                     newNodeObj.pointX = x;
    //                     newNodeObj.pointY = y;
    //                     newNodeObj.pointIndexX = j;
    //                     newNodeObj.pointIndexY = i;
    //                     newNodeObj.pointBgNode = newNode;
    //                     rowNode.push(newNodeObj);
    //                     that.nodeContaint.addChild(newNode);
    //                 } else {
    //                     let newNodeObj = new objBean();
    //                     //console.log("节点 = " + newNodeObj.pointX);
    //                     let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
    //                     let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
    //                     newNodeObj.pointX = x;
    //                     newNodeObj.pointY = y;
    //                     newNodeObj.pointIndexX = j;
    //                     newNodeObj.pointIndexY = i;
    //                     rowNode.push(newNodeObj);
    //                 }
    //             }
    //         } else {
    //             for (let j = 0; j < that.rowCount + 2; ++j) {
    //                 let newNodeObj = new objBean();
    //                 //console.log("节点 = " + newNodeObj.pointX);
    //                 let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
    //                 let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
    //                 newNodeObj.pointX = x;
    //                 newNodeObj.pointY = y;
    //                 newNodeObj.pointIndexX = j;
    //                 newNodeObj.pointIndexY = i;
    //                 rowNode.push(newNodeObj);
    //             }
    //         }
    //         this.gameNodes.push(rowNode);
    //     }
    // },

    isOver() {
        for (let i = 1; i < this.columCount + 1; ++i) {
            for (let j = 1; j < this.rowCount + 1; ++j) {
                if (this.gameNodes[i][j].pointValue >= 0) {
                    console.log("还没结束");
                    return false;
                }
            }
        }
        console.log("已经结束了");
        this.overDialog.active = true;
        return true;
    },

    shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = a[index];
            a[index] = a[len - i - 1];
            a[len - i - 1] = temp;
        }
        return a;
    },

    //生成可消除的节点列表并打乱顺序后放到地图中
    createGameNodes() {
        let that = this;
        let gameObjs = [];  //生成的游戏节点对象
        let typeCount = 0;      //可消除类型种类
        let nodeTotalCount = that.rowCount * that.columCount;       //总节点数

        if (this.gameObjs) {
            typeCount = that.gameObjs.length;
        }
        if (typeCount > 0) {
            let subTypeCount = parseInt(nodeTotalCount / typeCount);       //每种生成的个数，如果这个个数是偶数则直接用，如果这个个数是奇数个，则减一然后最后一种球补全
            if (subTypeCount % 2 === 1) {       //奇数个需要减一变成偶数个
                subTypeCount -= 1;
            }
            for (let i = 0; i < typeCount - 1; ++i) {       //前面N-1种偶数个
                for (let j = 0; j < subTypeCount; ++j) {
                    // let gameNewNode = cc.instantiate(that.gameObjs[i]);
                    let bean = new typeBean();
                    bean.type = i;
                    bean.node = cc.instantiate(that.gameObjs[i]);
                    gameObjs.push(bean);
                }
            }
            let remainCount = nodeTotalCount - gameObjs.length;
            for (let j = 0; j < remainCount; ++j) {        //最后一种补全剩下的
                // let gameNewNode = cc.instantiate(that.gameObjs[typeCount - 1]);
                let bean = new typeBean();
                bean.type = typeCount - 1;
                bean.node = cc.instantiate(that.gameObjs[typeCount - 1]);
                gameObjs.push(bean);
                // gameObjs.push(gameNewNode);
            }
        }
        gameObjs = that.shuffle(gameObjs);
        console.log("创建节点完成，节点个数" + gameObjs.length);
        return gameObjs;
        // let index = 0;
        // for (let i = 1; i < that.columCount + 1; ++i) {
        //     for (let j = 1; j < that.rowCount + 1; ++j) {
        //         let nodeObj = gameObjs[index];
        //         nodeObj.setPosition(that.gameNodes[i][j].pointX, that.gameNodes[i][j].pointY);
        //         that.gameNodes[i][j].pointNode = nodeObj;
        //         that.gameNodes[i][j].pointValue = nodeType;
        //         that.nodeContaint.addChild(nodeObj);
        //         index += 1;

        //     }
        // }
        // for (let i = 0; i < this.columCount; ++i) {
        //     for (let j = 0; j < this.rowCount; ++j) {
        //         if (objCount)
        //     }
        // }
    },


    startWebSocket() {
        let that = this;
        let data = new Date();
        that.time = data.getTime();
        console.log("开始连接配对");
        // cc.loader.load(remoteUrl, function (err, texture) {
        //     // Use texture to create sprite frame
        // });
        cc.loader.load('http://p003bt12y.bkt.clouddn.com/mycover.jpg', function (err, texture) {
            // console.log("error = " + err);
            // that.pipeiMyName.getComponent(cc.Label).string = JSON.stringify(err);
            var frame = new cc.SpriteFrame(texture);
            that.pipeiMyCover.spriteFrame = frame;
        });
        that.pipeiTimer = setInterval(() => {
            that.pipeiTime += 1;
            // console.log("时间 = " + that.pipeiTime);
            if (that.pipeiTime < 60) {
                if (that.pipeiTime < 10) {
                    that.pipeiTimeLable.getComponent(cc.Label).string = "00:0" + that.pipeiTime;
                } else {
                    that.pipeiTimeLable.getComponent(cc.Label).string = "00:" + that.pipeiTime;
                }
            } else {
                if (that.pipeiTime % 60 < 10) {
                    that.pipeiTimeLable.getComponent(cc.Label).string = "0" + parseInt(that.pipeiTime / 60) + ":0" + that.pipeiTime % 60;
                } else {
                    that.pipeiTimeLable.getComponent(cc.Label).string = "0" + parseInt(that.pipeiTime / 60) + ":" + that.pipeiTime % 60;
                }
            }
        }, 1000);
        this.ws = new WebSocket("ws://172.16.10.44:8888/webSocket");
        this.ws.onopen = function (event) {
            console.log("websocke连接成功");
            let jsonString = JSON.stringify(
                {
                    mType: 1,
                    bType: 1,
                    uid: that.myuuid + '',
                    data: {
                        openId: that.myuuid + '',
                        name: '雷帮文',
                        avatarUrl: 'https://img2.woyaogexing.com/2018/05/31/ecf76710fc9d8201!400x400_big.jpg',
                        gender: 1,
                        city: '杭州'
                    }
                });
            console.log("发送的json数据 = " + jsonString);
            that.ws.send(jsonString);
        };
        this.ws.onmessage = function (event) {
            console.log("response text msg: " + event.data);
            console.log("接收数据成功");
            if (event.data) {
                let jsonData = JSON.parse(event.data);
                if (jsonData.bType === 1) {
                    if (that.ws && that.ws.readyState === WebSocket.OPEN) {

                        let jsonString = JSON.stringify(
                            {
                                mType: 1,
                                bType: 2,
                                uid: that.myuuid + '',
                                data: {
                                    openId: that.myuuid + '',
                                    subject: '连连看1区'
                                }
                            });
                        console.log("发送的json数据 = " + jsonString);
                        that.ws.send(jsonString);
                    }
                } else if (jsonData.bType === 2) {
                    that.rootIds = jsonData.data.roomId;
                }
            }
            // that.ws.onclose();
            // let dataObj = JSON.parse(event.data);
        };
        this.ws.onerror = function (event) {
            console.log("websocke连接错误");
        };
        this.ws.onclose = function (event) {
            console.log("websocke连接关闭");
        };
        // setTimeout(function () {
        //     if (this.ws.readyState === WebSocket.OPEN) {
        //         this.ws.send("Hello WebSocket, I'm a text message.");
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 3);
    },


    startGame() {
        let that = this;
        if (that.gameNodes && that.gameNodes.length > 0) {
            that.gameNodes = [];
        }
        let gameNodeObjs = that.createGameNodes();
        let canvasComponey = that.linecanvas.getComponent(cc.Graphics);
        let width = that.nodeContaint.width;
        let height = that.nodeContaint.height;
        let nodeType = 0;
        let clickedNode = new objBean();
        let playAnim = null;
        let desAnim1 = null;
        let desAnim2 = null;
        let currentSocr = 1;
        // that._bgMusicPlay = cc.audioEngine.play(that.bgm, true, 1);
        let index = 0;
        for (let i = 0; i < that.columCount + 2; ++i) {
            let rowNode = [];
            if (i > 0 && i < (that.columCount + 1)) {        //第一行和最后一行为空
                for (let j = 0; j < that.rowCount + 2; ++j) {
                    if (j > 0 && j < (that.rowCount + 1)) {        //第一列和最后一列置空
                        let newNodeObj = new objBean();
                        let newNode = cc.instantiate(this.bgNode);
                        nodeType = parseInt(Math.random() * (4 + 1), 10);
                        let gameNewNode = gameNodeObjs[index].node;
                        let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
                        let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
                        newNode.setPosition(x, y);
                        gameNewNode.setPosition(x, y);
                        newNodeObj.pointX = x;
                        newNodeObj.pointY = y;
                        newNodeObj.pointIndexX = j;
                        newNodeObj.pointIndexY = i;
                        this.nodeContaint.addChild(newNode);
                        this.nodeContaint.addChild(gameNewNode);
                        newNodeObj.pointBgNode = newNode;
                        newNodeObj.pointNode = gameNewNode;
                        newNodeObj.pointValue = gameNodeObjs[index].type;
                        gameNewNode.on(cc.Node.EventType.TOUCH_START, function (event) {
                            if (clickedNode.pointValue !== -1
                                && clickedNode !== newNodeObj
                                && clickedNode.pointValue === newNodeObj.pointValue) {
                                let node_1_x = clickedNode.pointNode.getPosition().x;
                                let node_1_y = clickedNode.pointNode.getPosition().y;
                                let node_2_x = newNodeObj.pointNode.getPosition().x;
                                let node_2_y = newNodeObj.pointNode.getPosition().y;
                                //console.log("gameNewNode.getTag() = " + newNodeObj.pointValue + ",   clickedNode.getTag() = " + clickedNode.pointValue);
                                let points = that.matchBolck(that.gameNodes, newNodeObj, clickedNode);
                                if (points === null) {

                                    points = that.matchBolckOne(that.gameNodes, newNodeObj, clickedNode);
                                    if (points === null) {

                                        points = that.matchBolckTwo(that.gameNodes, newNodeObj, clickedNode);
                                        if (points !== null) {
                                            //console.log('2折相连节点数 = ' + points.length)
                                        }
                                    } else {
                                        //console.log('1折相连节点数 = ' + points.length)
                                    }
                                } else {
                                    //console.log('0折相连节点数 = ' + points.length)
                                }
                                if (points && points !== null && points.length > 0) {
                                    if (that.ws && that.ws.readyState === WebSocket.OPEN) {

                                        let jsonString = JSON.stringify(
                                            {
                                                mType: 1,
                                                bType: 5,
                                                data: {
                                                    openId: that.myuuid + '',
                                                    currentCompleted: currentSocr++,
                                                    currentScore: currentSocr++,
                                                    isOver: 0,
                                                    roomId: that.rootIds
                                                }
                                            });
                                        console.log("发送的json数据 = " + jsonString);
                                        that.ws.send(jsonString);
                                    }
                                    // if (that.ws && that.ws.readyState === WebSocket.OPEN) {
                                    //     that.ws.send(JSON.stringify(
                                    //         {
                                    //             time: that.time,
                                    //             myScor: 500,
                                    //             opponentScor: 700
                                    //         }));

                                    // } else {
                                    //     console.log("webSocket没有连接");
                                    // }
                                    // that.ws.send({ myScor: 500, opponentScor: 700 });


                                    cc.audioEngine.play(that.xiaocuMusic, false, 1);
                                    clickedNode.pointValue = -1;
                                    newNodeObj.pointValue = -1;
                                    clickedNode.pointNode.destroy();
                                    newNodeObj.pointNode.destroy();

                                    let desclickedNode = cc.instantiate(that.desAnim);
                                    let desnewNode = cc.instantiate(that.desAnim);
                                    desclickedNode.setPosition(node_1_x, node_1_y);
                                    desnewNode.setPosition(node_2_x, node_2_y);
                                    that.nodeContaint.addChild(desclickedNode);
                                    that.nodeContaint.addChild(desnewNode);
                                    playAnim = null;
                                    for (let k = 0; k < points.length; ++k) {
                                        if (k === 0) {
                                            canvasComponey.moveTo(points[k].pointX, points[k].pointY);
                                        } else {
                                            canvasComponey.lineTo(points[k].pointX, points[k].pointY);
                                        }
                                        //console.log('x = ' + points[k].pointX + ' + y = ' + points[k].pointY);
                                    }
                                    canvasComponey.stroke();
                                    setTimeout(() => {
                                        canvasComponey.clear();
                                    }, 500);
                                    that.isOver();
                                } else {
                                    //console.log('不符合条件，重新选取' + clickedNode.pointValue);
                                    cc.audioEngine.play(that.selectedBgm, false, 1);
                                    if (playAnim !== null) {
                                        playAnim.stop();
                                    }
                                    playAnim = newNodeObj.pointNode.getComponent(cc.Animation);
                                    playAnim.play('click');
                                    clickedNode = newNodeObj;
                                }
                                // //console.log(node_1_x + " + " + node_1_y + " + " + node_2_x + " + " + node_2_y)
                            } else {
                                if (playAnim !== null) {
                                    playAnim.stop();
                                }
                                cc.audioEngine.play(that.selectedBgm, false, 1);
                                playAnim = newNodeObj.pointNode.getComponent(cc.Animation);
                                playAnim.play('click');
                                clickedNode = newNodeObj;
                            }
                        }, newNodeObj);
                        rowNode.push(newNodeObj);
                        index += 1;
                    } else {
                        let newNodeObj = new objBean();
                        //console.log("节点 = " + newNodeObj.pointX);
                        let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
                        let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
                        newNodeObj.pointX = x;
                        newNodeObj.pointY = y;
                        newNodeObj.pointIndexX = j;
                        newNodeObj.pointIndexY = i;
                        rowNode.push(newNodeObj);
                    }
                }
            } else {
                for (let j = 0; j < that.rowCount + 2; ++j) {
                    let newNodeObj = new objBean();
                    //console.log("节点 = " + newNodeObj.pointX);
                    let x = -71 * (that.rowCount / 2) + 71 * (j - 1) + 35.5 + width / 2;
                    let y = -71 * (that.columCount / 2) + 71 * (i - 1) + 35.5 + height / 2;
                    newNodeObj.pointX = x;
                    newNodeObj.pointY = y;
                    newNodeObj.pointIndexX = j;
                    newNodeObj.pointIndexY = i;
                    rowNode.push(newNodeObj);
                }
            }
            this.gameNodes.push(rowNode);
        }
    },

    onLoad() {
        cc.audioEngine.play(this.bgm, true, 1);
        this.myuuid = parseInt(Math.random() * 1000000);
        this.startGame();
        this.startWebSocket();
    },

    // start() {

    // },
    // 0折相连
    matchBolck(datas, startPoint, endPoint) {
        if (startPoint.pointIndexX != endPoint.pointIndexX && startPoint.pointIndexY != endPoint.pointIndexY) {
            return null;
        }
        let min, max;
        if (startPoint.pointIndexX == endPoint.pointIndexX) {
            min = startPoint.pointIndexY < endPoint.pointIndexY ? startPoint.pointIndexY : endPoint.pointIndexY;
            max = startPoint.pointIndexY > endPoint.pointIndexY ? startPoint.pointIndexY : endPoint.pointIndexY;
            for (min++; min < max; min++) {
                if (!(datas[min][startPoint.pointIndexX].isEmpty())) {
                    return null;
                }
            }
        } else {// 如果两点的y坐标相等，则在竖直方向上扫描  
            min = startPoint.pointIndexX < endPoint.pointIndexX ? startPoint.pointIndexX : endPoint.pointIndexX;
            max = startPoint.pointIndexX > endPoint.pointIndexX ? startPoint.pointIndexX : endPoint.pointIndexX;
            for (min++; min < max; min++) {
                if (!(datas[startPoint.pointIndexY][min].isEmpty())) {
                    return null;
                }
            }
        }
        return [startPoint, endPoint];
    },
    //1折相连
    matchBolckOne(datas, startPoint, endPoint) {
        // if (startPoint.pointIndexX == endPoint.pointIndexX || startPoint.pointIndexY == endPoint.pointIndexY) {
        //     return null;
        // }
        let linePoint = []; //链接点
        let pt = new objBean(startPoint.pointIndexX, endPoint.pointIndexY, startPoint.pointX, endPoint.pointY);
        let stMatch = false;
        let tdMatch = false;
        if (datas[pt.pointIndexY][pt.pointIndexX].isEmpty()) {
            stMatch = this.matchBolck(datas, startPoint, pt);
            tdMatch = (stMatch !== null) ?
                this.matchBolck(datas, pt, endPoint) : stMatch;
            if (stMatch !== null && tdMatch !== null) {
                linePoint.push(startPoint);
                linePoint.push(pt);
                linePoint.push(endPoint);
                return linePoint;
            }
        }
        pt = new objBean(endPoint.pointIndexX, startPoint.pointIndexY, endPoint.pointX, startPoint.pointY);
        if (datas[pt.pointIndexY][pt.pointIndexX].isEmpty()) {
            stMatch = this.matchBolck(datas, startPoint, pt);
            tdMatch = (stMatch !== null) ?
                this.matchBolck(datas, pt, endPoint) : stMatch;
            if (stMatch !== null && tdMatch !== null) {
                linePoint.push(startPoint);
                linePoint.push(pt);
                linePoint.push(endPoint);
                return linePoint;
            }
        }
        return null;
    },
    matchBolckTwo(datas, startPoint, endPoint) {
        if (datas && datas !== null && datas.length > 0) {
            let pointList = [];     //链接点
            let stMatch = null;
            let etMatch = null;
            for (let i = startPoint.pointIndexX + 1; i < this.rowCount + 2; ++i) {
                if (datas[startPoint.pointIndexY][i].pointValue === -1) {
                    stMatch = this.matchBolckOne(datas, datas[startPoint.pointIndexY][i], endPoint);
                    if (stMatch !== null && stMatch.length > 0) {
                        pointList.push(startPoint);
                        pointList = pointList.concat(stMatch);
                        return pointList;
                    }
                } else {
                    break;
                }
            }
            for (let i = startPoint.pointIndexX - 1; i >= 0; --i) {
                if (datas[startPoint.pointIndexY][i].pointValue === -1) {
                    stMatch = this.matchBolckOne(datas, datas[startPoint.pointIndexY][i], endPoint);
                    if (stMatch !== null && stMatch.length > 0) {
                        pointList.push(startPoint);
                        pointList = pointList.concat(stMatch);
                        return pointList;
                    }
                } else {
                    break;
                }
            }
            for (let i = startPoint.pointIndexY + 1; i < this.columCount + 2; ++i) {
                if (datas[i][startPoint.pointIndexX].pointValue === -1) {
                    stMatch = this.matchBolckOne(datas, datas[i][startPoint.pointIndexX], endPoint);
                    if (stMatch !== null && stMatch.length > 0) {
                        pointList.push(startPoint);
                        pointList = pointList.concat(stMatch);
                        return pointList;
                    }
                } else {
                    break;
                }
            }
            for (let i = startPoint.pointIndexY - 1; i >= 0; --i) {
                if (datas[i][startPoint.pointIndexX].pointValue === -1) {
                    stMatch = this.matchBolckOne(datas, datas[i][startPoint.pointIndexX], endPoint);
                    if (stMatch !== null && stMatch.length > 0) {
                        pointList.push(startPoint);
                        pointList = pointList.concat(stMatch);
                        return pointList;
                    }
                } else {
                    break;
                }
            }
        } else {
            return null;
        }
    }
});
