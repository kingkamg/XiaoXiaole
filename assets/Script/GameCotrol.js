// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var objBean = require('NodeBean')
cc.Class({
    extends: cc.Component,

    properties: {
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

        // gameNode1:{
        //     default:null,
        //     type:cc.Prefab
        // },
        // gameNode2:{
        //     default:null,
        //     type:cc.Prefab
        // },
        // gameNode3:{
        //     default:null,
        //     type:cc.Prefab
        // },
        // gameNode4:{
        //     default:null,
        //     type:cc.Prefab
        // },
        // gameNode5:{
        //     default:null,
        //     type:cc.Prefab
        // },
        gameObjs: {     //预制体
            default: [],
            type: [cc.Prefab]
        },
        gameNodes: {
            default: [],
            type: objBean
        }       //游戏节点
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let that = this;
        let nodeHeight = 0;
        let rowCount = 9;
        let columCount = 9;
        let nodeIndex = 0;
        // let clickNode = new objBean();
        let clickNode = null;
        let playAnim = null;
        let desAnim1 = null;
        let desAnim2 = null;
        cc.audioEngine.play(that.bgm, true, 1);
        // for (let i = 0; i < columCount + 2; ++i) {
        //     let rowNode = [];
        //     if (i > 0 && i < (columCount + 1)) {        //第一行和最后一行为空
        //         for (let j = 0; j < rowCount + 2; ++j) {
        //             if (j > 0 && j < (columCount + 1)) {        //第一列和最后一列置空
        //                 let emptyNode = new objBean();
        //                 let newNode = cc.instantiate(this.bgNode);
        //                 nodeIndex = parseInt(Math.random() * (4 + 1), 10);
        //                 let gameNewNode = cc.instantiate(this.gameObjs[nodeIndex]);



        //                 let x = -71 * (rowCount / 2) + 71 * (j - 1) + 35.5;
        //                 let y = -71 * (columCount / 2) + 71 * (i - 1) + 35.5;
        //                 newNode.setPosition(x, y);
        //                 gameNewNode.setPosition(x, y);
        //                 emptyNode.pointIndexX = j;
        //                 emptyNode.pointIndexY = i;
        //                 this.node.addChild(newNode);
        //                 this.node.addChild(gameNewNode);
        //                 emptyNode.pointBgNode = newNode;
        //                 emptyNode.pointNode = gameNewNode;
        //                 emptyNode.pointValue = nodeIndex;
        //                 gameNewNode.on(cc.Node.EventType.TOUCH_START, function (event) {
        //                     // console.log(gameNewNode.getPosition().x)
        //                     if (clickNode.pointValue !== -1
        //                         && clickNode !== emptyNode) {
        //                         console.log("第二次点击")
        //                         let node_1_x = clickNode.pointNode.getPosition().x;
        //                         let node_1_y = clickNode.pointNode.getPosition().y;
        //                         let node_2_x = emptyNode.pointNode.getPosition().x;
        //                         let node_2_y = emptyNode.pointNode.getPosition().y;
        //                         console.log("gameNewNode.getTag() = " + emptyNode.pointValue + ",   clickNode.getTag() = " + clickNode.pointValue);
        //                         if (that.matchBolck(that.gameNodes, emptyNode, clickNode)) {
        //                             cc.audioEngine.play(that.xiaocuMusic, false, 1);
        //                             clickNode.pointValue = -1;
        //                             emptyNode.pointValue = -1;
        //                             clickNode.pointNode.destroy();
        //                             emptyNode.pointNode.destroy();

        //                             let desclickNode = cc.instantiate(that.desAnim);
        //                             let desnewNode = cc.instantiate(that.desAnim);
        //                             desclickNode.setPosition(node_1_x, node_1_y);
        //                             desnewNode.setPosition(node_2_x, node_2_y);
        //                             that.node.addChild(desclickNode);
        //                             that.node.addChild(desnewNode);
        //                             that.gameNodes[clickNode.pointIndexX][clickNode.pointIndexY].pointValue = -1;
        //                             that.gameNodes[emptyNode.pointIndexX][emptyNode.pointIndexY].pointValue = -1;
        //                             console.log("设置归零 " + clickNode.pointIndexX + ' + ' + clickNode.pointIndexY + ' + ' + emptyNode.pointIndexX + ' + ' + emptyNode.pointIndexY);
        //                             console.log('clickNode ' + that.gameNodes[clickNode.pointIndexX][clickNode.pointIndexY].pointValue);
        //                             console.log('emptyNode ' + that.gameNodes[emptyNode.pointIndexX][emptyNode.pointIndexY].pointValue);

        //                         } else {
        //                             console.log('不符合条件，重新选取' + clickNode.pointValue);
        //                             cc.audioEngine.play(that.selectedBgm, false, 1);
        //                             if (playAnim) {
        //                                 playAnim.stop();
        //                             }
        //                             playAnim = emptyNode.pointNode.getComponent(cc.Animation);
        //                             playAnim.play('click');
        //                             clickNode = emptyNode;
        //                         }
        //                         // console.log(node_1_x + " + " + node_1_y + " + " + node_2_x + " + " + node_2_y)
        //                     } else {
        //                         console.log('为空，重新选取' + (clickNode === null));
        //                         cc.audioEngine.play(that.selectedBgm, false, 1);
        //                         playAnim = emptyNode.pointNode.getComponent(cc.Animation);
        //                         playAnim.play('click');
        //                         clickNode = emptyNode;
        //                     }
        //                 }, emptyNode);
        //                 // node.parent = scene;

        //                 rowNode.push(emptyNode);
        //             } else {
        //                 let emptyNode = new objBean();
        //                 console.log("节点 = " + emptyNode.pointX);
        //                 emptyNode.pointIndexX = j;
        //                 emptyNode.pointIndexY = i;
        //                 rowNode.push(emptyNode);
        //             }
        //         }
        //     } else {
        //         for (let j = 0; j < rowCount + 2; ++j) {
        //             let emptyNode = new objBean();
        //             console.log("节点 = " + emptyNode.pointX);
        //             emptyNode.pointIndexX = j;
        //             emptyNode.pointIndexY = i;
        //             rowNode.push(emptyNode);
        //         }
        //     }

        //     this.gameNodes.push(rowNode);
        // }




        for (let i = 0; i < columCount + 2; ++i) {
            let rowNode = [];
            if (i > 0 && i < (columCount + 1)) {        //第一行和最后一行为空
                for (let j = 0; j < rowCount + 2; ++j) {
                    if (j > 0 && j < (columCount + 1)) {        //第一列和最后一列置空
                        let emptyNode = new objBean();
                        let newNode = cc.instantiate(this.bgNode);
                        nodeIndex = parseInt(Math.random() * (4 + 1), 10);
                        let gameNewNode = cc.instantiate(this.gameObjs[nodeIndex]);

                        let x = -71 * (rowCount / 2) + 71 * (j - 1) + 35.5;
                        let y = -71 * (columCount / 2) + 71 * (i - 1) + 35.5;
                        newNode.setPosition(x, y);
                        gameNewNode.setPosition(x, y);
                        emptyNode.pointIndexX = j;
                        emptyNode.pointIndexY = i;
                        this.node.addChild(newNode);
                        this.node.addChild(gameNewNode);
                        emptyNode.pointBgNode = newNode;
                        emptyNode.pointNode = gameNewNode;
                        emptyNode.pointValue = nodeIndex;
                        gameNewNode.on(cc.Node.EventType.TOUCH_START, function (event) {
                            // console.log(gameNewNode.getPosition().x)
                            if (clickNode.pointValue !== -1
                                && clickNode !== emptyNode) {
                                console.log("第二次点击")
                                let node_1_x = clickNode.pointNode.getPosition().x;
                                let node_1_y = clickNode.pointNode.getPosition().y;
                                let node_2_x = emptyNode.pointNode.getPosition().x;
                                let node_2_y = emptyNode.pointNode.getPosition().y;
                                console.log("gameNewNode.getTag() = " + emptyNode.pointValue + ",   clickNode.getTag() = " + clickNode.pointValue);
                                if (that.matchBolck(that.gameNodes, emptyNode, clickNode)) {
                                    cc.audioEngine.play(that.xiaocuMusic, false, 1);
                                    clickNode.pointValue = -1;
                                    emptyNode.pointValue = -1;
                                    clickNode.pointNode.destroy();
                                    emptyNode.pointNode.destroy();

                                    let desclickNode = cc.instantiate(that.desAnim);
                                    let desnewNode = cc.instantiate(that.desAnim);
                                    desclickNode.setPosition(node_1_x, node_1_y);
                                    desnewNode.setPosition(node_2_x, node_2_y);
                                    that.node.addChild(desclickNode);
                                    that.node.addChild(desnewNode);
                                    that.gameNodes[clickNode.pointIndexX][clickNode.pointIndexY].pointValue = -1;
                                    that.gameNodes[emptyNode.pointIndexX][emptyNode.pointIndexY].pointValue = -1;
                                    console.log("设置归零 " + clickNode.pointIndexX + ' + ' + clickNode.pointIndexY + ' + ' + emptyNode.pointIndexX + ' + ' + emptyNode.pointIndexY);
                                    console.log('clickNode ' + that.gameNodes[clickNode.pointIndexX][clickNode.pointIndexY].pointValue);
                                    console.log('emptyNode ' + that.gameNodes[emptyNode.pointIndexX][emptyNode.pointIndexY].pointValue);

                                } else {
                                    console.log('不符合条件，重新选取' + clickNode.pointValue);
                                    cc.audioEngine.play(that.selectedBgm, false, 1);
                                    if (playAnim) {
                                        playAnim.stop();
                                    }
                                    playAnim = emptyNode.pointNode.getComponent(cc.Animation);
                                    playAnim.play('click');
                                    clickNode = emptyNode;
                                }
                                // console.log(node_1_x + " + " + node_1_y + " + " + node_2_x + " + " + node_2_y)
                            } else {
                                console.log('为空，重新选取' + (clickNode === null));
                                cc.audioEngine.play(that.selectedBgm, false, 1);
                                playAnim = emptyNode.pointNode.getComponent(cc.Animation);
                                playAnim.play('click');
                                clickNode = emptyNode;
                            }
                        }, emptyNode);
                        // node.parent = scene;

                        rowNode.push(emptyNode);
                    } else {
                        let emptyNode = new objBean();
                        console.log("节点 = " + emptyNode.pointX);
                        emptyNode.pointIndexX = j;
                        emptyNode.pointIndexY = i;
                        rowNode.push(emptyNode);
                    }
                }
            } else {
                for (let j = 0; j < rowCount + 2; ++j) {
                    let emptyNode = new objBean();
                    console.log("节点 = " + emptyNode.pointX);
                    emptyNode.pointIndexX = j;
                    emptyNode.pointIndexY = i;
                    rowNode.push(emptyNode);
                }
            }

            this.gameNodes.push(rowNode);
        }




        // for (let i = 0; i < columCount; ++i) {
        //     let rowNode = [];
        //     for (let j = 0; j < rowCount; ++j) {
        //         // var scene = cc.director.getScene();
        //         let newNode = cc.instantiate(this.bgNode);
        //         nodeIndex = parseInt(Math.random() * (4 + 1), 10);
        //         let gameNewNode = cc.instantiate(this.gameObjs[nodeIndex]);
        //         gameNewNode.setTag(nodeIndex);
        //         gameNewNode.on(cc.Node.EventType.TOUCH_START, function (event) {
        //             // console.log(gameNewNode.getPosition().x)
        //             if (clickNode !== null
        //                 && clickNode !== gameNewNode) {
        //                 console.log("第二次点击")
        //                 let node_1_x = clickNode.getPosition().x;
        //                 let node_1_y = clickNode.getPosition().y;
        //                 let node_2_x = gameNewNode.getPosition().x;
        //                 let node_2_y = gameNewNode.getPosition().y;
        //                 console.log("gameNewNode.getTag() = " + gameNewNode.getTag() + ",   clickNode.getTag() = " + clickNode.getTag());
        //                 if (((node_1_x === node_2_x && ((node_1_y === node_2_y + 71) || (node_1_y === node_2_y - 71)))
        //                     || (node_1_y === node_2_y && ((node_1_x === node_2_x + 71) || (node_1_x === node_2_x - 71))))
        //                     && (gameNewNode.getTag() === clickNode.getTag())
        //                 ) {
        //                     cc.audioEngine.play(that.xiaocuMusic, false, 1);

        //                     clickNode.destroy();
        //                     gameNewNode.destroy();
        //                     clickNode = null;

        //                     let desclickNode = cc.instantiate(that.desAnim);
        //                     let desnewNode = cc.instantiate(that.desAnim);
        //                     desclickNode.setPosition(node_1_x, node_1_y);
        //                     desnewNode.setPosition(node_2_x, node_2_y);
        //                     that.node.addChild(desclickNode);
        //                     that.node.addChild(desnewNode);
        //                 } else {
        //                     cc.audioEngine.play(that.selectedBgm, false, 1);
        //                     if (playAnim) {
        //                         playAnim.stop();
        //                     }
        //                     playAnim = gameNewNode.getComponent(cc.Animation);
        //                     playAnim.play('click');
        //                     clickNode = gameNewNode;
        //                 }
        //                 // console.log(node_1_x + " + " + node_1_y + " + " + node_2_x + " + " + node_2_y)
        //             } else {
        //                 cc.audioEngine.play(that.selectedBgm, false, 1);
        //                 playAnim = gameNewNode.getComponent(cc.Animation);
        //                 playAnim.play('click');
        //                 clickNode = gameNewNode;
        //             }
        //         }, gameNewNode);
        //         // node.parent = scene;
        //         let x = -71 * (rowCount / 2) + 71 * j + 35.5;
        //         let y = -71 * (columCount / 2) + 71 * i + 35.5;
        //         newNode.setPosition(x, y);
        //         gameNewNode.setPosition(x, y);

        //         this.node.addChild(newNode);
        //         this.node.addChild(gameNewNode);
        //         rowNode.push(newNode);
        //         // alert('x = ' + newNode.getPosition().x)
        //     }
        //     this.bgNodes.push(rowNode);
        // }
    },

    start() {

    },
    // matchBolck(datas, srcPt, destPt) {
    matchBolck(datas, startPoint, endPoint) {

        // 如果不属于0折连接则返回false  
        if (startPoint.pointIndexX != endPoint.pointIndexX && startPoint.pointIndexY != endPoint.pointIndexY) {
            console.log("x和y不相等，直接false")
            return false;
        }
        if (startPoint.pointValue !== endPoint.pointValue) {
            console.log("类型不相等，直接false")
            return false;
        }
        let min, max;

        // 如果两点的x坐标相等，则在水平方向上扫描  
        if (startPoint.pointIndexX == endPoint.pointIndexX) {
            min = startPoint.pointIndexY < endPoint.pointIndexY ? startPoint.pointIndexY : endPoint.pointIndexY;
            max = startPoint.pointIndexY > endPoint.pointIndexY ? startPoint.pointIndexY : endPoint.pointIndexY;
            for (min++; min < max; min++) {
                if (!(datas[startPoint.pointIndexX][min].isEmpty()))
                    console.log("竖向有非空，直接false")
                return false;
            }
        }
        // 如果两点的y坐标相等，则在竖直方向上扫描  
        else {
            min = startPoint.pointIndexX < endPoint.pointIndexX ? startPoint.pointIndexX : endPoint.pointIndexX;
            max = startPoint.pointIndexX > endPoint.pointIndexX ? startPoint.pointIndexX : endPoint.pointIndexX;
            for (min++; min < max; min++) {
                if (!(datas[min][startPoint.pointIndexY].isEmpty()))
                    console.log("横向有非空，直接false")
                return false;
            }
        }
        return true;
    }
    // update (dt) {},
});
