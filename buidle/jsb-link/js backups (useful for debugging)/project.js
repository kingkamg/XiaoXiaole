require = function c(d, p, a) {
function l(n, e) {
if (!p[n]) {
if (!d[n]) {
var o = "function" == typeof require && require;
if (!e && o) return o(n, !0);
if (s) return s(n, !0);
var t = new Error("Cannot find module '" + n + "'");
throw t.code = "MODULE_NOT_FOUND", t;
}
var i = p[n] = {
exports: {}
};
d[n][0].call(i.exports, function(e) {
return l(d[n][1][e] || e);
}, i, i.exports, c, d, p, a);
}
return p[n].exports;
}
for (var s = "function" == typeof require && require, e = 0; e < a.length; e++) l(a[e]);
return l;
}({
BeginGame: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "dc8c9FDiRNIhYJ4w4ie3QI0", "BeginGame");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.node.on("click", function(e) {
cc.director.loadScene("playscene");
});
},
start: function() {}
});
cc._RF.pop();
}, {} ],
DestoryAnimEnd: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "23dca8cY6RGC6Ld9+C7o+0J", "DestoryAnimEnd");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
animEnd: function() {
this.node.destroy();
}
});
cc._RF.pop();
}, {} ],
GameCotrol: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "7d3f2NqTW5MBJdEDN2LVsNY", "GameCotrol");
var f = e("NodeBean");
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
bgNode: {
default: null,
type: cc.Prefab
},
bgNodes: [],
gameObjs: {
default: [],
type: [ cc.Prefab ]
},
gameNodes: {
default: [],
type: f
}
},
onLoad: function() {
var i = this, s = this, c = 0, r = new f(), u = null;
cc.audioEngine.play(s.bgm, !0, 1);
for (var d = 0; d < 11; ++d) {
var p = [];
if (0 < d && d < 10) for (var a = 0; a < 11; ++a) if (0 < a && a < 10) (function() {
var l = new f(), e = cc.instantiate(i.bgNode);
c = parseInt(5 * Math.random(), 10);
var n = cc.instantiate(i.gameObjs[c]);
l.pointBgNode = e;
l.pointNode = n;
l.pointValue = c;
var o = 71 * (a - 1) - 319.5 + 35.5, t = 71 * (d - 1) - 319.5 + 35.5;
e.setPosition(o, t);
n.setPosition(o, t);
l.pointIndexX = a;
l.pointIndexY = d;
i.node.addChild(e);
i.node.addChild(n);
n.on(cc.Node.EventType.TOUCH_START, function(e) {
if (-1 !== r.pointValue && r !== l) {
console.log("第二次点击");
var n = r.pointNode.getPosition().x, o = r.pointNode.getPosition().y, t = l.pointNode.getPosition().x, i = l.pointNode.getPosition().y;
console.log("gameNewNode.getTag() = " + l.pointValue + ",   clickNode.getTag() = " + r.pointValue);
if (s.matchBolck(s.gameNodes, l, r)) {
cc.audioEngine.play(s.xiaocuMusic, !1, 1);
r.pointValue = -1;
l.pointValue = -1;
r.pointNode.destroy();
l.pointNode.destroy();
var c = cc.instantiate(s.desAnim), d = cc.instantiate(s.desAnim);
c.setPosition(n, o);
d.setPosition(t, i);
s.node.addChild(c);
s.node.addChild(d);
s.gameNodes[r.pointIndexX][r.pointIndexY].pointValue = -1;
s.gameNodes[l.pointIndexX][l.pointIndexY].pointValue = -1;
console.log("设置归零 " + r.pointIndexX + " + " + r.pointIndexY + " + " + l.pointIndexX + " + " + l.pointIndexY);
for (var p = 0; p < 9; ++p) for (var a = 0; a < 9; ++a) console.log("index " + p + "--" + a + " = " + s.gameNodes[p][a].pointValue);
} else {
cc.audioEngine.play(s.selectedBgm, !1, 1);
u && u.stop();
(u = l.pointNode.getComponent(cc.Animation)).play("click");
r = l;
}
} else {
cc.audioEngine.play(s.selectedBgm, !1, 1);
(u = l.pointNode.getComponent(cc.Animation)).play("click");
r = l;
}
}, l);
p.push(l);
})(); else {
var e = new f();
console.log("节点 = " + e.pointX);
e.pointIndexX = a;
e.pointIndexY = d;
p.push(e);
} else for (var n = 0; n < 11; ++n) {
var o = new f();
console.log("节点 = " + o.pointX);
o.pointIndexX = n;
o.pointIndexY = d;
p.push(o);
}
this.gameNodes.push(p);
}
},
start: function() {},
matchBolck: function(e, n, o) {
if (n.pointIndexX != o.pointIndexX && n.pointIndexY != o.pointIndexY) {
console.log("x和y不相等，直接false");
return !1;
}
if (n.pointValue !== o.pointValue) {
console.log("类型不相等，直接false");
return !1;
}
var t = void 0, i = void 0;
if (n.pointIndexX == o.pointIndexX) {
t = n.pointIndexY < o.pointIndexY ? n.pointIndexY : o.pointIndexY;
i = n.pointIndexY > o.pointIndexY ? n.pointIndexY : o.pointIndexY;
for (t++; t < i; t++) {
e[n.pointIndexX][t].isEmpty() || console.log("竖向有非空，直接false");
return !1;
}
} else {
t = n.pointIndexX < o.pointIndexX ? n.pointIndexX : o.pointIndexX;
i = n.pointIndexX > o.pointIndexX ? n.pointIndexX : o.pointIndexX;
for (t++; t < i; t++) {
e[t][n.pointIndexY].isEmpty() || console.log("横向有非空，直接false");
return !1;
}
}
return !0;
}
});
cc._RF.pop();
}, {
NodeBean: "NodeBean"
} ],
HelloWorld: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
cc.Class({
extends: cc.Component,
properties: {
label: {
default: null,
type: cc.Label
},
text: "Hello, World!"
},
onLoad: function() {
this.label.string = this.text;
},
update: function(e) {}
});
cc._RF.pop();
}, {} ],
NodeBean: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "70e4dhJOfhAzY7c1uVwPjp5", "NodeBean");
cc.Class({
extends: cc.Component,
properties: {
pointValue: -1,
pointX: 0,
pointY: 0,
pointBgNode: {
default: null,
type: cc.Node
},
pointNode: {
default: null,
type: cc.Node
},
pointIndexX: 0,
pointIndexY: 0
},
isEmpty: function() {
return -1 === this.pointValue;
},
start: function() {}
});
cc._RF.pop();
}, {} ],
NodePlayAnim: [ function(e, n, o) {
"use strict";
cc._RF.push(n, "3506cwncXdOv5bjx5SM+2Xq", "NodePlayAnim");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ]
}, {}, [ "BeginGame", "DestoryAnimEnd", "GameCotrol", "HelloWorld", "NodePlayAnim", "NodeBean" ]);