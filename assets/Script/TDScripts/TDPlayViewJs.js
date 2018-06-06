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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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
        this.gameNodes = [];
        this.viewWidth = this.node.width;
        this.viewHeight = this.node.height;
        this.gameNodeWidth = 0;
        this.gameNodeHeight = 0;
        if (this.node1Pool.size() > 0) {
            let testNode = this.node1Pool.get();
            console.log("对象池选对象" + testNode);
            this.gameNodeWidth = testNode.width;
            this.gameNodeHeight = testNode.height;
        } else {
            console.log("直接创建对象");
            let testNode = cc.instantiate(this.nodePrefabs[0]);
            this.gameNodeWidth = testNode.width;
            this.gameNodeHeight = testNode.height;
        }
        console.log("viewWidth:" + this.viewWidth + ', viewHeight:' + this.viewHeight);
        console.log("gameNodeWidth:" + this.gameNodeWidth + ', gameNodeHeight:' + this.gameNodeHeight);
        let radomPointType = 0;
        let positIonX = this.viewWidth / 2 - this.rowCount / 2 * this.gameNodeWidth;
        let positiony = this.viewHeight / 2 - this.columCount / 2 * this.gameNodeHeight;
        for (let i = 0; i < this.rowCount; ++i) {
            let rowNodes = [];
            for (let j = 0; j < this.columCount; ++j) {
                // radomPointType = Math.random() * 4;
                // switch (radomPointType) {
                //     case 0:
                //         if (this.node1Pool.size() > 0) {
                //             rowNodes.put(this.node1Pool.get());
                //         } else {
                //             rowNodes.put(cc.instantiate(this.nodePrefabs[0]));
                //         }
                //         break;
                //     case 1:
                //         if (this.node2Pool.size() > 0) {
                //             rowNodes.put(this.node2Pool.get());
                //         } else {
                //             rowNodes.put(cc.instantiate(this.nodePrefabs[1]));
                //         }
                //         break;
                //     case 2:
                //         if (this.node3Pool.size() > 0) {
                //             rowNodes.put(this.node3Pool.get());
                //         } else {
                //             rowNodes.put(cc.instantiate(this.nodePrefabs[2]));
                //         }
                //         break;
                //     case 3:
                //         if (this.node4Pool.size() > 0) {
                //             rowNodes.put(this.node4Pool.get());
                //         } else {
                //             rowNodes.put(cc.instantiate(this.nodePrefabs[3]));
                //         }
                //         break;
                // }
                // nodeType = -1;      //节点类型
                // nodeIndex = -1;     
                // nodeIndexX = -1;    //节点的1唯索引
                // nodeIndexY = -1;        //节点的2唯索引
                // nodeGameNode = null;        //cc.Node       可消除的点
                // nodePositionX = 0;      //节点相对父节点x坐标
                // nodePositionY = 0;      //节点相对父节点y坐标
                let nodeBean = new TDNodeBean();
                let x = positIonX + j * this.gameNodeWidth;
                let y = positiony + i * this.gameNodeHeight;
                nodeBean.nodeIndexX = j;
                nodeBean.nodeIndexY = i;
                nodeBean.nodePositionX = x;
                nodeBean.nodePositionY = y;
                radomPointType = parseInt(Math.random() * 4);
                let gamePointNode = null;
                console.log("随机节点对象 = " = radomPointType);
                //
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
                }
                gamePointNode.setPosition(x, y);
                this.gameNodeContainer.addChild(gamePointNode);
            }
        }
    },

    start() {

    },

    // update (dt) {},
});
