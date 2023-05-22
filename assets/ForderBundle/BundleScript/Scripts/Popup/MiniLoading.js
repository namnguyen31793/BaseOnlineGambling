

cc.Class({
    extends: cc.Component,
    ctor() {
        this.lastValue = 0;
    },

    properties: {
        progress : cc.Label,
        skeleton : sp.Skeleton,
        data : sp.SkeletonData,
    },

    onLoad() {
        this.node.children[0].addComponent(cc.BlockInputEvents);
        if(this.skeleton == null)
            return;
        if(CONFIG.MERCHANT == "3"){
            this.skeleton.skeletonData = this.data;
            this.skeleton.timeScale = 1;  
            this.skeleton.setAnimation(0, "animation", true);
        }
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                Global.UIManager.hideMiniLoading();
                break;
            default:
                break;
        }
        
    },

    UpdateProgress(percent) {
        if(!this.progress.node.active) {
            this.progress.node.active = true;
        }
        if(percent > this.lastValue) {
            this.progress.string = parseInt(percent*100)+"%";
        }
    },

    onDisable() {
        this.lastValue = 0;
        this.progress.node.active = false;
    },

    // update (dt) {},
});
