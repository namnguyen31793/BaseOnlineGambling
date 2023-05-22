

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
        lbMajor :require("LbMonneyChange"),
        lbMinor :require("LbMonneyChange"),
        lbMini :require("LbMonneyChange"),
        lbWin : require("LbMonneyChange"),
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    SetMoneyWin(winValue) {
        this.lbWin.reset();
        this.lbWin.setMoney(winValue);
    },

    GetJackpotInfo() {
        this.lbJackpot.setMoney(this.listJackpotValue[3]);
        this.lbMajor.setMoney(this.listJackpotValue[2]);
        this.lbMinor.setMoney(this.listJackpotValue[1]);
        this.lbMini.setMoney(this.listJackpotValue[0]);
    },
    
});
