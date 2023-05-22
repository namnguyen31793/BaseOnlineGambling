cc.Class({
    extends: require("SlotFreeManager"),

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString() + " LẦN";
    },

    AddTotalWin(winMoney) {
        this._super(winMoney);
        this.lbTotalWin.string = "+"+Global.formatMoney(this.totalWin);
    },

    HideFreeSpin() {
        this._super();
        this.lbTotalWin.string = "+0";
    },

    ShowFree(numberFree, isNotify, winNormal) {

    },
});
