var ScreenManager = require("ScreenManager");
cc.Class({
    extends: require("BigWinEffect"),


    properties: {
    },

    start() {
        this.countShowAds = 0;
        let current = this;
    },

    EndBigWin() {
        cc.log("end BigWin");
        for(let i = 0; i < this.node.children.length; i++)
            this.node.children[i].active = false;
        this.mark.active = false;
        if(this.imgSkeleton)
            this.imgSkeleton.loop = false;
        if(this.nodeParticle)
            this.nodeParticle.active = false;
        //game nổ sập đã cộng tiền ở các lượt rơi, k cộng tiền 1 lần nữa ở bigwin
        if(this.isUpdateWinValue)
            this.slotView.UpdateWinValue(this.winMoney);
        else
            this.slotView.menuView.ShowWinValueCache();
        if(this.isUpdateWallet) {
            if(!this.slotView.isBattle) {
                if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                    require("WalletController").getIns().UpdateBalance(this.winMoney)
                }else{
                    require("WalletController").getIns().TakeBalance(this.slotView.slotType)
                }
            }
        }
        if(this.content)
            this.content.active = false;
        this.isRun = false;
        
        this.toDoList.DoWork();
        this.CheckShowInterstitial();
    },

});
