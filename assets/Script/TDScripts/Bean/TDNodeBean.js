export default class TDNodeBean {
    nodeType = -1;      //节点类型  >=0以上是节点颜色类型， -1：空， -2：锁定节点，不可放置节点
    nodeIndex = -1;
    nodeIndexX = -1;    //节点的1唯索引
    nodeIndexY = -1;        //节点的2唯索引
    nodeGameNode = null;        //cc.Node,可消除的点
    nodePositionX = 0;      //节点相对父节点x坐标
    nodePositionY = 0;      //节点相对父节点y坐标
    isSelected = false;     //是否被选中

}
