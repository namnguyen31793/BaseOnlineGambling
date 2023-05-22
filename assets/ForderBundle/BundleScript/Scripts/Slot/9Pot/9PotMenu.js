

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
        lbJackpotLow :[require("LbMonneyChange")],
    },

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
        this.slotView.lineData = 20;
    },

    GetJackpotInfo() {
        this.lbJackpot.setMoney(this.listJackpotValue[0]);
    },

    UpdateTotalBetValue(totalBetValue) {
        this._super(totalBetValue);
        this.lbJackpotLow[0].setMoney(this.slotView.maxTotalBetValue * 1);
        this.lbJackpotLow[1].setMoney(this.slotView.maxTotalBetValue * 3);
        this.lbJackpotLow[2].setMoney(this.slotView.maxTotalBetValue * 8);
        this.lbJackpotLow[3].setMoney(this.slotView.maxTotalBetValue * 15);
        this.lbJackpotLow[4].setMoney(this.slotView.maxTotalBetValue * 30);
        this.lbJackpotLow[5].setMoney(this.slotView.maxTotalBetValue * 50);
    },

    UpdateJackpotValue(listJackpotValue) {
        this.lbJackpot.setMoney(listJackpotValue);
    },

    NextLine() {
        this.slotView.lineData += 1;
        if(this.slotView.lineData > 20)
            this.slotView.lineData = 1;
        this.SetLineData(this.slotView.lineData);
        this.slotView.UpdateLineBet();
    },

    PrevLine() {
        this.slotView.lineData -= 1;
        if(this.slotView.lineData < 1)
            this.slotView.lineData = 20;
        this.SetLineData(this.slotView.lineData);
        this.slotView.UpdateLineBet();
    },

    ClickHelp() {
        this.slotView.PlayClick();
        if(this.slotView.helpView) {
            this.slotView.helpView.node.active = true;
        } else {
            Global.UIManager.showMiniLoading();
            let menu = this;
            Global.DownloadManager.LoadPrefab(this.slotView.slotType.toString(),this.linkHelpView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.helpView = help.getComponent("SlotHelpView");
                menu.slotView.helpView.Init(menu.slotView);
            });
        }
    },
});
