cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheid = 0;
        this.isShowPreWin = false;
    },
    properties: {
        spriteIcons: cc.Sprite,
        skeleton : sp.Skeleton,
    },

    SetImageSpine(id, itemSpineData, animationName = "", loop = false){
        this.skeleton.node.active = true;
        this.spriteIcons.node.active = false;
        this.skeleton.skeletonData = itemSpineData;
        this.cacheid = id;
        if(!Global.Helper.isStringNullOrEmpty(animationName))
            this.skeleton.setAnimation(0, animationName, loop);
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
});
