cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        gem : cc.Node,
    },

    SetImage(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true) {
        this._super(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim, isShowMask);
        this.ResetUI();
    },

    SetImageSpine(id, data, animationName, isActiveAnim = true) {
        this._super(id, data, animationName, isActiveAnim);
        this.ResetUI();
    },

    ShowAnimGem(isActiveGem){
        this.gem.active = isActiveGem;
        if(isActiveGem){
            this.gem.scale = 0;
            this.gem.getComponent(cc.Animation).play("EffectScaleGemItem");
            this.gem.getComponent(dragonBones.ArmatureDisplay).playAnimation("animtion0", 1)
        }
    },

    ResetUI(){
        this.gem.active = false;
    },
    
});
