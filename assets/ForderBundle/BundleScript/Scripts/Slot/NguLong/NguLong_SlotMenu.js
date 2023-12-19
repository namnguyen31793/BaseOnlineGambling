cc.Class({
    extends:  require('SlotMenu'),
    ctor() {
        this.cacheTurnFree = 0;
        this.totalWinFree = 0;
        this.isSpeed = false;
        this.listJackpotValue = [];
        this.isCountPress = false;
        this.HelpPopup = null;
        this.RankPopup = null;
        this.HistoryPopup = null;
        this.SettingPopup = null;
        this.NameSettignPopup = 'AKTV_Popup_Setting';
        this.NameRankPopup = 'AKTV_Popup_Rank';
        this.inputValue = 50;
    },

    properties: {
        lbJackpot : [require("LbMonneyChange")],
        btnRoom : cc.Button,
        btnNextBuy : cc.Button,
        btnPreBuy : cc.Button,
        btnSpin : cc.Button,
        lbMoney : cc.Label,
        lbInput : cc.Label,
        lbBet : cc.Label,
        lbTotalBet : cc.Label,
        btnBuyFree : cc.Button,
        lb_CostBuyFree : cc.Label,
        lbTotalWin : cc.Label,
        lbSession : cc.Label,
        lbFreeTurn : cc.Label,
        NodeFreeTurn : cc.Node,
        toggleAuto : cc.Toggle,
        toggleSpeed : cc.Toggle,
        nodeParentPopup : cc.Node,
    }, 

     Init(slotController){
        this._super(slotController);
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            if(this.btnSpin.interactable) {
                this.isCountPress = true;
                this.countTimePress = 0;
            }else{
                this.toggleAuto.isChecked = false;
                this.ClickButtonAuto(this.toggleAuto, null);
            }
        });
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this.isCountPress = false;
        });
        this.btnSpin.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            this.isCountPress = false;
        });
        // this.UpdateMoney(0);
    },
    
    TouchCancel: function () {
        this.ClickSpin();
    },
    
    Show(){
        cc.log("show slot menu")
        // if(Global.uitype == 2){
        //     if(this.nodeUIBackButton)
        //         this.nodeUIBackButton.active = true;
        // }
        //check audio
    },

    Hide(){

    },

    OffButtonAuto(){

    },

    ActiveButtonMenu(active) {
        cc.log("active:"+active);
        this.btnSpin.interactable = active;
        if(this.slotController.isFree || this.slotController.isBonus ) {
            if(this.btnRoom)
                this.btnRoom.interactable = false;
            if(this.btnBuyFree)
                this.btnBuyFree.interactable = false;
            if(this.btnNextBuy)
                this.btnNextBuy.interactable = false;
            if(this.btnPreBuy)
                this.btnPreBuy.interactable = false;
        } else {
            if(this.btnRoom)
                this.btnRoom.interactable = active;
            if(this.btnBuyFree)
                this.btnBuyFree.interactable = active;
            if(this.btnNextBuy)
                this.btnNextBuy.interactable = active;
            if(this.btnPreBuy)
                this.btnPreBuy.interactable = active;
        }
    },

    UpdateWinValue(winMoney) {
        this.lbTotalWin.getComponent("LbMonneyChange").reset();
        if(winMoney <= 0)
            this.lbTotalWin.string = "";
        else
            this.lbTotalWin.getComponent("LbMonneyChange").setMoney(winMoney);
    },

    SetLastPrizeValue(lastPrizeValue) {
        if(lastPrizeValue <= 0)
            return;
        this.lbTotalWin.string = Global.Helper.formatMoney(lastPrizeValue);
    },

    SetLineData(lineData) {
        
    },

    UpdateSessionID(sessionID) {
        if(this.lbSession)
            this.lbSession.string = "#"+sessionID;
    },

    /*JACKPOT*/
    OnGetJackpotValue(listJackpotValue) {
        this.listJackpotValue = listJackpotValue;
        this.GetJackpotInfo();
    },


    UpdateJackpotValue(jackpotModel) {
        //this.lbJackpot.setMoney(jackpotValue);
        var data = JSON.parse(jackpotModel);
        this.lbJackpot[0].setMoney(data.BetValue * data.MiniJackpotMulti + data.MiniJackpotValue); 
        this.lbJackpot[1].setMoney(data.BetValue * data.MinorJackpotMulti + data.MinorJackpotValue);
    },
    /*----------*/

    /*BALANCE*/
    UpdateMoney(gold){
        if(this.lbMoney) {
            //this.lbMoney.string = Global.Helper.formatString(Global.MyLocalization.GetText("TEXT_TOTAL_MONEY"), [Global.Helper.formatNumber(gold)]);
            this.lbMoney.string = Global.Helper.formatNumber(gold);
        }
    },
    /*----------*/

    /*BET*/
    UpdateBetValue(totalBetValue) {
        if(this.lbBet)
            this.lbBet.string = Global.Helper.formatNumber(totalBetValue);//Global.Helper.formatMoney(this.GetBetValue());
        if(this.lbTotalBet)
            this.lbTotalBet.string = Global.Helper.formatNumber(totalBetValue* this.inputValue );
        if(this.lb_CostBuyFree)
            this.lb_CostBuyFree.string = Global.Helper.formatNumber(totalBetValue*CONFIG.MULTI_BET_BONANZA);
    },

    UpdateInputType(value){
        this.inputValue = value;
        if(this.lbInput)
            this.lbInput.string = Global.Helper.formatNumber(this.inputValue);
        if(this.lbBet)
            this.lbBet.string = Global.Helper.formatNumber(this.betValue* this.inputValue);
    },

    UpdateTotalBetValue(totalBetValue) {
        cc.log("yodate total bet");
        this.betValue = totalBetValue;
        if(totalBetValue == null)
            totalBetValue = 0;
        if(this.lbBet)
            this.lbBet.string = Global.Helper.formatNumber(totalBetValue* this.inputValue);
        if(this.lbTotalBet)
            this.lbTotalBet.string = Global.Helper.formatNumber(totalBetValue);
    },
    /*----------*/

    /* FREE*/
    ShowBoxTurnFree(isShow){
        if(this.NodeFreeTurn)
            this.NodeFreeTurn.active = isShow;
    },

    SetTextFree(freeSpinLeft){  
        this.cacheTurnFree = freeSpinLeft;
        if(this.lbFreeTurn)
            this.lbFreeTurn.string = freeSpinLeft.toString();
        //show effect sub and add turn
    },

    UpdateWinFree(valueWin){
        this.totalWinFree += valueWin;
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(this.totalWinFree);
        cc.sys.localStorage.setItem("Key_Total_Free"+this.slotController.getGameId() , this.totalWin);
    },

    ClearTotalWinFreeCache(){
        let win = this.totalWinFree;
        this.totalWinFree = 0;
        this.lbTotalWin.string = "";
        cc.sys.localStorage.setItem("Key_Total_Free"+this.slotController.getGameId() , this.totalWin);
        return win;
    },

    GetTotalWinCache(){
        this.totalWinFree = parseInt(cc.sys.localStorage.getItem("Key_Total_Free"+this.slotController.getGameId())) || 0;
        if(this.totalWinFree <= 0)
            return;
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(this.totalWinFree);
        
    },
    /*----------------*/

    /*ACTION BUTTON*/
    ClickSelectRoom(event, index) {
        //this.sound.PlayClick();
        if(this.slotController.isFree || this.slotController.isBonus) {
            this.showCommandPopup(Global.MyLocalization.GetText("CANNOT_CHANGE_ROOM_WHEN_SPECIAL"), null);
            return;
        }
        this.slotController.SelectRoom(index)
    },

    ClickNextInput() {
        //this.sound.PlayClick();
        if(this.slotController.isFree || this.slotController.isBonus) {
            this.showCommandPopup(Global.MyLocalization.GetText("CANNOT_CHANGE_ROOM_WHEN_SPECIAL"), null);
            return;
        }
        this.slotController.SelectInput(this.slotController.getInputId()+1)
    },

    ClickPrevInput() {
        //this.sound.PlayClick();
        if(this.slotController.isFree || this.slotController.isBonus) {
            this.showCommandPopup(Global.MyLocalization.GetText("CANNOT_CHANGE_ROOM_WHEN_SPECIAL"), null);
            return;
        }
        this.slotController.SelectInput(this.slotController.getInputId()-1)
    },

    ClickSpin() {
        Global.Helper.LogAction("click spin:"+this.slotController.getGameId());
        if(this.isCountPress && this.countTimePress >= 0.5) {
            // this.toggleAuto.isChecked = true;
            // this.ClickButtonAuto(this.toggleAuto, null);
            this.isCountPress = false;
        } else {
            this.slotController.RequestSpin();
        }
    },

    ClickButtonSpeed(toggle, data) {
        // this.slotView.PlayClick();
        this.slotController.SpeedSpin(toggle.isChecked);
    },

    ClickButtonAuto(toggle, data){
        if(toggle.isChecked){
            this.btnSpin.node.getChildByName("AnimSke").getComponent(sp.Skeleton).setAnimation(0,'anim_IdleRed(NoAnim)',true);
            this.btnSpin.node.getChildByName("Stop").active = true;
            this.btnSpin.node.getChildByName("Spin").active = false;
        }else{
            this.btnSpin.node.getChildByName("AnimSke").getComponent(sp.Skeleton).setAnimation(0,'anim_Hover',true);
            this.btnSpin.node.getChildByName("Stop").active = false;
            this.btnSpin.node.getChildByName("Spin").active = true;
        }
        // this.slotView.PlayClick();
        this.slotController.AutoSpin(toggle.isChecked);
    },

    update(dt) {
        if(this.isCountPress) {
            this.countTimePress += dt;
            if(this.countTimePress >= 0.5) {
                this.toggleAuto.isChecked = true;
                this.ClickButtonAuto(this.toggleAuto, null);
                this.isCountPress = false;
            }
        }
    },
    /*----------------*/

    ClickQuitGame(){
        this.slotController.CallLeaveGame();
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
    },

    ClickShowSetting(){
        if(this.SettingPopup == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupSetting", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.nodeParentPopup.addChild(effect);
                effect.setPosition(cc.v2(0,0));
                seft.SettingPopup = effect;
                seft.SettingPopup.getComponent(this.NameSettignPopup).Init(seft.slotController);
                seft.SettingPopup.active = true;

            });  
        }else{
            this.SettingPopup.active = true;
        }
    },

    ClickShowHelp(){
        if(this.HelpPopup == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupGuide", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.nodeParentPopup.addChild(effect);
                effect.setPosition(cc.v2(0,0));
                seft.HelpPopup = effect;
                seft.HelpPopup.getComponent('SlotGuide').Init(seft.slotController);
                seft.HelpPopup.active = true;

            });  
        }else{
            this.HelpPopup.active = true;
        }
    },

    ClickShowRank(){
        if(this.RankPopup == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupRank", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.nodeParentPopup.addChild(effect);
                effect.setPosition(cc.v2(0,0));
                seft.RankPopup = effect.getComponent(this.NameRankPopup);
                seft.RankPopup.Show(seft.slotController);

            });  
        }else{
            this.RankPopup.Show(this.slotController);;
        }
    },

    ClickShowHistory(){
        if(this.HistoryPopup == null){
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupHistory", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.nodeParentPopup.addChild(effect);
                effect.setPosition(cc.v2(0,0));
                seft.HistoryPopup = effect.getComponent('SlotHistory');
                seft.HistoryPopup.Show(seft.slotController.getGameId());
            });  
        }else{
            this.HistoryPopup.Show(this.slotController.getGameId());;
        }
    },
});
