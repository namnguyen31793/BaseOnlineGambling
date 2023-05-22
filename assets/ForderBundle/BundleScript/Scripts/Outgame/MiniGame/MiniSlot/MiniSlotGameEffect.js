var ScreenManager = require("ScreenManager");
cc.Class({
    extends: require("SlotGameEffect"),


    ShowWinMoneyMulti(winMoney, total) {
        this.lbWin.string = "";
        this.lbWin.node.active = true;
        this.lbWin.node.parent.getComponent(cc.Animation).play();
        this.lbWin.getComponent("LbMonneyChange")._currentMonney = winMoney;
        this.lbWin.getComponent("LbMonneyChange").setMoney(total);
    },

    ShowBigWin(winMoney, toDoList, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.bigWinEffect.ShowBigWin(winMoney, this.slotView.GetBetValue(), toDoList, this.slotView, isX2, isUpdateWinValue, isUpdateWallet);
        this.mark.active = true;
        this.scheduleOnce(()=>{
            this.mark.active = false;
        } , 3); 
    },

    ShowJackpot(jackpotValue, toDoList, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.jackpotObj.active = true;
        this.jackpotObj.scale = 4;
        this.jackpotObj.opacity = 50;
        this.jackpotObj.runAction(cc.spawn(cc.fadeIn(0.2) , cc.scaleTo(0.3 , 1)) );
        this.lbJackpot.node.runAction(cc.scaleTo(3.5, 1).easing(cc.easeBackOut()));
        let cpTemp = this.lbJackpot.node.getComponent("LbMonneyChange");
        cpTemp.reset();
        cpTemp.time = 3;
        cpTemp.setMoney(jackpotValue);

        this.mark.active = true;
        this.scheduleOnce(()=>{
            this.jackpotObj.active = false;
                this.slotView.UpdateWinValue(jackpotValue);
            if(isUpdateWallet) {
                if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                    require("WalletController").getIns().UpdateBalance(jackpotValue)
                }else{
                    require("WalletController").getIns().TakeBalance(this.slotView.slotType)
                }
            }
            toDoList.DoWork();
            this.mark.active = false;
        } , 5); 
    },

    ClickCloseJackpot() {

    },

    ClickEndRunMoney() {
        
    },
});
