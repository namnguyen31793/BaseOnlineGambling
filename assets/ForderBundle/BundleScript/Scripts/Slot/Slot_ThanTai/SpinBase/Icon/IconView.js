// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        icons: [cc.SpriteFrame],
        icons_blur: [cc.SpriteFrame],
        fsIcons: [cc.SpriteFrame],
        skeletonDataIcons: [sp.SkeletonData],
        skeletonDataIconsFs: [sp.SkeletonData],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
       this.ItemView_Setup();
    },
    ItemView_Setup()
    {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setIconView(this);
    },

    start () {

    },

    // update (dt) {},
});
