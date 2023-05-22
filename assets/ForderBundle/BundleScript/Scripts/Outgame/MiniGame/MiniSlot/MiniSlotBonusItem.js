
cc.Class({
    extends: cc.Component,

    properties: {
        spriteItemDefault: cc.SpriteFrame,
        spriteItem: {
            default: [],
            type: cc.SpriteFrame,
        },
        
        itemDBAsset: {
            default: [],
            type: dragonBones.DragonBonesAsset,
        },

        itemDBAtlasAsset: {
            default: [],
            type: dragonBones.DragonBonesAtlasAsset,
        },
    },

    // index 0 = dan thuong, 1 = binh linh, 2 = tuong linh
    showEffect(index, value){
        this.reset();

        let drg = this.node.getComponentInChildren(dragonBones.ArmatureDisplay);
        drg.dragonAsset = this.itemDBAsset[index];
        drg.dragonAtlasAsset = this.itemDBAtlasAsset[index];
        drg.timeScale = 1;
        drg.playAnimation("animtion0", 0);
        drg.node.scale = 1;

        this.node.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));

        let acHide = cc.callFunc(() => {
            this.node.scale = 0;
        });
        this.node.runAction(cc.sequence(cc.delayTime(1), acHide));
        
        let text = this.node.getComponentInChildren(cc.Label);
        text.string = Global.formatNumber(value);
        text.node.runAction(cc.scaleTo(0.5 , 1).easing(cc.easeBackOut()));
    },

    showUIItem(index){
        this.reset();
        this.node.scale = 1;
        let drg = this.node.getComponentInChildren(cc.Sprite);
        drg.enabled = true;
        drg.spriteFrame = this.spriteItem[index];
    },

    reset(){
        this.node.getComponentInChildren(dragonBones.ArmatureDisplay).node.scale = 0;
        this.node.getComponentInChildren(cc.Sprite).enabled = false;
        this.node.getComponentInChildren(cc.Label).string = "";
        this.node.getComponentInChildren(cc.Label).node.scale = 0;
        this.node.scale = 0;
    },

    resetUINewTurn(){
        this.reset();
        let drg = this.node.getComponentInChildren(cc.Sprite);
        drg.enabled = true;
        drg.spriteFrame = this.spriteItemDefault;
        this.node.scale = 1;
    },
});
