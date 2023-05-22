cc.Class({
    extends: cc.Component,

    ctor() {
        this.slotView = null
        this.isWin = true;
    },
    properties: {
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
        currentJackpotValue, isTakeJackpot, playerInfo, otherInfo) {
       
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        //slotView.UpdateMatrix(this.ParseMatrix(matrix));
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.UpdateMatrix(this.ParseMatrix(matrix)),false);
        toDoList.AddWork(()=>slotView.GetSpinManagerResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        toDoList.AddWork(()=>slotView.UpdateInfoCharacter(playerInfo, otherInfo),true);
        //sau nay la doan dien danh nhau
        // toDoList.Wait(3);
        toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue),true);

        // toDoList.AddWork(()=>slotView.CheckJackpot(isTakeJackpot, totalWin),false);
        slotView.CheckTimeShowPrize(winNormalValue);
        
        toDoList.AddWork(()=>slotView.CheckEndTurnResult(),false);
        
        toDoList.Play();
    },

    ParseMatrix(matrixData) {
        cc.log(matrixData);
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
        
    },

    HideEffectPreWin(index) {
        
    },

    HideAllEffectPreWin() {
        
    },
});
