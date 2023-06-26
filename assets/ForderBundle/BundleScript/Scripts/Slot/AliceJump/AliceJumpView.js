

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.ALICE_JUMP;
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
        this.soundControl.HandleMatrixSound(matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
                currentJackpotValue, isTakeJackpot, extendMatrixDescription);
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
            let matrix = this.normalManager.ParseMatrix(lastMatrix);
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

    playAnimShowGift(isShow){
        this.normalManager.playAnimShowGift(isShow);
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
});
