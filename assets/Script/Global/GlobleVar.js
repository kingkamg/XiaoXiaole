

export default class {
    static SOCKET_EVENT_OPEN = 'SOCKET_EVENT_OPEN'; //socket连接建立成功事件
    static SOCKET_EVENT_CLOSE = 'SOCKET_EVENT_CLOSE'; //socket连接关闭事件
    static SOCKET_EVENT_RECEIVE = 'SOCKET_EVENT_RECEIVE'; //socket接收到消息事件
    static SOCKET_EVENT_ERROR = 'SOCKET_EVENT_ERROR'; //socket连接错误事件
    static SOCKET_EVENT_OUTLINE = 'SOCKET_EVENT_OUTLINE'; //socket连接掉线
    static SOCKET_EVENT_RELINK = 'SOCKET_EVENT_RELINK'; //socket重新连接
    static SOCKET_EVENT_BEGINGAME = 'SOCKET_EVENT_BEGINGAME'; //开始游戏事件
}
