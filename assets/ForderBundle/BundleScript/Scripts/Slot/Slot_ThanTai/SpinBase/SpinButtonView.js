// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btnBack: cc.Button,
        btnSelectBetLines: cc.Button,
        btnX2: cc.Button,
        btnSpin: cc.Button,

        spriteSelectBetLines: cc.Sprite,
        spriteSpin: cc.Sprite,
        spriteAutoSpin: cc.Sprite,
        spriteFastSpin: cc.Sprite,
        spriteX2: cc.Sprite,

        sfSpins: [cc.SpriteFrame],
        sfAutoSpins: [cc.SpriteFrame],//0 = normal
        sfFastSpins: [cc.SpriteFrame],
        sfX2s: [cc.SpriteFrame],
        sfSelectBetLines: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setButtonView(this);
        this.isAutoSpin = false;
    },

    activeButtonSelectBetLines: function (enable) {
        this.btnSelectBetLines.interactable = enable;
    },
    activeButtonSpin: function (enable) {
        //this.btnBack.interactable = enable;
        if (this.btnSelectBetLines !== undefined && this.btnSelectBetLines !== null) {
            this.btnSelectBetLines.interactable = enable;
            if (!enable && this.btnX2) {
                this.btnX2.interactable = enable;
                this.spriteX2.spriteFrame = this.sfX2s[1];
            }  
        }
        this.btnSpin.interactable = enable;
    },
    activeButtonX2: function (enable) {
        if (this.btnX2) {
            if (enable) {
                if (!this.isAutoSpin) {
                    this.btnX2.interactable = enable;
                    this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
                }
            } else {
                this.btnX2.interactable = enable;
                this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
            }
        }
    },

    activeButtonAutoSpin: function (enable) {
        this.isAutoSpin = enable;
        if(this.spriteAutoSpin)
            this.spriteAutoSpin.spriteFrame = enable ? this.sfAutoSpins[1] : this.sfAutoSpins[0];
  
    },

    activeButtonFastSpin: function (enable) {
        this.spriteFastSpin.spriteFrame = enable ? this.sfFastSpins[1] : this.sfFastSpins[0];
    },



    start () {

    },

    // update (dt) {},
});
