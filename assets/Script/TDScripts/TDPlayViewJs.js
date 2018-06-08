var GlobleData = require("GlobleData")
var TDNodeBean = require('TDNodeBean')
var GlobleVar = require("GlobleVar")
var ObjUtil = require("ObjUtil")
cc.Class({
    extends: cc.Component,

    properties: {
        nodePrefabs: {
            default: [],
            type: [cc.Prefab]
        },
        gameNodes: {
            default: [],
            type: [TDNodeBean]
        },
        gameNodeContainer: {
            default: null,
            type: cc.Node
        },
        rowCount: 7,
        columCount: 7,
        disableNode: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.selectedNodes = [];    //整备注销的节点
        this.lastIndexX = -1;      //最后一个选中的点的x索引
        this.lastIndexY = -1;      //最后一个选中的点的y索引
        this.lastPointX = -1;      //最后一个选中的点的x坐标
        this.lastPointY = -1;      //最后一个选中的点的y坐标
        this.lastType = -1;         //最后一个选中的点的类型
        this.lineGraphics = this.gameNodeContainer.getComponent(cc.Graphics);       //图画画板
        this.canTouch = true;       //是否可以触摸交互，在连成矩形时由于触摸可能没抬起而导致的莫名其妙的线
        this.creatorNodePool();
        this.creatorNodes();
    },
    /**
     * 创建节点对象池
     */
    creatorNodePool() {
        this.node1Pool = new cc.NodePool();
        this.node2Pool = new cc.NodePool();
        this.node3Pool = new cc.NodePool();
        this.node4Pool = new cc.NodePool();
        for (let i = 0; i < 20; ++i) {
            this.node1Pool.put(cc.instantiate(this.nodePrefabs[0]));
            this.node2Pool.put(cc.instantiate(this.nodePrefabs[1]));
            this.node3Pool.put(cc.instantiate(this.nodePrefabs[2]));
            this.node4Pool.put(cc.instantiate(this.nodePrefabs[3]));
        }
    },

    creatorNodes() {
        let that = this;
        this.gameNodes = [];
        this.viewWidth = this.node.width;
        this.viewHeight = this.node.height;
        this.gameNodeWidth = 0;
        this.gameNodeHeight = 0;
        let testNode = null;
        if (this.node1Pool.size() > 0) {
            testNode = this.node1Pool.get();
        } else {
            testNode = cc.instantiate(this.nodePrefabs[0]);
        }
        this.gameNodeWidth = testNode.width * 1.8;
        this.gameNodeHeight = testNode.height * 1.8;
        console.log("viewWidth:" + this.viewWidth + ', viewHeight:' + this.viewHeight);
        console.log("gameNodeWidth:" + this.gameNodeWidth + ', gameNodeHeight:' + this.gameNodeHeight);
        let radomPointType = 0;
        let positIonX = this.viewWidth / 2 - this.rowCount / 2.0 * this.gameNodeWidth + this.gameNodeWidth / 2;
        let positiony = this.viewHeight / 2 - this.columCount / 2.0 * this.gameNodeHeight + this.gameNodeHeight / 2;
        for (let i = 0; i < this.columCount; ++i) {
            let rowNodes = [];
            for (let j = 0; j < this.rowCount; ++j) {
                let nodeBean = new TDNodeBean();
                let x = positIonX + j * this.gameNodeWidth;
                let y = positiony + i * this.gameNodeHeight;
                nodeBean.nodeIndexX = j;
                nodeBean.nodeIndexY = i;
                nodeBean.nodePositionX = x;
                nodeBean.nodePositionY = y;
                radomPointType = parseInt(Math.random() * (this.nodePrefabs.length + 1));
                if (radomPointType === this.nodePrefabs.length) {
                    radomPointType = -2;
                }
                let gamePointNode;
                nodeBean.nodeType = radomPointType;
                gamePointNode = this.getRadomPoint(radomPointType);
                gamePointNode.setPosition(x, y);
                this.gameNodeContainer.addChild(gamePointNode);
                nodeBean.nodeGameNode = gamePointNode;
                // gamePointNode.on(cc.Node.EventType.TOUCH_START, function (event) {
                //     console.log("nodeType = " + nodeBean.nodeType + ', nodeIndexX = ' + nodeBean.nodeIndexX + ', nodeIndexY = ' + nodeBean.nodeIndexY + ', nodePositionX = ' + nodeBean.nodePositionX + ', nodePositionY = ' + nodeBean.nodePositionY);
                //     let playAnim = nodeBean.nodeGameNode.getComponent(cc.Animation);
                //     playAnim.play('clicked');
                //     // that.reputNode(nodeBean);
                // }, nodeBean)
                rowNodes.push(nodeBean);
            }
            this.gameNodes.push(rowNodes);
        }
    },
    /**
     * 
     * @param {*} type 根据类型生成一个节点
     */
    getRadomPoint(radomPointType) {
        let gamePointNode = null;
        switch (radomPointType) {
            case 0:
                if (this.node1Pool.size() > 0) {
                    gamePointNode = this.node1Pool.get();
                } else {
                    gamePointNode = cc.instantiate(this.nodePrefabs[0]);
                }
                break;
            case 1:
                if (this.node2Pool.size() > 0) {
                    gamePointNode = this.node2Pool.get();
                } else {
                    gamePointNode = cc.instantiate(this.nodePrefabs[1]);
                }
                break;
            case 2:
                if (this.node3Pool.size() > 0) {
                    gamePointNode = this.node3Pool.get();
                } else {
                    gamePointNode = cc.instantiate(this.nodePrefabs[2]);
                }
                break;
            case 3:
                if (this.node4Pool.size() > 0) {
                    gamePointNode = this.node4Pool.get();
                } else {
                    gamePointNode = cc.instantiate(this.nodePrefabs[3]);
                }
                break;
            case -2:
                gamePointNode = cc.instantiate(this.disableNode);
                break;
        }
        return gamePointNode;
    },
    /**
     * 回收节点，把节点放入对象池
     */
    reputNode(nodeBean) {
        if (!ObjUtil.isEmpty(nodeBean) && !ObjUtil.isEmpty(nodeBean.nodeGameNode)) {
            let radomPointType = nodeBean.nodeType;
            switch (radomPointType) {
                case 0:
                    this.node1Pool.put(nodeBean.nodeGameNode);
                    break;
                case 1:
                    this.node2Pool.put(nodeBean.nodeGameNode);
                    break;
                case 2:
                    this.node3Pool.put(nodeBean.nodeGameNode);
                    break;
                case 3:
                    this.node4Pool.put(nodeBean.nodeGameNode);
                    break;
            }
            nodeBean.nodeType = -1;
            nodeBean.isSelected = false;
        }
    },

    moveNode() {
        // return;
        console.log("移动处理节点, size = " + this.gameNodes.length);
        for (let i = 0; i < this.rowCount; ++i) {
            for (let j = 0; j < this.columCount; ++j) {
                if (this.gameNodes[j][i].nodeType >= 0) {
                    for (let k = 0; k < j; ++k) {
                        if (this.gameNodes[k][i].nodeType == -1) {
                            // console.log('转换 i = ' + i + ' + j = ' + j + ' k = ' + k);
                            this.gameNodes[k][i].nodeType = this.gameNodes[j][i].nodeType;
                            this.gameNodes[k][i].nodeGameNode = this.gameNodes[j][i].nodeGameNode;
                            // console.log('转换前 k = ' + k + ' + i = ' + i + ' = ' + ObjUtil.isEmpty(this.gameNodes[k][i].nodeGameNode) + ', type = ' + this.gameNodes[k][i].nodeType);
                            this.gameNodes[j][i].nodeType = -1;
                            this.gameNodes[j][i].nodeGameNode = null;
                            let action = cc.moveTo(0.2, this.gameNodes[k][i].nodePositionX, this.gameNodes[k][i].nodePositionY);
                            action.easing(cc.easeBounceOut());
                            this.gameNodes[k][i].nodeGameNode.runAction(action);
                            // console.log('转换后 k = ' + k + ' + i = ' + i + ' = ' + ObjUtil.isEmpty(this.gameNodes[k][i].nodeGameNode) + ', type = ' + this.gameNodes[k][i].nodeType);
                            break;
                        }
                    }
                }
                // var action = cc.moveTo(0.6, 100, 100);
                // // 执行动作
                // this.gameNodes[i][i].nodeGameNode.runAction(action);
            }
        }
        this.lineGraphics.clear();
        this.creatNewNode();
        // setTimeout(() => {
        //     console.log("新位置 = " + this.gameNodes[0][0].nodeGameNode.getPosition().x + ' + ' + this.gameNodes[0][0].nodeGameNode.getPosition().y);
        // }, 1000)
    },

    creatNewNode() {
        console.log("移动处理节点, size = " + this.gameNodes.length);
        for (let i = 0; i < this.rowCount; ++i) {
            for (let j = 0; j < this.columCount; ++j) {
                if (this.gameNodes[j][i].nodeType == -1) {
                    let radomPointType = parseInt(Math.random() * 4);
                    let gamePointNode = this.getRadomPoint(radomPointType);
                    let x = this.gameNodes[j][i].nodePositionX;
                    let y = this.gameNodes[j][i].nodePositionY;
                    gamePointNode.setPosition(x, y + this.gameNodeWidth * 1.8 * this.columCount);
                    this.gameNodes[j][i].isSelected = false;
                    this.gameNodes[j][i].nodeType = radomPointType;
                    this.gameNodeContainer.addChild(gamePointNode);
                    this.gameNodes[j][i].nodeGameNode = gamePointNode;
                    let action = cc.moveTo(0.4, x, y);
                    action.easing(cc.easeBounceOut());
                    this.gameNodes[j][i].nodeGameNode.runAction(action);
                }
            }
        }
    },

    getLineColor() {
        switch (this.lastType) {
            case 0:
                return cc.hexToColor('#e84d60');
                break;
            case 1:
                return cc.hexToColor('#77c298');
                break;
            case 2:
                return cc.hexToColor('#fecd6c');
                break;
            case 3:
                return cc.hexToColor('#a4547d');
                break;
        }
        return cc.hexToColor('#00000000');
    },

    drawPointLine(touchX, touchY) {
        this.lineGraphics.clear();
        this.lineGraphics.moveTo(touchX, touchY);
        if (!ObjUtil.isEmpty(this.selectedNodes)) {
            for (let i = this.selectedNodes.length - 1; i >= 0; --i) {
                this.lineGraphics.lineTo(this.selectedNodes[i].nodePositionX, this.selectedNodes[i].nodePositionY);
            }
            this.lineGraphics.lineWidth = 10;
            // this.lineGraphics.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.lineGraphics.strokeColor = this.getLineColor();
            this.lineGraphics.stroke();
        }
    },
    /**
     * 检测是否形成矩形
     */
    checkIsCicle(node) {
        if (!ObjUtil.isEmpty(this.selectedNodes) && !ObjUtil.isEmpty(node)) {
            for (let i = 0; i < this.selectedNodes.length; ++i) {
                if (node == this.selectedNodes[i]) {
                    if (this.selectedNodes.length - 1 - i > 2) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
        return false;
    },

    nodeTouched(event) {
        let touchX = event.getLocation().x;
        let touchY = event.getLocation().y;
        // var v1 = cc.v2(20, 20);
        // var v2 = cc.v2(5, 5);
        // cc.pDistance(v1, v2); // 21.213203435596427;
        this.drawPointLine(touchX, touchY);
        for (let i = 0; i < this.columCount; ++i) {
            for (let j = 0; j < this.rowCount; ++j) {
                if (this.gameNodes[i][j].nodeType >= 0 && this.gameNodes[i][j].isSelected == false) {
                    // if (this.gameNodes[i][j].nodeType >= 0) {
                    if (cc.pDistance(cc.v2(touchX, touchY), cc.v2(this.gameNodes[i][j].nodePositionX, this.gameNodes[i][j].nodePositionY)) < this.gameNodeWidth / 1.8) {
                        if (this.lastType >= 0) {
                            if (this.gameNodes[i][j].nodeType == this.lastType) {
                                console.log("节点类型 this.gameNodes[i][j].nodeType = " + this.gameNodes[i][j].nodeType + ', this.lastType = ' + this.lastType);
                                if ((Math.abs(this.gameNodes[i][j].nodeIndexX - this.lastIndexX) === 1
                                    && this.gameNodes[i][j].nodeIndexY == this.lastIndexY)
                                    || (Math.abs(this.gameNodes[i][j].nodeIndexY - this.lastIndexY) === 1
                                        && this.gameNodes[i][j].nodeIndexX == this.lastIndexX)
                                ) {
                                    let playAnim = this.gameNodes[i][j].nodeGameNode.getComponent(cc.Animation);
                                    playAnim.play('clicked');
                                    this.gameNodes[i][j].isSelected = true;
                                    this.selectedNodes.push(this.gameNodes[i][j]);
                                    this.lastIndexX = j;
                                    this.lastIndexY = i;
                                    this.lastPointX = this.gameNodes[i][j].nodePositionX;
                                    this.lastPointY = this.gameNodes[i][j].nodePositionY;
                                    this.lastType = this.gameNodes[i][j].nodeType;
                                } else {
                                    console.log("不想领， this.lastIndexX = " + this.lastIndexX + ", this.lastIndexY = " + this.lastIndexY + ", this.gameNodes[i][j].nodeIndexX = " + this.gameNodes[i][j].nodeIndexX + ', this.gameNodes[i][j].nodeIndexY = ' + this.gameNodes[i][j].nodeIndexY);
                                }
                            } else {
                                console.log("节点类型不一样 this.gameNodes[i][j].nodeType = " + this.gameNodes[i][j].nodeType + ', this.lastType = ' + this.lastType);
                            }
                        } else {
                            console.log("节点类型this.lastType = " + this.lastType);
                            let playAnim = this.gameNodes[i][j].nodeGameNode.getComponent(cc.Animation);
                            playAnim.play('clicked');
                            this.gameNodes[i][j].isSelected = true;
                            this.selectedNodes.push(this.gameNodes[i][j]);
                            this.lastIndexX = j;
                            this.lastIndexY = i;
                            this.lastPointX = this.gameNodes[i][j].nodePositionX;
                            this.lastPointY = this.gameNodes[i][j].nodePositionY;
                            this.lastType = this.gameNodes[i][j].nodeType;
                        }
                    }
                } else if (this.gameNodes[i][j].nodeType >= 0 && this.gameNodes[i][j].isSelected == true) {
                    if (cc.pDistance(cc.v2(touchX, touchY), cc.v2(this.gameNodes[i][j].nodePositionX, this.gameNodes[i][j].nodePositionY)) < this.gameNodeWidth / 1.8) {
                        if (this.lastType >= 0) {
                            if (this.gameNodes[i][j].nodeType == this.lastType) {
                                console.log("节点类型 this.gameNodes[i][j].nodeType = " + this.gameNodes[i][j].nodeType + ', this.lastType = ' + this.lastType);
                                if ((Math.abs(this.gameNodes[i][j].nodeIndexX - this.lastIndexX) === 1
                                    && this.gameNodes[i][j].nodeIndexY == this.lastIndexY)
                                    || (Math.abs(this.gameNodes[i][j].nodeIndexY - this.lastIndexY) === 1
                                        && this.gameNodes[i][j].nodeIndexX == this.lastIndexX)
                                ) {
                                    if (this.checkIsCicle(this.gameNodes[i][j])) {
                                        this.canTouch = false;
                                        this.touchEnd();
                                    }
                                    // let playAnim = this.gameNodes[i][j].nodeGameNode.getComponent(cc.Animation);
                                    // playAnim.play('clicked');
                                    // this.gameNodes[i][j].isSelected = true;
                                    // this.selectedNodes.push(this.gameNodes[i][j]);
                                    // this.lastIndexX = j;
                                    // this.lastIndexY = i;
                                    // this.lastPointX = this.gameNodes[i][j].nodePositionX;
                                    // this.lastPointY = this.gameNodes[i][j].nodePositionY;
                                    // this.lastType = this.gameNodes[i][j].nodeType;
                                }
                            }
                        }
                    }
                }
            }
        }
    },


    /**
     * 重新随机地图
     */
    reCreatMap() {
        if (!ObjUtil.isEmpty(this.gameNodes)) {
            for (let i = 0; i < this.columCount; ++i) {
                for (let j = 0; j < this.rowCount; ++j) {
                    let radomX = parseInt(Math.random() * this.rowCount);
                    let radomY = parseInt(Math.random() * this.columCount);
                    if (this.gameNodes[i][j].nodeType >= 0 && this.gameNodes[radomX][radomY].nodeType >= 0) {
                        let tempNode = this.gameNodes[i][j].nodeGameNode;
                        let tempType = this.gameNodes[i][j].nodeType;
                        this.gameNodes[i][j].nodeGameNode = this.gameNodes[radomX][radomY].nodeGameNode;
                        this.gameNodes[i][j].nodeType = this.gameNodes[radomX][radomY].nodeType;
                        this.gameNodes[radomX][radomY].nodeGameNode = tempNode;
                        this.gameNodes[radomX][radomY].nodeType = tempType;
                    }
                }
            }
            for (let i = 0; i < this.columCount; ++i) {
                for (let j = 0; j < this.rowCount; ++j) {
                    if (this.gameNodes[i][j].nodeType >= 0) {
                        let action = cc.moveTo(0.4, this.gameNodes[i][j].nodePositionX, this.gameNodes[i][j].nodePositionY);
                        this.gameNodes[i][j].nodeGameNode.runAction(action);
                    }
                }
            }
        }

    },

    touchEnd() {
        if (!ObjUtil.isEmpty(this.selectedNodes) && this.selectedNodes.length >= 2) {
            for (let i = 0; i < this.selectedNodes.length; ++i) {
                this.reputNode(this.selectedNodes[i]);
            }
        } else if (!ObjUtil.isEmpty(this.selectedNodes) && this.selectedNodes.length > 0) {
            for (let i = 0; i < this.selectedNodes.length; ++i) {
                this.selectedNodes[i].isSelected = false;
            }
        }
        this.selectedNodes = [];
        this.lastindexX = -1;
        this.lastIndexY = -1;
        this.lastPointX = -1;
        this.lastPointY = -1;
        this.lastType = -1;
        this.moveNode();
    },

    onTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log(cc.Event.EventTouch.getLocationX() + ' + 滑动事件滑动了 + ' + ObjUtil.isEmpty(event));
            // var nodeLocation = this.node.convertTouchToNodeSpace(event);
            // console.log('touch nodeLocation:' + JSON.stringify(nodeLocation));
            console.log("滑动开始");
            this.nodeTouched(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // console.log(cc.Event.EventTouch.getLocationX() + ' + 滑动事件滑动了 + ' + ObjUtil.isEmpty(event));
            // var nodeLocation = this.node.convertTouchToNodeSpace(event);
            // console.log('touch nodeLocation:' + JSON.stringify(nodeLocation));
            if (this.canTouch === false) {
                return;
            }
            this.nodeTouched(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log(cc.Event.EventTouch.getLocationX() + ' + 滑动事件滑动了 + ' + ObjUtil.isEmpty(event));
            // var nodeLocation = this.node.convertTouchToNodeSpace(event);
            // console.log('touch nodeLocation:' + JSON.stringify(nodeLocation));
            this.canTouch = true;
            this.touchEnd();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.canTouch = true;
            this.touchEnd();
        }, this);
    },
    start() {
        console.log('gameStart游戏开始了');
        this.onTouchEvent();
    },

    // update (dt) {},
});
