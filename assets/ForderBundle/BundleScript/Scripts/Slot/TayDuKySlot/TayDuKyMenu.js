

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
    },

    Init(slotView) {
        this.slotView = slotView;
        var listData = [100, 1000, 10000];
        for(let i = 0; i < listData.length; i++){
            this.listBet[i] = listData[i];
        }
        this.UpdateBetValue(this.listBet[0]);
        this.linkHelpView = "PopupMiniGame/ShockDeer/HuongDanChoiShockDeer";
        this.linkTopView = "PopupMiniGame/ShockDeer/TopShockDeer";
        this.linkHistoryView = "PopupMiniGame/ShockDeer/LichSuShockDeer";

        //this._super(slotView); //k ke thua
        this.linkHelpView = "HuongDanChoi";
        this.slotView.lineData = 20;
    },

    GetJackpotInfo() {
        this.lbJackpot.setMoney(this.listJackpotValue[0]);
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
    
    ClickBack() {
        this.slotView.PlayClick();
        this.slotView.ShowSelectRoom();
    },
});
