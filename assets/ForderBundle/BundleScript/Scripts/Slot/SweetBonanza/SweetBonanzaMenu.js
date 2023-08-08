

cc.Class({
    extends: require("SlotMenuView"),

    ctor() {
        this.cacheValueWin = 0;
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

});
