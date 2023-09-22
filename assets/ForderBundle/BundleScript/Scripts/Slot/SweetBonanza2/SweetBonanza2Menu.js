

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
        nodeBuyFree : cc.Node,
        lbCostBuyFree : cc.Label,
    },
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
        this.HideNodeBuyFree();
        this.slotView.PlayClick();
        this.slotView.RequestBuyFree() ;
    },

    ShowNodeBuyFree(){
        this.nodeBuyFree.active = true;
        this.lbCostBuyFree.string = Global.Helper.formatNumber(this.slotView.totalBetValue*CONFIG.MULTI_BET_BONANZA);
    },

    HideNodeBuyFree(){
        this.nodeBuyFree.active = false;
        this.lbCostBuyFree.string = "";
    }

});
