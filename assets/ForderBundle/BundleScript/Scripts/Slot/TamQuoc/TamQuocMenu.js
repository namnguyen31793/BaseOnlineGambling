

cc.Class({
    extends: require("SlotMenuView"),

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "PopupMiniGame/TamQuoc/HuongDanChoiTamQuoc";
        this.linkTopView = "PopupMiniGame/TamQuoc/TopTamQuoc";
        this.linkHistoryView = "PopupMiniGame/TamQuoc/LichSuTamQuoc";
    },

    
});
