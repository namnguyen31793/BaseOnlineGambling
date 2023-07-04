

cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
        this.actBonus = null;
        this.actJackpot = null;
        this.actNotify = null;
    },

    properties: {
        lbBet : cc.Label,
        lbWin : cc.Label,
        freeObj : cc.Node,
        lbFree : cc.Label,
        jackpotObj : cc.Node,
        lbJackpot : cc.Label,
        bonusObj : cc.Node,
        notifyObj : cc.Node,
        lbNotify : cc.Label,
        mark : cc.Node,
        bigWinEffect : require("BigWinEffect"),
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    ShowWinBetMoney(betMoney) {
        // if(betMoney > 0) {
        //     this.lbBet.string = "+"+Global.Helper.formatNumber(betMoney);
        //     this.lbBet.node.parent.getComponent(cc.Animation).play();
        // }
    },

    ShowWinMoney(winMoney) {
        this.lbWin.string = "";
        this.lbWin.node.active = true;
        this.lbWin.node.parent.getComponent(cc.Animation).play();
        this.lbWin.getComponent("LbMonneyChange")._currentMonney = 0;
        this.lbWin.getComponent("LbMonneyChange").setMoney(winMoney);
    },

    ShowBigWin(winMoney, toDoList, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.bigWinEffect.ShowBigWin(winMoney, this.slotView.GetBetValue(), toDoList, this.slotView, isX2, isUpdateWinValue, isUpdateWallet);
    },

    ShowJackpot(winMoney, toDoList, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.bigWinEffect.ShowJackpot(winMoney, this.slotView.GetBetValue(), toDoList, this.slotView, isX2, isUpdateWinValue, isUpdateWallet);
    },

    HideWinMoney() {
        this.lbWin.node.parent.getComponent(cc.Animation).stop();
        this.lbWin.node.active = false;
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.lbFree.string = freeSpinTurn + "Lượt";
    },

    // ShowJackpot(jackpotValue, act) {
    //     this.actJackpot = act;
    //     this.jackpotObj.active = true;
    //     this.jackpotObj.scale = 4;
    //     this.jackpotObj.opacity = 50;
    //     this.jackpotObj.runAction(cc.spawn(cc.fadeIn(0.2) , cc.scaleTo(0.3 , 1)) );
    //     this.lbJackpot.node.runAction(cc.scaleTo(3.5, 1).easing(cc.easeBackOut()));
    //     let cpTemp = this.lbJackpot.node.getComponent("LbMonneyChange");
    //     cpTemp._currentMonney = 0.4* jackpotValue;
    //     cpTemp.time = 3;
    //     cpTemp.setMoney(jackpotValue);
    // },

    ShowBonus(actBonus) {
        this.actBonus = actBonus;
        this.bonusObj.active = true;
    },

    ClickCloseFree() {
        if(this.freeObj != null)
        this.freeObj.active = false;
    },

    ClickCloseJackpot() {
        this.jackpotObj.active = false;
        this.actJackpot();
    },

    ClickCloseBonus() {
        if(this.bonusObj == null)
        return;
        
        this.bonusObj.active = false;
        if(this.actBonus) {
            this.actBonus();
            this.actBonus = null;
        }   
    },

    ShowNotify(winValue, act) {
        this.notifyObj.active = true;
        this.actNotify = act;
        this.lbNotify.string = Global.Helper.formatNumber(winValue);
    },

    ClickCloseNotify(activeAction = true) {
            this.notifyObj.active = false;
            if(this.actNotify && activeAction) {
                this.actNotify();
            }
                
            this.actNotify = null;
        
    },
    
});
