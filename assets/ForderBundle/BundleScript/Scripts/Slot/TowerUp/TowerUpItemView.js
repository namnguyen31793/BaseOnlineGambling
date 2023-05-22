
cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.cacheParent = null;
    },

    properties: {
        objWinNormal : cc.Node,
        objWinFree: cc.Node,
    },

    ShowEffectWin() {
        this.effectWin.active = true;
        //this.effectWin.getComponent(cc.Animation).play("EffectWin");
    },

    HideEffectWin() {
        this.effectWin.active = false;
    },

    ShowEffectWinFree(){
        this.objWinNormal.active = false;
        this.objWinFree.active = true;
    },

    ShowEffectWinNormal(){
        this.objWinNormal.active = true;
        this.objWinFree.active = false;
    },

    OnChangeParent() {
        // this.cacheParent = this.skeleton.node.parent.parent;
        // Global.changeParent(this.skeleton.node.parent, Global.SlotNetWork.slotView.tournamentView.node);
    },

    OffChangeParent() {
        // if(this.cacheParent != null)
        //     Global.changeParent(this.skeleton.node.parent, this.cacheParent);
    },
});
