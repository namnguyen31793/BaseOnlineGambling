cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheid = 0;
        this.isShowPreWin = false;
    },
    properties: {
        skeletonBG : sp.Skeleton,
        spriteIcons: cc.Sprite,
        skeleton : sp.Skeleton,
        gem : sp.Skeleton,
        bgWild : cc.Node,
    },

    SetSpineItem(id, itemSpineData, itemSpineBGData, animationName = "", animationBgName = "", isGem = false){
        this.gem.node.active = false;
        this.bgWild.active = false;
        this.ActiveColorItem();
        this.skeleton.node.active = true;
        this.spriteIcons.node.active = false;
        this.skeleton.skeletonData = itemSpineData;
        this.skeleton.setAnimation(0, "", false);
        this.skeleton.setToSetupPose();
        this.cacheid = id;
        if(!Global.Helper.isStringNullOrEmpty(animationName))
            this.skeleton.setAnimation(0, animationName, false);

        if(id != 2){
            this.skeletonBG.node.active = true;
            this.skeletonBG.skeletonData = itemSpineBGData;
            this.skeletonBG.setAnimation(0, "", false);
            this.skeletonBG.setToSetupPose();
            if(!Global.Helper.isStringNullOrEmpty(animationBgName))
                this.skeletonBG.setAnimation(0, animationBgName, false);
        }

        if(isGem)
            this.ActiveGem();
        if(id == 1)
            this.bgWild.active = true;
    },

    SetImageItem(id, Sprite, isGem = false){
        this.bgWild.active = false;
        this.gem.node.active = false;
        this.ActiveColorItem();
        this.skeleton.node.active = false;
        this.skeletonBG.node.active = false;
        this.spriteIcons.node.active = true;
        this.cacheid = id;
        this.spriteIcons.spriteFrame = Sprite;
        if(isGem)
            this.ActiveGem();
        if(id == 1)
            this.bgWild.active = true;
    },

    ActiveGem(){
        this.gem.node.active = true;
        this.gem.node.scale = 1;
        this.gem.node.setPosition(0,0);
        cc.tween(this.gem.node)
            .to(1, { scale: cc.v2(0.4, 0.4), position: cc.v2(55, 50) })
            .call(() => {
                //console.log("Hoàn tất scale và di chuyển!");
            })
            .start();
    },

    HideColoritem(){
        this.skeleton.node.color = cc.Color.GRAY;
        this.spriteIcons.node.color = cc.Color.GRAY;
    },

    ActiveColorItem(){
        this.skeleton.node.color = cc.Color.WHITE;
        this.spriteIcons.node.color = cc.Color.WHITE;
    },

    PlayAnimPreWin() {
        if(!this.isShowPreWin) {
            this.isShowPreWin = true;
            // this.node.getComponent(cc.Animation).play("StartPreWin");
        }
    },
    EndAnimPreWin() {
        this.isShowPreWin = false;
        // this.node.getComponent(cc.Animation).play("StopPreWin");
    },
});
