

cc.Class({
    extends: require("SlotMenuView"),

    ctor() {
        this.cacheValueWin = 0;
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
        this.lbSession.node.active = false;
    },

    SetLastPrizeDrop(value) {
        this.UpdateWinValue(value);
        // this.cacheValueWin += value;
        // this.lbLastPrize.string = Global.Helper.formatMoney(value);
    },
});
