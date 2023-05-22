cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GuideMiniSlot = this;
    },

    start() { },

    onClickClose() {
        Global.GuideMiniSlot = null;
        this.node.destroy();
    },

    onDestroy() {
        Global.GuideMiniSlot = null;
    }

    // update (dt) {},
});
