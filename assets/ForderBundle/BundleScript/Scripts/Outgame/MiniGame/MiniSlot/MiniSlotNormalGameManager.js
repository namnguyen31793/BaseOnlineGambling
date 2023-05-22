
cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {

    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot) {
        let multi = this.ParseMulti(matrix);
        if(isTakeJackpot)
            winNormalValue = totalWin;
        this.slotView.UpdateMulti(multi);
        this.slotView.UpdateMatrix(this.ParseMatrix(matrix));
        let mAccountBalance = accountBalance;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        if(winNormalValue > 0 && !isTakeJackpot){
            toDoList.AddWork(()=>slotView.menuView.FakeWinValue(totalWin/multi),false);
            toDoList.AddWork(()=>slotView.ShowEffectMulti(),true);
            toDoList.Wait(0.1);
        }
        // toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, isTakeJackpot, false),true);
        // if(totalWin > winNormalValue)
        toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue,totalWin, isTakeJackpot,false),true);
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        // toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        
        toDoList.Play();


        // if(isTakeJackpot)
        //     winNormalValue = totalWin;
        // this.slotView.UpdateMulti(this.ParseMulti(matrix));
        // this.slotView.UpdateMatrix(this.ParseMatrix(matrix));
        // this.slotView.UpdateMoneyNormalGame(winNormalValue, accountBalance-winBonusValue);

        // let acEffectMulti = cc.callFunc(() => {
        //     if(winNormalValue > 0 && !isTakeJackpot)
        //         this.slotView.ShowEffectMulti();
        // });
        // let acUpdateSession = cc.callFunc(() => {
        //     this.slotView.UpdateSessionID(spinId);
        // });
        // let acUpDateLineWinData = cc.callFunc(() => {
        //     this.slotView.UpdateLineWinData(this.ParseLineData(listLineWinData));
        // });
        // let acUpdateMoney = cc.callFunc(() => {
        //     this.slotView.UpdateMoneyResult(winNormalValue, isTakeJackpot);
        // });
        // let acUpdateMoneyAftetMulti = cc.callFunc(() => {
        //     if(totalWin > winNormalValue)
        //         this.slotView.UpdateMoneyResultMulti(winNormalValue,totalWin, isTakeJackpot);
        // });
        // let acUpdateJackpotValue = cc.callFunc(() => {
        //     this.slotView.UpdateJackpotValue(currentJackpotValue);
        // });

        // let acShowFree = cc.callFunc(() => {
        //     this.slotView.SetFreeSpin(freeSpinLeft, true);
        // });
        // let acCheckHideFree = cc.callFunc(() => {
        //     this.slotView.CheckHideFreeUI();
        // });

        // let acActiveButtonMenu = cc.callFunc(() => {
        //     this.slotView.ActiveButtonMenu();
        // });
        // let acCheckJackpot = cc.callFunc(() => {
        //     this.slotView.CheckJackpot(isTakeJackpot, totalWin);
        // });
        // let acCheckAuto = cc.callFunc(() => {
        //     this.slotView.ActionAutoSpin();
        // });
        // let timeDelayMulti = 0;
        // if(winNormalValue > 0 && !isTakeJackpot)
        //     timeDelayMulti = 0.5+1.5/this.slotView.speed;
        
        // let action = null;
        // let timeDelay1 = 1.5 / this.slotView.speed;
        // let timeDelay2 = 1;
        // let isBigWin = this.slotView.CheckBigWin(winNormalValue);
        // if(isBigWin){
        //     timeDelay1 = timeDelay1 * 1.5;
        //     timeDelay2 = timeDelay2 * 1.5;
        //     timeDelayMulti = timeDelay1 * 1.5;
        // }
        // if(winBonusValue == 0 && freeSpinLeft == 0 && !isTakeJackpot) {
        //     action = cc.sequence(
        //         acUpdateSession, acUpDateLineWinData, acUpdateMoney, acUpdateJackpotValue, cc.delayTime(timeDelay1), acEffectMulti, cc.delayTime(timeDelayMulti),
        //         acUpdateMoneyAftetMulti, cc.delayTime(timeDelay2), acShowFree, acCheckHideFree, acActiveButtonMenu, acCheckAuto
        //     );
        // }
        // if(freeSpinLeft > 0) {
        //     action = cc.sequence(
        //         acUpdateSession, acUpDateLineWinData, acUpdateMoney, acUpdateJackpotValue, cc.delayTime(timeDelay1), acUpdateMoneyAftetMulti, cc.delayTime(timeDelayMulti),
        //         acShowFree, acCheckHideFree, acActiveButtonMenu, cc.delayTime(timeDelay2), acCheckAuto
        //     );
        // } 
        // if(isTakeJackpot) {
        //     action = cc.sequence(
        //         acUpdateSession, acUpDateLineWinData, acUpdateMoney, acUpdateJackpotValue, cc.delayTime(1), acEffectMulti, acUpdateMoneyAftetMulti,
        //         acShowFree, acCheckHideFree, acActiveButtonMenu, acCheckJackpot
        //     );
        // }
        // this.slotView.GetSpinResult(action);
    },

    ParseMatrix(matrixData) {
        let data = matrixData.split("|");
        let matrixStr = data[0].split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },

    ParseMulti(matrixData) {
        let data = matrixData.split("|");
        let multi = parseInt(data[1]);
        return multi;
    },

    ParseLineData(lineWinData) {
        cc.log(JSON.parse(lineWinData));
        return JSON.parse(lineWinData);
    },
});
