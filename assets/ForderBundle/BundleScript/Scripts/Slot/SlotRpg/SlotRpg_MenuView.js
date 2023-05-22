// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.slotView = null;
        this.listBet = [];
        this.linkTopView = "";
        this.linkHistoryView = "";
        this.linkHelpView = "";
        this.cacheValue = 0;
        this.betValue = 0;
        this.isCountPress = false;
        this.countTimePress = 0;
    },
    properties: {
        lbLastPrize : cc.Label,
        lbMoney : cc.Label,
        lbTotalBet : cc.Label,
        lbSession : cc.Label,
        btnSpin : cc.Button,
        toggleAuto : cc.Toggle,
        toggleAudio : cc.Toggle,
        lbTotalWin : cc.Label,
        btnLevel : cc.Node,
        changePosBySize : {
            default : true,
        },
        animBtnMenu : cc.Animation,
    },


    onLoad() {
        let wScene = cc.winSize.width/2;
         if(wScene < 1344/2) {
            if(this.btnLevel)
                this.btnLevel.x = -wScene+100;
            if(this.animBtnMenu.node)
                this.animBtnMenu.node.x = wScene - 45;
         }
        if(Global.isTutorial >= 1) {
            this.animBtnMenu.node.opacity = 150;
        }
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            if(this.btnSpin.interactable) {
                this.isCountPress = true;
                this.countTimePress = 0;
            }
        });
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this.isCountPress = false;
        });
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            this.isCountPress = false;
        });
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        if(isMusic > 0) {
            
        } else {
            // this.toggleAudio.isChecked = false;
            // this.ClickVolume(this.toggleAudio, null);
        }
        this.UpdateMoney(0);
    },

    Init(slotView) {
        this.slotView = slotView;
        
        //check listData to server
        let listMultiRoom = Global.SlotRoomMuitlConfig;
        for(let i = 0; i <  listMultiRoom.length; i++){
            if(listMultiRoom[i].GameId == this.slotView.slotType){
                this.listBet = [];
                let model = JSON.parse(listMultiRoom[i].RoomMultiInfo);
                if(model.length > 0){
                    this.slotView.lineData = model[0].Bet/(model[0].MultiReward*100)
                }
                for(let j = 0; j < model.length; j++){
                    this.listBet[model[j].RoomBetId-1] = model[j].MultiReward*100;
                }
                break;
            }
        }

        this.linkHelpView = "PopupMiniGame/ShockDeer/HuongDanChoiShockDeer";
        this.linkTopView = "PopupMiniGame/ShockDeer/TopShockDeer";
        this.linkHistoryView = "PopupMiniGame/ShockDeer/LichSuShockDeer";
    },

    CreateListBet() {

    },

    UpdateJackpotValue(jackpotValue) {
        cc.log("update jackpot:"+jackpotValue);
        this.lbJackpot.setMoney(jackpotValue);
    },

    SetLastPrizeValue(lastPrizeValue) {
        if(lastPrizeValue <= 0)
            return;
        this.lbLastPrize.string = Global.Helper.formatMoney(lastPrizeValue);
    },

    UpdateMoney(gold) {
        this.lbMoney.string = Global.Helper.formatString(Global.MyLocalization.GetText("TEXT_TOTAL_SCORE"), [Global.Helper.formatNumber(gold)]);//Global.Helper.formatNumber(gold);  
    },

    OnGetJackpotValue(listJackpotValue) {
        this.listJackpotValue = listJackpotValue;
        this.GetJackpotInfo();
    },

    GetJackpotInfo() {
        this.UpdateJackpotValue(this.listJackpotValue[this.slotView.roomID-1]);
    },

    UpdateWinValue(winValue) {
        cc.log("UpdateWinValue "+winValue);
        if(winValue <= 0)
            return;
        this.cacheValue += winValue;
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(this.cacheValue);
    },

    ResetValueCacheWin(){
        this.cacheValue = 0;
        this.lbTotalWin.getComponent("LbMonneyChange").reset();
        this.lbTotalWin.string ="";
    },

    ShowWinValueCache() {
        cc.log("ShowWinValueCache "+this.cacheValue);
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(this.cacheValue);
    },

    HideWinValueCache() {
        cc.log("HideWinValueCache ");
        this.lbTotalWin.string ="";
    },

    UpdateTotalBetValue(totalBetValue) {
        this.betValue = totalBetValue;
        if(totalBetValue == null)
            totalBetValue = 0;
        this.lbTotalBet.string = Global.Helper.formatString(Global.MyLocalization.GetText("TEXT_DETAIL_BET"), [Global.Helper.formatNumber(totalBetValue)]);
    },


    ClickSpin() {
        this.slotView.PlayClick();
        if(this.isCountPress && this.countTimePress >= 0.5) {
            // this.toggleAuto.isChecked = true;
            // this.ClickButtonSpeed(this.toggleAuto, null);
            this.isCountPress = false;
        } else {
            this.slotView.RequestSpin();
        }
    },

    ClickMaxBet() {
        let betCheck = Global.MainPlayerInfo.ingameBalance / 50;
        let index = 0;
        for(let i = 0; i < this.slotView.configRoom.length; i++) {
            if(betCheck > this.slotView.configRoom[i].Bet) {
                index = i;
            }
        }
        this.slotView.roomID = this.slotView.configRoom[index].RoomBetId;
        this.slotView.RequestGetAccountInfo();
        this.slotView.RequestGetJackpotInfo();
    },

    ClickButtonAuto(toggle, data) {
        this.slotView.PlayClick();
        this.slotView.AutoSpin(toggle.isChecked);
    },

    ClickButtonSpeed(toggle, data) {
        this.slotView.PlayClick();
        this.slotView.SpeedSpin(toggle.isChecked);
        this.slotView.AutoSpin(toggle.isChecked);
        // if(toggle.isChecked) {
        //     this.toggleAuto.isChecked = true;
        //     this.slotView.AutoSpin(true);
        // }
    },

    ClickNextRoom() {
        this.slotView.PlayClick();
        if(this.slotView.isFree || this.slotView.isBonus) {
            this.showCommandPopup(Global.MyLocalization.GetText("CANNOT_CHANGE_ROOM_WHEN_SPECIAL"), null);
            return;
        }
        this.slotView.roomID += 1;
        if(this.slotView.roomID > this.listBet.length) {
            this.slotView.roomID = 1;
        }
        
        this.slotView.RequestGetAccountInfo();
        this.slotView.RequestGetJackpotInfo();
    },

    ClickPrevRoom() {
        this.slotView.PlayClick();
        if(this.slotView.isFree || this.slotView.isBonus) {
            this.showCommandPopup(Global.MyLocalization.GetText("CANNOT_CHANGE_ROOM_WHEN_SPECIAL"), null);
            return;
        }
        this.slotView.roomID -= 1;
        if(this.slotView.roomID < 1) {
            this.slotView.roomID = this.listBet.length;
        }
        
        this.slotView.RequestGetAccountInfo();
        this.slotView.RequestGetJackpotInfo();
    },

    ClickHistory() {
        this.slotView.PlayClick();
        Global.UIManager.showMiniLoading();
        let menu = this;
        Global.DownloadManager.LoadPrefab(this.slotView.slotType.toString(),this.linkHistoryView, (prefab)=>{
            let history = cc.instantiate(prefab);
            menu.slotView.node.addChild(history, 10000);
            menu.slotView.historyView = history.getComponent("SlotHistoryView");
            menu.slotView.historyView.Init(menu.slotView);
            
        })
    },

    ClickTop() {
        this.slotView.PlayClick();
        Global.UIManager.showMiniLoading();
        Global.UIManager.showRankInGamePopup(this.slotView.slotType);
    },

    ClickBack() {
        this.slotView.PlayClick();
        // if(this.slotView.isSpin)
        //     return;
        if(Global.isChallenge == 0) {
            this.slotView.RequestLeaveRoom();
            require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
        }
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

    ClickMusic(toggle, data) {
        this.slotView.ChangeStateMusic(toggle.isChecked);
        this.slotView.ChangeStateSound(toggle.isChecked);
        this.toggleAudio.node.getChildByName("Background").active = !toggle.isChecked;
    },

    ClickSound(toggle, data) {
        this.slotView.ChangeStateSound(toggle.isChecked);
    },

    ClickVolume(toggle, data) {
        this.slotView.ChangeStateMusic(toggle.isChecked);
        this.slotView.ChangeStateSound(toggle.isChecked);
        if(toggle.isChecked) {
            Global.AudioManager.ChangeValueMusic(1);
            Global.AudioManager.ChangeValueSound(1);
        } else {
            Global.AudioManager.ChangeValueMusic(0);
            Global.AudioManager.ChangeValueSound(0);
        }
        this.toggleAudio.node.getChildByName("Background").active = !toggle.isChecked;
    },

    GetBetValue() {
        // return this.listBet[this.slotView.roomID-1];
        return this.betValue;
    },

    ActiveButtonMenu(active) {
        this.btnSpin.interactable = active;
    },

    showCommandPopup(description, event) {
        Global.UIManager.showCommandPopup(description, event);
    },

    CLickShowListButton(){
        if(Global.isTutorial >= 1) {
            return;
        }
        this.animBtnMenu.play("ShowMenuInGame");
    },

    CLickHideListButton(){
        this.animBtnMenu.play("HideMenuInGame");
    },

    update(dt) {
        if(this.isCountPress) {
            this.countTimePress += dt;
            if(this.countTimePress >= 0.5) {
                this.toggleAuto.isChecked = true;
                this.ClickButtonSpeed(this.toggleAuto, null);
                this.isCountPress = false;
            }
        }
    },

    ShowGameId(gameId) {
        this.lbSession.string = "#"+gameId;
    },

    UpdateSessionID(sessionID) {
        if(Global.isChallenge == 0 && Global.dataBattle == null)
            this.lbSession.string = "#"+sessionID;
    },
});
