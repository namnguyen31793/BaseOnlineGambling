cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheSprite = null;
        this.id = 0;
    },

    properties: {
        btn : cc.Button,
        spriteIcons: cc.Sprite,
    },

    Init(){
        this.btn = this.node.getChildByName("btn").getComponent(cc.Button);
        this.spriteIcons = this.node.getChildByName("icon").getComponent(cc.Sprite);
    },

    ShowEnd(idWin){
        if(this.id == 0){
            //chua lat, fake icon
            return;
        }
        cc.log("ShowEnd "+idWin+"-"+this.id);
        if(this.id != idWin)
            this.spriteIcons.node.opacity = 115;
        else
            this.spriteIcons.node.opacity = 255;
    },

    ShowEffect(sprite, id){
        this.id = id;
        this.btn.interactable = false;
        this.cacheSprite = sprite;
        this.runSequenceActions();
    },

    Reset(sprite){
        this.id = 0;
        this.node.scale = 0;
        this.btn.interactable = true;
        this.spriteIcons.spriteFrame = sprite;
        this.spriteIcons.node.opacity = 255;
    },

    runSequenceActions() {
        cc.tween(this.spriteIcons.node)
            .by(0.025, { position: cc.v2(20, 0) })
            .by(0.05, { position: cc.v2(-20, 0) })
            .by(0.025, { position: cc.v2(0, 0) })
            .to(0.1, { scaleX: 0 })
            .call(() => {
                this.spriteIcons.spriteFrame = this.cacheSprite;
                cc.tween(this.spriteIcons.node)
                    .to(0.1, { scaleX: 1 })
                    .call(() => {
                        // console.log("Scale và đổi ảnh hoàn tất!");
                    })
                    .start();
            })
            .start();

    },
});
