cc.Class({
    extends: cc.Component,
    ctor() {
        this.countTime = 0;
        this.isRun = false;
    },

    properties: {
        lbTime : cc.Label,
        btnAds : cc.Button,
        btnClose : cc.Button,
        anim : sp.Skeleton,
    },

    show() {
        this.countTime = 15;
        this.isRun = false;
        this.btnAds.node.active = true;
        this.btnClose.node.active = true;
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        this.anim.setAnimation(0, 'xuat hien', false);
        this.scheduleOnce(()=>{
            this.anim.setAnimation(0, 'waiting', true);
            this.btnClose.node.active = true;
            this.isRun = true;
        } , 1.0);
    },
    
    ClickAds() {
    },

    hide() {
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
            Global.SlotNetWork.slotView.ActionAutoSpin();
        } , 0.2);
    },

    update(dt) {
        if(this.isRun) {
            this.countTime -= dt;
            this.lbTime.string = parseInt(this.countTime);
            if(this.countTime <= 0) {
                this.isRun = false;
                this.hide();
            }
        }
    },

    onDestroy() {
        Global.PopupFreeSpinAdsSlot = null;
    },
});
