var ObjUtil = cc.Class({
    statics: {
        isEmpty(obj) {
            if (obj === null) {
                return true;
            }
            if (obj === undefined) {
                return true;
            }
            if (obj instanceof String) {
                if (obj.length <= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            if (obj instanceof Array) {
                if (obj.length <= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            if (obj instanceof Map) {
                if (obj.size <= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            if (obj instanceof Set) {
                if (obj.size <= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
    }
});
module.exports = ObjUtil;