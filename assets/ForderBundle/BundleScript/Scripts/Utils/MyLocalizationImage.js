// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        img_Vi: cc.SpriteFrame,
        img_En: cc.SpriteFrame,
    },

    start () {
        let spr = this.node.getComponent(cc.Sprite);
        if(Global.language == "vi") {
            spr.spriteFrame = this.img_Vi;
        } else {
            spr.spriteFrame = this.img_En;
        }
    },
});
