

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
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
    },
    
});
