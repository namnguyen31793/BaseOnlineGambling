

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.CHINA_FALL;
        this.lineData = 50;
    },

    CallRequestGetJackpotInfo() {
        this.schedule(() => {
            this.RequestGetJackpotInfo();
        }, 5);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extandMatrix) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extandMatrix);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
    },

    OnSpinDone() {
        this.normalManager.CheckBonus();
    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.resetLengthMatrix();
        this.menuView.UpdateWinValue(0);
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

    SetFreeSpin(numberFree, extendMatrix, isNotify = false, winNormalValue = 0) {
        this.freeManager.ShowFree(numberFree, extendMatrix, isNotify, winNormalValue);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    SetWildFree(listMultiWild){
        this.spinManager.SetWildFree(listMultiWild);
    },

    HideWildFree(){
        this.spinManager.HideWildFree();
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
            //let extendMatrix = this.normalManager.ParseExtendMatrix(lastMatrix);
            this.spinManager.UpdateMatrix(matrix, true);
            if(this.isFree)
                this.SetWildFree(this.listMultiWild);
            
        }
    },

    DropMatrix(matrix, winMoneyStep, multiStep, index){
        this.spinManager.DropMatrix(matrix, winMoneyStep, multiStep, index);
    },

    UpdateNumberMultiDrop(){
        this.freeManager.UpdateNumberMultiDrop();
    },

    UpdateNumberFreeDrop(num){
        this.freeManager.UpdateNumberFreeDrop(num);
    },

    SetLastPrizeDrop(num){
        this.menuView.SetLastPrizeDrop(num*this.GetBetValue());
    },

    PlayUpdateMoneyResultFree(winNormalValue, extandMatrix){
        this.spinManager.ClearLightResultFree();
        this.effectManager.ShowWinMoneyFree(winNormalValue, extandMatrix);
    },

    FlyLightToResultFree(winNormalValue, extandMatrix){
        this.effectManager.ShowWinMoney(winNormalValue);
        this.spinManager.FlyLightToResultFree();
    },
    
    CheckBigWin(winMoney) {
        return this._super(winMoney, 6)
    },

    ShowNotifyWinFree(num){
        this.effectManager.ShowNotifyWinFree(num);
    },

    HideNotifyWinFree(){
        this.effectManager.HideNotifyWinFree();
    },

    UpdateLengthMatrix(lengthmatrix){
        this.spinManager.UpdateLengthMatrix(lengthmatrix);
    },

    playBoomSound(){
        this.soundControl.PlayBoom();
    },
 
    ShowMoneyWinStep(winNormalValue){
        this.menuView.UpdateWinValue(winNormalValue);
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotType)
        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    this.PlayWinMoney();
                    //this.effectManager.ShowWinMoney(winNormalValue);
                    if(isWaitRunMoneyWin) {
                        this.scheduleOnce(()=>{
                            this.toDoList.DoWork();
                        } , 1);  
                    } else {
                        this.toDoList.DoWork();
                    }
                } else {
                    //this.menuView.ResetValueCacheWin();
                    this.menuView.HideWinValueCache();
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList, true, false);
                }
            } else {
                this.toDoList.DoWork();
            }
        }else{
            //this.menuView.ResetValueCacheWin();
            this.menuView.HideWinValueCache();
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList, false);
        }  
    },
});
