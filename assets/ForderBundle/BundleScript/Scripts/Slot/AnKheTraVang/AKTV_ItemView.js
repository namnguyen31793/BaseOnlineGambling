cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheid = 0;
        this.isShowPreWin = false;
    },
    properties: {
        spriteIcons: cc.Sprite,
        skeleton : sp.Skeleton,
        lbMulti : cc.Label,
    },

    SetSpineItem(id, itemSpineData, animationName = "", loop = false, multi = 1){
        this.ActiveColorItem();
        if(multi > 1){
            this.lbMulti.node.active = true;
            this.lbMulti.node.scale = 0.8;
            cc.tween(this.lbMulti.node)
                .to(0.15, { scaleX: 1.1 })
                .to(0.1, { scaleX: 1 })
                .to(0.1, { scaleX: 1.1 })
                .to(0.05, { scaleX: 1 })
            .start();
        }
        else
            this.lbMulti.node.active = false;
        this.lbMulti.string = "X"+multi;
        this.skeleton.node.active = true;
        this.spriteIcons.node.active = false;
        this.skeleton.skeletonData = itemSpineData;
        this.skeleton.setAnimation(0, "", false);
        this.skeleton.setToSetupPose();
        this.cacheid = id;
        if(!Global.Helper.isStringNullOrEmpty(animationName))
            this.skeleton.setAnimation(0, animationName, false);
        if(id != 1)
            this.skeleton.node.setPosition(cc.v2(0,-14));
        else
            this.skeleton.node.setPosition(cc.v2(-40,-54));
    },

    SetImageItem(id, Sprite, multi = 1){
        this.ActiveColorItem();
        this.lbMulti.node.active = false;
        this.skeleton.node.active = false;
        this.spriteIcons.node.active = true;
        this.cacheid = id;
        this.spriteIcons.spriteFrame = Sprite;
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
