

cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        itemDBAsset: {
            default: [],
            type: dragonBones.DragonBonesAsset,
        },

        itemDBAtlasAsset: {
            default: [],
            type: dragonBones.DragonBonesAtlasAsset,
        },

        itemSpineData: {
            default: [],
            type: sp.SkeletonData,
        },

        itemContentBigSprite: {
            default: [],
            type: cc.SpriteFrame,
        },

        itemContentSmallSprite: {
            default: [],
            type: cc.SpriteFrame,
        },

        itemMaskSprite: {
            default: [],
            type: cc.SpriteFrame,
        },

        playAnimationName: {
            default: "active",
        },

        waitAnimationName: {
            default: "waiting",
        },

        minRandom : {
            default : 2,
        },

        maxRandom : {
            default : 10,
        },

        useSpine: {
            default: false,
        },
    },

    Init(slotView)
    {
        this.slotView = slotView;
    },

    RandomImage(item, isActiveAnim)
    {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        let listSpr = this.GetSprite(r+1);
        this.SetImage(r, item);
        // item.SetImage(this.itemDBAsset[r], this.itemDBAtlasAsset[r], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, isActiveAnim);
    },

    SetImage(id, item) {
        if(this.useSpine){
            item.SetImageSpine(id, this.itemSpineData[id-1], this.waitAnimationName, true);  
        }
        else{
            let listSpr = this.GetSprite(id);
            item.SetImage(id, this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
        }
    },

    ActiveItem(item, active, useColor = false) {
        if(active) {
            if(this.useSpine){
                item.PlayAnimation(this.playAnimationName, cc.Color.WHITE, 1);
            } else {
                let drg = item.getComponentInChildren(dragonBones.ArmatureDisplay);
                drg.node.color = cc.Color.WHITE;
                drg.timeScale = 1;
                drg.playAnimation(this.playAnimationName, 0);
            }
        } else {
            if(this.useSpine){
                if(useColor)
                    item.PlayAnimation(this.waitAnimationName, cc.Color.GRAY, 0);
                else
                    item.PlayAnimation(this.waitAnimationName, cc.Color.WHITE, 0);
            } else {
                let drg = item.getComponentInChildren(dragonBones.ArmatureDisplay);
                drg.playAnimation(this.waitAnimationName, 0);
                drg.node.color = cc.Color.GRAY;
                drg.timeScale = 0;
            }
            
            //drg.playAnimation(this.waitAnimationName, 0);
        }
    },

    SetColorActive(item, active) {
        if(active) {
            item.SetColorActive(cc.Color.WHITE, this.useSpine);
        } else {
            item.SetColorActive(cc.Color.GRAY, this.useSpine);
        }
    },

    GetSprite(type) {
        let listSpr = [null,null,null];
        return listSpr;
    },

    playAnimWaitAfk(item){
        item.playAnimWaitAfk(this.useSpine, this.playAnimationName, cc.Color.WHITE, 1);  
    },
    
});
