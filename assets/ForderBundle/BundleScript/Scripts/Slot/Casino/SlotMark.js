

cc.Class({
    extends: cc.Component,
    ctor() {
        this.freeManager = null;
        this.isShow = true;
        this.isShake = false;
    },

    properties: {
        anim : cc.Animation,
        animTitleFree : cc.Animation,
    },

    PlayMark(freeManager, isShow) {
        this.freeManager = freeManager;
        this.isShow = isShow;
        this.anim.play();
    },

    ShowFree() {
        this.freeManager.ChangeFreeUI(this.isShow);
        if(this.isShow) {
            this.animTitleFree.node.y = 500;
            this.scheduleOnce(()=>{
                this.animTitleFree.play();
                this.scheduleOnce(()=>{
                    this.VibrateScreen();
                }, 0.5)
            }, 0.5)
        }
        
    },

    VibrateScreen() {
        this.isShake = true;
        this.scheduleOnce(()=>{
            this.isShake = false;
            this.freeManager.slotView.node.setPosition(0,0);
        }, 0.2)
    },

    update (dt) {
        if(this.isShake ){
            this.freeManager.slotView.node.x = (Global.RandomNumber(-5 , 6));
            this.freeManager.slotView.node.y = (Global.RandomNumber(-5 , 6));
        }
    },

    onLoad() {
        // cc.game.on(cc.game.EVENT_HIDE, ()=>{
        //     this.timer = setInterval(()=>{
        //         this.update(0.1);
        //     }, 100);
        // })
        
        // cc.game.on(cc.game.EVENT_SHOW, ()=>{
        //     clearInterval(this.timer);
        // })
    },
    
});
