

cc.Class({
    extends: require("SlotView"),

    ctor(){
        this.maxTotalBetValue = 0;
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.SLOT_9_POTS;
        this.lineData = 20;
    },

    AddScheduleAnimWait(){
        //show all line start
        this.drawLineManager.ShowAllLineStart();
       this._super();
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
    },


    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    OnSpinDone() {
        this.normalManager.CheckBonus();
    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.ResetUINewTurn();
    },

    CheckBonus(bonusValue, total, accountBalance, bonusTurn) {
        if(bonusValue > 0) {
            if(this.isBonus) {
                this.bonusManager.EndBonus(bonusValue, accountBalance);
            } else {
                this.isBonus = true;
                this.PlayBonusStart();
                this.bonusManager.ShowBonusGame(bonusTurn);
            }
        } else {
            if(this.isBonus) {
                this.bonusManager.CheckBonus(bonusTurn);
            } else {
                this.scheduleOnce(()=>{
                    this.toDoList.DoWork();
                } , 1);
            }
            this.normalManager.CheckBonus();
        }
    },

    SetFreeSpin(numberFree, extendMatrix, isNotify = false, lineWin, winNormalValue) {
        this.freeManager.ShowFree(numberFree, extendMatrix, isNotify, lineWin, winNormalValue);
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
            let matrix = this.normalManager.ParseMatrix(lastMatrix);
            let extendMatrix = this.normalManager.ParseExtendMatrix(lastMatrix);
            this.spinManager.UpdateMatrix(matrix, true);
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

    UpdateJackpotValue(listJackpotValue) {
        this.menuView.UpdateJackpotValue(listJackpotValue);
    },

    GetValueJackpot(numberPots){
        let value = 0;
        switch(numberPots){
            case 3:
                value = this.menuView.GetBetValue() * 1;
                break;
            case 4:
                value = this.menuView.GetBetValue() * 3;
                break;
            case 5:
                value = this.menuView.GetBetValue() * 8;
                break;
            case 6:
                value = this.menuView.GetBetValue() * 15;
                break;
            case 7:
                value = this.menuView.GetBetValue() * 30;
                break;
            case 8:
                value = this.menuView.GetBetValue() * 50;
                break;
        }
        return value;
    },

    UpdateTotalBetValue(betValue) {
        cc.log("update total bet value:"+betValue);
        this.totalBetValue = (betValue/20) * this.lineData;
        this.maxTotalBetValue = betValue;
        this.menuView.UpdateTotalBetValue(betValue);
    },

    UpdateLineBet() {
        this.totalBetValue = (this.maxTotalBetValue/20) * this.lineData;
        this.menuView.UpdateTotalBetValue(this.totalBetValue );
    },

    GetBetValue() {
        return this.totalBetValue;
    },
});
