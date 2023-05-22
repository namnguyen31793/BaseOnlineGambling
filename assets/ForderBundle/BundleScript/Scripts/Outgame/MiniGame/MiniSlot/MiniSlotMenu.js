

cc.Class({
    extends: require("SlotMenuView"),
    properties: {
        // Bet
        btnBet: {
            default: [],
            type: cc.Toggle
        },
    },

    Init(slotView) {
        this.slotView = slotView;
       // this.listBetValue = [100,1000,10000];
        this.slotView.roomID = 1;
        this._super(slotView);
        this.linkHelpView = "HelpMiniSlot";
        this.linkTopView = "TopMiniSlot";
        this.linkHistoryView = "LichSuMiniSlot";
    },

    chooseBet(toggle) {
        var index = this.btnBet.indexOf(toggle);
        this.slotView.roomID = index + 1;
        // this.UpdateBetValue(this.listBetValue[index]);
        this.slotView.RequestGetAccountInfo();
        this.slotView.netWork.RequestGetJackpotInfo();
    },

    UpdateBetValue(totalBetValue) {
        cc.log("total bet:"+totalBetValue);
        if(totalBetValue == null)
            return;
        this.betValue = totalBetValue;
        if(this.lbBet)
            this.lbBet.string = Global.Helper.formatNumber(this.GetBetValue());//Global.Helper.formatMoney(this.GetBetValue());
    },
    
    ClickBack() {
        this.slotView.PlayClick();
        //require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOBBY);
        this.slotView.CloseGame ();
    },

    ClickHelp() {
        this.slotView.PlayClick();
        if(this.slotView.helpView) {
            this.slotView.helpView.node.active = true;
        } else {
            Global.UIManager.showMiniLoading();
            let menu = this;
            Global.DownloadManager.LoadPrefab("MiniSlot",this.linkHelpView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.helpView = help.getComponent("SlotHelpView");
                menu.slotView.helpView.Init(menu.slotView);
            });
        }
    },

    ClickHistory() {
        this.slotView.PlayClick();
        if(this.slotView.historyView) {
            this.slotView.historyView.node.active = true;
            this.slotView.historyView.Init(menu.slotView);
        } else {
            Global.UIManager.showMiniLoading();
            let menu = this;
            Global.DownloadManager.LoadPrefab("MiniSlot",this.linkHistoryView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.historyView = help.getComponent("SlotHistoryView");
                menu.slotView.historyView.Init(menu.slotView);
            });
        }
    },

    ClickTop() {
        this.slotView.PlayClick();
        if(this.slotView.topView) {
            this.slotView.topView.node.active = true;
            this.slotView.topView.Init(menu.slotView);
        } else {
            Global.UIManager.showMiniLoading();
            let menu = this;
            Global.DownloadManager.LoadPrefab("MiniSlot",this.linkTopView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.topView = help.getComponent("SlotTopView");
                menu.slotView.topView.Init(menu.slotView);
            });
        }
    },

    FakeWinValue(winValue) {
        if(winValue <= 0)
            return;
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(winValue);
    },
});
