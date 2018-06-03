var UserDataBean = cc.Class({
    properties: {
        userId: '',     //用户ID
        userName: '',       //用户名称
        userCover: '',      //用户头像
        gameData: null      //用户游戏数据
    }
});

module.exports = UserDataBean;