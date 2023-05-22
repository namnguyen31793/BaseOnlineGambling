cc.Class({
    extends: require("ItemSlotView"),

    properties: {
        text : cc.Sprite,
    },

    ctor() {
        this.isSpecial = false;
        this.item = null;
        this.idItem = 0;
    },

    AnimHideText() {
        if(!this.isShowPrize && this.idItem != 1) {
            if(!this.isSpecial) {
                this.text.node.scaleX = 1;
                this.text.node.runAction(cc.scaleTo(0.245, 0));
                if(this.isShowSpine)
                    this.skeleton.setAnimation(0, 'spin', false);
            }
        }
    },

    SetValueBonus() {
        if(!this.isShowPrize) {
            this.isShowPrize = true;
            if(!this.isSpecial && this.idItem != 1) {
                this.prize.string = Global.Helper.formatNumber(this.prizeValue);
                this.prize.node.scaleX = 0;
                this.prize.node.active = true;
                this.prize.node.runAction(cc.scaleTo(0.3, 1));
            }
        }
        
    },

    SetSpecial(isSpecial, spriteFrame, id) {
        this.idItem = id;
        if(isSpecial) {
            this.text.node.active = true;
            this.text.node.scaleX = 1;
            this.text.spriteFrame = spriteFrame;
        } else {
            this.text.node.active = false;
        }
    },

    SetImageSpine(id, data, animationName, isActiveAnim = true) {
        this._super(id, data, animationName, isActiveAnim);
    },

    PlayAnimationBonus() {
        this.drg.playAnimation("active", 1);
    },

    
    
});
