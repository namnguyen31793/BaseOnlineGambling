cc.Class({
    extends: cc.Component,

    properties: {
        zIndex : 0,
    },

    start () {
        this.node.zIndex = this.zIndex;
    },

});
