

cc.Class({
    extends: require("SlotMenuView"),

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    SetLastPrizeDrop(value) {
        cc.log("SetLastPrizeDrop "+value)
        this.UpdateWinValue(value);
    },

    SendBuyFree(){
        Global.Helper.LogAction("click buy free:"+this.slotView.slotType);
        this.slotView.PlayClick();
        this.slotView.RequestBuyFree() ;
    },

});
