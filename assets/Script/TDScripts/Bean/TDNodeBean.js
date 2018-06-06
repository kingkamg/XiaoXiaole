export default class TDNodeBean {
    nodeType = -1;      //节点类型
    nodeIndex = -1;     
    nodeIndexX = -1;    //节点的1唯索引
    nodeIndexY = -1;        //节点的2唯索引
    nodeGameNode = null;        //cc.Node       可消除的点
    nodePositionX = 0;      //节点相对父节点x坐标
    nodePositionY = 0;      //节点相对父节点y坐标
}
