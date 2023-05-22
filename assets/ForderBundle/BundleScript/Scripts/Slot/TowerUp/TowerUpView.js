cc.Class({
    extends: require("SlotView"),

    ctor(){
        this.CurrentMulti = 0;
        this.MultiSave = 0; //for effect mutil
    },

    properties: {
        backgroundView : require("TowerUpBackground"),
    },

    onLoad() {
        this._super();
        this.backgroundView.Init(this);
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.CLIMB_STAIRS;
        this.lineData = 50;
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
        this.normalManager.UpdateMutil(extandMatrix);
        this.PlayAnimBg();
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    CheckBonus(bonusValue, total, accountBalance, bonusTurn, isTakeJackpot) {

    },

    SetFreeSpin(numberFree, isNotify = false, lineWin, winNormalValue, totalWin) {
        this.freeManager.ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin);
    },

    ShowMoneyMultiResult(winNormalValue, multi) {
        this.effectManager.CreateWinMoneyWithMutl(winNormalValue/multi, winNormalValue, multi);
    },

    HideMoneyMultiResult() {
        this.effectManager.HideWinMoneyWithMulti();
    },

    CreateListUser() {
        //add de bo qua add list user, tai vi db chua co bet
        // this.contentUser.x = -440;
        this._super();
    },

    ResetEndFree(){
        this.CurrentMulti = 1;
        this.MultiSave = 1;
        // this.backgroundView.ResetTown();
        this.normalManager.UpdateUIMutilNormal();
    },

    ShowMultiFree(){
        this.normalManager.UpdateUIMutilFree();
    },
    //update cache
    AnimTower(multi){
        this.CurrentMulti = multi;
    },
    //click spin thi check co len tang hay khong
    PlaySpin(){
        this.PlayAnimBg();
        this._super();
    },
    //ham check bg nang tang hay reset
    PlayAnimBg(){
        this.backgroundView.PlayAnimFloor(this.CurrentMulti);        
    },

    //dien anim item roi nguoc
    PlaySpinFallTowerFall(){
        this.spinManager.PlayEffectSpinTowerFall();
    },
    
    ActiveButtonMenu() {
        this.MultiSave = this.CurrentMulti;
        this._super();
    },

    CheckStateAuto() {
        this._super();
    },
    //prewin
    ShowEffectPreWin(index) {
        
    },

    HideEffectPreWin(index) {
    },

    HideAllEffectPreWin() {
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {

        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
            // if(winNormalValue >0)
            //     isBigWin = true;
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    if(!this.isBattle) {
                        require("WalletController").getIns().TakeBalance(this.slotType)
                    }
                    this.UpdateWinValue(winNormalValue);
                    this.toDoList.DoWork();
                } else {
                    this.menuView.ResetValueCacheWin();
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList, true, true, true);
                }
            } else {
                this.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        }else{
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList, true, true);
        }  
    },

    ShowEffectLightBG(){
        this.backgroundView.PlayAnimLight();
    },

    CheckShowFreeAds() {
        return false;
    },
});
