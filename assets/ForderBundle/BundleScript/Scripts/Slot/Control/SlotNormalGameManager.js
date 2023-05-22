

cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null
        this.isWin = true;
    },

    properties: {
        effectPreWin : [cc.Node],
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
        this.slotView.OnUpdateMoney(accountBalance);
        this.slotView.SetFreeSpin(freeSpin);
        this.slotView.UpdateTotalBetValue(totalBetValue);
        this.slotView.UpdateJackpotValue(jackpotValue);
        this.slotView.SetLastPrizeValue(lastPrizeValue);
        this.slotView.SetLineData(lineData);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot) {
        if(isTakeJackpot)
            winNormalValue = totalWin;
        this.slotView.UpdateMatrix(this.ParseMatrix(matrix));
        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true),true);
        toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn, isTakeJackpot),true);
        toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, isTakeJackpot, false),true);
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        // toDoList.AddWork(()=>slotView.CheckJackpot(isTakeJackpot, totalWin),false);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        
        toDoList.Play();
    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },
    
    ParseLineData(lineWinData) {
        let lineStr = lineWinData.split(",");
        let result = [];
        if(lineWinData === "")
            return result;
        for(let i = 0; i < lineStr.length; i++) {
            result[i] = parseInt(lineStr[i]);
        }
        return result;
    },

    CheckTimeShowPrize(prizeValue) {
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(prizeValue > 0) {
            let isBigWin = this.slotView.CheckBigWin(prizeValue);
            this.isWin = true;
            if(isBigWin)
                this.slotView.toDoList.Wait(1);
            else if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(2);
                else this.slotView.toDoList.Wait(2);
            } else{
                this.slotView.toDoList.Wait(2);
            }
            
        } else {
            this.isWin = false;
            if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(0.9);
                else this.slotView.toDoList.Wait(0.9);
            }             
            else  {
                this.slotView.toDoList.Wait(0.2);
            }
        }
    },

    ShowEffectPreWin(index) {
        // this.HideAllEffectPreWin();
        this.effectPreWin[index].active = true;
    },

    HideEffectPreWin(index) {
        this.effectPreWin[index].active = false;
    },

    HideAllEffectPreWin() {
        for(let i = 0; i < this.effectPreWin.length; i++) {
            this.effectPreWin[i].active = false;
        }
    },

    /*
    ParseLineData(lineWinData) {
        return JSON.parse(lineWinData);
    },
    */
    EndBonus(){
        
    },
});
