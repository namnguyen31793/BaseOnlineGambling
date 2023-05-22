

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
        lbMajor :require("LbMonneyChange"),
        lbMinor :require("LbMonneyChange"),
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    GetJackpotInfo() {
        this.lbJackpot.setMoney(this.listJackpotValue[2]);
        this.lbMajor.setMoney(this.listJackpotValue[1]);
        this.lbMinor.setMoney(this.listJackpotValue[0]);
    },
    
});
