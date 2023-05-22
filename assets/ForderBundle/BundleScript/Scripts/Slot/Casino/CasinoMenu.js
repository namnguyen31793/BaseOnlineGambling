cc.Class({
    extends: require("SlotMenuView"),

    Init(slotView) {
        this._super(slotView);
        this.listBet = [];
        this.listBet[0] = 100;
        this.listBet[1] = 1000;
        this.listBet[2] = 10000;
        this.linkHelpView = "PopupMiniGame/Casino/HuongDanChoiCasino";
        this.linkTopView = "PopupMiniGame/Casino/TopCasino";
        this.linkHistoryView = "PopupMiniGame/Casino/LichSuCasino";
    },

    UpdateJackpotValue(jackpotValue) {
        this._super(jackpotValue);
        this.slotView.freeManager.UpdateJackpotValue(jackpotValue);
    },

    UpdateMoney(gold) {
        this._super(gold);
        this.slotView.freeManager.UpdateMoney(gold);
    },

    SetLastPrizeValue(lastPrizeValue) {
        this.UpdateWinValue(lastPrizeValue);
    },

    UpdateWinValue(winValue) {
        this.lbTotalWin.string = "Thắng: "+ Global.Helper.formatNumber(winValue);
    },

    UpdateTotalBetValue(totalBetValue) {
        this._super(totalBetValue);
        this.lbTotalBet.string = Global.Helper.formatNumber(this.GetBetValue() * this.slotView.lineData);
    },

    ClickTop() {
        this.slotView.PlayClick();
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("COMMING_SOON"));
    },

    ClickButtonSpeed(toggle, data) {
        this.slotView.PlayClick();
        this.slotView.SpeedSpin(toggle.isChecked);
        if(toggle.isChecked) {
            this.toggleAuto.isChecked = true;
            this.toggleAuto.getComponent("ToggleHelper").img.active = false;
            this.slotView.AutoSpin(true);
        }
    },
    
});
