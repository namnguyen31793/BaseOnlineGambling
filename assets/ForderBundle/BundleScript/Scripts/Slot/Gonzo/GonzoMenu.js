

cc.Class({
    extends: require("SlotMenuView"),

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    SetLastPrizeDrop(value) {
        this.UpdateWinValue(value);
    },

});
