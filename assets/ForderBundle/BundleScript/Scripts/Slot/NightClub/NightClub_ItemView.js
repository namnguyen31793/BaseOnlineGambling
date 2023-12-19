cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheid = 0;
        this.isShowPreWin = false;
        this.animName = "";
    },
    properties: {
        spriteIcons: cc.Sprite,
        skeleton : sp.Skeleton,
    },

    SetImageSpine(id, itemSpineData, animationName = "", loop = false){
        this.animName = "";
        // this.skeleton.node.active = true;
        // this.spriteIcons.node.active = false;
        this.skeleton.skeletonData = itemSpineData;
        this.skeleton.setAnimation(0, "", false);
        this.skeleton.setToSetupPose();
        this.cacheid = id;
        if(!Global.Helper.isStringNullOrEmpty(animationName)){
            this.skeleton.setAnimation(0, animationName, loop);
            this.animName = animationName;
        }
    },

    SetImageImg(id, Sprite){
        this.skeleton.node.active = false;
        this.spriteIcons.node.active = true;
        this.cacheid = id;
        this.spriteIcons.spriteFrame = Sprite;
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

    HideColoritem(){
        // this.skeleton.node.color = cc.Color.GRAY;
        // this.spriteIcons.node.color = cc.Color.GRAY;
        this.skeleton.node.active = false;
        this.spriteIcons.node.active = true;
    },

    ActiveColorItem(){
        // this.skeleton.node.color = cc.Color.WHITE;
        // this.spriteIcons.node.color = cc.Color.WHITE;
        this.skeleton.node.active = true;
        this.spriteIcons.node.active = false;
        if(!Global.Helper.isStringNullOrEmpty(this.animName))
            this.skeleton.setAnimation(0, this.animName, true);
    },
});
