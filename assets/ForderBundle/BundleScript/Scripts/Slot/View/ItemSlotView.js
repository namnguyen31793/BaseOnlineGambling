cc.Class({
    extends: cc.Component,
    ctor() {
        this.isShowPrize = false;
        this.prizeValue = 0;
        this.sumPrize = 0;
        this.index = 0;
        this.isShowPreWin = false;
        this.level = 0;
        this.isShowSpine = false;
        this.idCache = 0;
    },

    properties: {
        drg : dragonBones.ArmatureDisplay,
        skeleton : sp.Skeleton,
        effectWin : cc.Node,
        contentBig : cc.Sprite,
        contentSmall : cc.Sprite,
        mask : cc.Mask,
        prize : cc.Label,
        boomObject : cc.Animation,
        bonusObject : cc.Node,
    },

    SetImage(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true) {
        this.idCache = id;
        if(this.skeleton)
            this.skeleton.node.active = false;
        if(this.drg){
            this.drg.node.active = true;
            this.drg.dragonAsset = ske;
            this.drg.dragonAtlasAsset = tex;
        }
        this.isShowSpine = false;
        this.level = 0;
        this.prizeValue = 0;
        this.sumPrize = 0;
        if(this.contentBig)
            this.contentBig.spriteFrame = sprBig;
        if(this.contentSmall)
            this.contentSmall.spriteFrame = sprSmall;
        if(this.prize)
            this.prize.node.active = false;
        if(this.mask) {
            if(sprMask) {
                this.mask.spriteFrame = sprMask;
                this.mask.enabled = true;
            } else {
                this.mask.enabled = false;
            }
        }
        if(isActiveAnim)
            this.drg.timeScale = 1;
        else {
            this.drg.timeScale = 0;
        }
        this.drg.playAnimation(animationName, 0);
    },

    SetImageSpine(id, data, animationName, isActiveAnim = true) {
        this.idCache = id;
        if(this.skeleton)
            this.skeleton.node.active = true;
        if(this.drg)
            this.drg.node.active = false;
        this.isShowSpine = true;

        this.skeleton.skeletonData = data;
        this.level = 0;
        this.prizeValue = 0;
        this.sumPrize = 0;
        if(this.prize)
            this.prize.node.active = false;

        if(isActiveAnim)
            this.skeleton.timeScale = 1;
        else {
            this.skeleton.timeScale = 0;
        }
        this.skeleton.setAnimation(0, animationName, false);
    },

    SetValueBonus() {
        if(!this.isShowPrize) {
            this.isShowPrize = true;
            if(this.level < 10) {
                this.prize.string = Global.Helper.formatNumber(this.prizeValue);
                this.prize.node.scale = 0;
                this.prize.node.active = true;
                this.prize.node.runAction(cc.scaleTo(0.5, 1));
            }
        }
    },

    SetValueBonus2() {
        if(!this.isShowPrize) {
            this.isShowPrize = true;
            if(this.level < 10) {
                this.sumPrize = this.prizeValue;
                this.prize.node.scale = 1;
                this.prize.node.active = true;
                this.prize.string = Global.Helper.formatNumber(this.prizeValue);
            }
        }else{
            this.prize.string = Global.Helper.formatNumber(this.prizeValue);
        }
    },

    AddPrizeValue(prize) {
        this.sumPrize += prize;
        if(!this.isShowPrize) {
            this.isShowPrize = true;
            if(this.level < 10) {
                this.prize.string = Global.Helper.formatNumber(this.sumPrize);
                this.prize.node.scale = 0;
                this.prize.node.active = true;
                this.prize.node.runAction(cc.scaleTo(0.25, 1));
            }
        } else {
            this.prize.node.getComponent("LbMonneyChange").setMoney(this.sumPrize);
        }
    },

    PlayAnimation(animationName, color, timeScale) {
        if(!this.isShowSpine){
            this.drg.node.color = color;
            this.drg.timeScale = timeScale;
            this.drg.playAnimation(animationName, 0);
        }else{
            this.skeleton.node.color = color;
            this.skeleton.timeScale = timeScale;
            this.skeleton.setAnimation(0, animationName, false);
        }
    },

    SetColorActive(color, useSpine) {
        this.isShowSpine = useSpine;
        if(!this.isShowSpine){
            this.drg.node.color = color;
        }else{
            this.skeleton.node.color = color;
        }
    },

    ShowEffectWin() {
        this.effectWin.active = true;
    },

    HideEffectWin() {
        this.effectWin.active = false;
    },

    PlayAnimPreWin() {
        if(!this.isShowPreWin) {
            this.isShowPreWin = true;
            if(!this.isShowSpine){
                this.drg.node.getComponent(cc.Animation).play("StartPreWin");
            }else{
                this.skeleton.node.getComponent(cc.Animation).play("StartPreWin");
            }
        }
    },

    EndAnimPreWin() {
        this.isShowPreWin = false;
        if(!this.isShowSpine){
            this.drg.node.getComponent(cc.Animation).play("StopPreWin");
        }else{
            this.skeleton.node.getComponent(cc.Animation).play("StopPreWin");
        }
    },

    CloneImage(item) {
        this.drg.dragonAsset = item.drg.dragonAsset;
        this.drg.dragonAtlasAsset = item.drg.dragonAtlasAsset;
    },

    CloneImage(item, useSpine) {
        this.isShowSpine = useSpine;
        if(!this.isShowSpine){
            this.drg.dragonAsset = item.drg.dragonAsset;
            this.drg.dragonAtlasAsset = item.drg.dragonAtlasAsset;
        }else{
            this.skeleton.skeletonData = item.skeleton.skeletonData;
        }
    },

    playAnimWaitAfk(useSpine, animationName, color, timeScale){
        if(this.idCache == 0 || this.idCache > 8)
            return;
        let random =  Global.RandomNumber(0,100);
        if(random < 60)
            return;
        if(useSpine){
            this.skeleton.node.color = color;
            this.skeleton.timeScale = timeScale;
            this.skeleton.setAnimation(0, animationName, false);
        }else{
            this.drg.node.color = color;
            this.drg.timeScale = timeScale;
            this.drg.playAnimation(animationName, 0);
        }
    },
    
});
