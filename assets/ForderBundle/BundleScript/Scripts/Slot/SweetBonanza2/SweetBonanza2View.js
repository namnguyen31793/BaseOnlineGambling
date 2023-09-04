

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.SWEET_BONANZA;
        this.lineData = 0;
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
        this.normalManager.resetMulti();
    },

    ShowBoxMulti(isFree){
        this.normalManager.showBoxMulti(isFree);
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

    SetFreeSpin(numberFree, isNotify = false, winNormalValue = 0, extend = 1, listPosExtend = []) {
        this.freeManager.ShowFree(numberFree, isNotify, winNormalValue, extend, listPosExtend);
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

    DropMatrix(matrix, listMultiWild, winMoneyStep, index){
        this.spinManager.DropMatrix(matrix, listMultiWild, winMoneyStep, index);
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

    ShowNotifyWinFree(num){
        this.effectManager.ShowNotifyWinFree(num);
    },

    HideNotifyWinFree(){
        this.effectManager.HideNotifyWinFree();
    },

    playBoomSound(){
        this.soundControl.PlayBoom();
    },

    ShowMoneyWinStep(winNormalValue){
        cc.log("ShowMoneyWinStep winNormalValue "+winNormalValue);
        this.menuView.UpdateWinValue(winNormalValue);
        if(this.isFree){
            this.freeManager.AddTotalWin(winNormalValue);
        }
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        cc.log("UpdateMoneyResult winNormalValue "+winNormalValue+" - totalWin "+totalValue);
        require("WalletController").getIns().TakeBalance(this.slotType)
        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    this.PlayWinMoney();
                    if(isWaitRunMoneyWin) {
                        this.scheduleOnce(()=>{
                            this.toDoList.DoWork();
                        } , 1);  
                    } else {
                        this.toDoList.DoWork();
                    }
                } else {
                    this.menuView.ResetValueCacheWin();
                    //this.menuView.HideWinValueCache();
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList, true, false);
                }
            } else {
                this.menuView.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        }else{
            this.menuView.ResetValueCacheWin();
            //this.menuView.HideWinValueCache();
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList, false);
        }  
    },

    GetBetValue() {
        if(this.menuView)
            return this.menuView.GetBetValue();
        else return this.totalBetValue;
    },

});
