

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.THAI_BLOSSOMS;
        this.lineData = 50;
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    OnSpinDone() {
        this.normalManager.CheckBonus();
    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.ResetUINewTurn();
        let r = Global.RandomNumber(1,100);
        if(r> 60)
            this.effectManager.PlayAnimLaBay();
    },

    CheckBonus(bonusValue, total, accountBalance, bonusTurn) {
        this.toDoList.DoWork();
    },

    SetFreeSpin(numberFree, isNotify = false, lineWin, winNormalValue, totalWin) {
        this.freeManager.ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    HideWildFree(){
        this.spinManager.HideWildFree();
    },
    
    ActiveColorButtonNormalGame(){
        this.itemManager.ActiveColorButtonNormalGame();
    },
    
    EndAnimPreWin(freeTurn, bonusTurn) {
        if(!this.isFree && !this.isBonus) {
            if(freeTurn > 0 || bonusTurn > 0) {
                if(freeTurn > 0)
                    this.spinManager.EndItemBonusPreWin();
                if(bonusTurn > 0)
                    this.spinManager.EndItemFreePreWin();
                this.scheduleOnce(()=>{
                    this.EndAllItemPreWin();
                } , 1.5);
            } else {
                this.EndAllItemPreWin();
            }
        } else {
            this.EndAllItemPreWin();
        }
    },

    EndAllItemPreWin() {
        this.spinManager.EndAllItemPreWin();
        this.toDoList.DoWork();
    },

    OnUpdateLastMatrix(lastMatrix) {
        if(lastMatrix.length != 0) {
            this.normalManager.SetLastViewMatrix(lastMatrix);
        }
    },

    PlayAnimPullCurtain(){
        this.effectManager.PlayAnimPullCurtain();
    },

    SetTypeJackpot(type){
        this.effectManager.SetTypeJackpot(type);
    },

    ShowNotifyWinFree(num){
        this.effectManager.ShowNotifyWinFree(num);
    },

    HideNotifyWinFree(){
        this.effectManager.HideNotifyWinFree();
    },

    UpdateNumberFreeDrop(num){
        this.freeManager.UpdateNumberFreeDrop(num);
    },

    SetLastPrizeDrop(num){
        this.freeManager.SetLastPrizeDrop(num*this.GetBetValue());
    },

    ClearWildEndFree(){
        this.normalManager.ClearWildEndFree();
    },

   
    PlayEffectHoaBay() {
        this.effectManager.PlayAnimHoaBay();
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
});
