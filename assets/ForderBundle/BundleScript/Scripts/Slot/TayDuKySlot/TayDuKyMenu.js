

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
        this.linkTopView = "PopupMiniGame/ShockDeer/TopShockDeer";
        this.linkHistoryView = "PopupMiniGame/ShockDeer/LichSuShockDeer";
        this.linkRankView = "PopupRank";
        this.linkSettingView = "Setting";

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

    UpdateBetValue(totalBetValue) {
        this.betValue = totalBetValue;
        if(this.lbBet)
            this.lbBet.string = Global.Helper.NumberShortK(this.GetBetValue()/20);//Global.Helper.formatMoney(this.GetBetValue());
        if(this.lb_CostBuyFree)
            this.lb_CostBuyFree.string = Global.Helper.NumberShortK(totalBetValue*CONFIG.MULTI_BET_BONANZA);
    },
    
    ClickBack() {
        this.slotView.PlayClick();
        this.slotView.ShowSelectRoom();
    },

    UpdateMoney(gold) {
        if(this.lbMoney) {
            this.lbMoney.string = Global.Helper.formatNumber(gold);//Global.Helper.formatNumber(gold);           
        }
    },
    UpdateTotalBetValue(totalBetValue) {
        this.betValue = totalBetValue;
        if(totalBetValue == null)
            totalBetValue = 0;
        this.lbTotalBet.string = Global.Helper.NumberShortK(totalBetValue);
    },

    ClickRank() {
        this.slotView.PlayClick();
        let menu = this;
        if(this.slotView.rankView) {
            this.slotView.rankView.Show(menu.slotView);
        } else {
            Global.DownloadManager.LoadPrefab(this.slotView.slotType.toString(),this.linkRankView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.rankView = help.getComponent("SlotRankView");
                menu.slotView.rankView.Show(menu.slotView);
            });
        }
    },

    ClickSetting() {
        this.slotView.PlayClick();
        if(this.slotView.settingView) {
            this.slotView.settingView.node.active = true;
        } else {
            let menu = this;
            Global.DownloadManager.LoadPrefab(this.slotView.slotType.toString(),this.linkSettingView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.settingView = help.getComponent("TayDuKySetting");
                menu.slotView.settingView.Init(this.slotView);
            });
        }
    },

    ClickMusic(toggle, data) {
        this.slotView.ChangeStateMusic(toggle.isChecked);
        //this.toggleAudio.node.getChildByName("Background").active = !toggle.isChecked;
    },

    ClickSound(toggle, data) {
        this.slotView.ChangeStateSound(toggle.isChecked);
    },

    ClickShowHistory(){
        if(this.slotView.historyView == null){
            let seft = this;
            Global.DownloadManager.LoadPrefab("33","PopupHistory", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.slotView.node.addChild(effect, 10000);
                effect.setPosition(cc.v2(0,0));
                seft.slotView.historyView = effect.getComponent('SlotHistory');
                seft.slotView.historyView.Show(seft.slotView.slotType);
            });  
        }else{
            this.slotView.historyView.Show(this.slotView.slotType);;
        }
    },
});
