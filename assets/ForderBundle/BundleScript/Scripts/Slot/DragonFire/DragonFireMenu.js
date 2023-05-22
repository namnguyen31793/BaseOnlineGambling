

cc.Class({
    extends: require("SlotMenuView"),

    ctor() {
        this.cacheValueWin = 0;
    },

    properties: {
        lbWays : cc.Label,
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    UpdateNumberWay(num){
        this.lbWays.string = num;
    },
    
    ClickSpin() {
        this.slotView.PlayClick();
        this.slotView.ClickSpin();
    },
});
