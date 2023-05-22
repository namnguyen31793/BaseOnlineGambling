
let NUMBER_COLUM_MATRIX = 8;
let DEFAUT_POS_SCROLL = 750;
let DEFAUT_POS_EFFECT_SCROLL = 430;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {

        content_Scroll : cc.Node,
        content_Moc_Scroll : cc.Node,
        animNewColum : cc.Animation,
        animWaitColum : cc.Animation,
    },

    ctor() {
        this.timerCurain = 0;
        this.isPlayTweenCurain = false;
        this.listLengthmatrix;
        this.toDoList = null;
        this.timerJackpot = 0;
        this.numJackpot = 0;
        this.currentNumJackpot = 0;
        this.timerRumTweenJackpot = 0;
        this.jumpPosData = null;
        this.listWild = [];
        this.listEffect = [];
        this.extandMatrixNextTurn = 3;
        this.extandMatrixThisTurn = 3;
        this.isNewColum = false;
        this.isResetColum = false;
        this.listExtraFree = [];
        this.idItemCheckFree = 0;
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },
    

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.slotView.OnUpdateMoney(accountBalance);
        //let extend = this.ParseExtendData(extandMatrix);
        this.extandMatrixThisTurn = extandMatrix;
        this.slotView.SetFreeSpin(freeSpin);
        this.slotView.UpdateTotalBetValue(totalBetValue);
        this.slotView.UpdateJackpotValue(jackpotValue);
        this.slotView.SetLastPrizeValue(lastPrizeValue);
        this.slotView.SetLineData(lineData);
        //this.slotView.toDoList.DoWork();
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
            
        if(isTakeJackpot)
            winNormalValue = totalWin;
        let matrixInfo = this.ParseMatrix(matrix)
        this.ParseAddFree(matrix);
        this.slotView.UpdateMatrix(matrixInfo);
        let listLineWin = this.ParseLineData(listLineWinData);

        let lengMatriParseExtend = this.ParseLengthColum(extendMatrixDescription);
        this.idItemCheckFree = this.ParseIdItemFree(extendMatrixDescription);
       
        //neu turn nay thang o man thuong va khong phai turn dau an free thi tang cot
        if(totalWin > 0 && !this.slotView.isFree && freeSpinLeft <= 0){
            this.extandMatrixNextTurn = parseInt(lengMatriParseExtend)+1;
            this.isNewColum = true;
        }
        //thang trong man free tang cot
        else if(totalWin > 0 && this.slotView.isFree){
            this.extandMatrixNextTurn = parseInt(lengMatriParseExtend)+1;
            this.isNewColum = true;
        }
        //neu thua ma khong phai free thi reset
        else if(!this.slotView.isFree){
            this.extandMatrixNextTurn = 3;
            this.isResetColum = true;
        }

        this.extandMatrixThisTurn = parseInt(lengMatriParseExtend);

        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>this.CheckItemAddFree(), false);
        let timeWaitEff = 0;
        if(this.listExtraFree.length > 0)
            timeWaitEff = 2;
        toDoList.Wait(timeWaitEff);
        toDoList.AddWork(()=>slotView.UpdateNumberWay(listLineWin.length),false);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, listLineWin, winNormalValue, totalWin, this.idItemCheckFree),true);

        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWin),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        //toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn),true);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        //check item
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckBonus(){

    },

    CheckItemAddFree(){
        let listMulti = this.listExtraFree;
        if(listMulti.length > 0){
            for(let temp in listMulti){
                this.slotView.playTakeExtraFree();
                this.slotView.ShowExtra(parseInt(temp), parseInt(listMulti[temp]));
            }
        }
    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        let matrix = [];
        this.listExtraFree = []
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },

    ParseAddFree(matrixData) {
        let matrixStr = matrixData.split(",");
        //let matrix = [];
        this.listExtraFree = []
        for(let i = 0; i < matrixStr.length; i++) {
            //matrix[i] = parseInt(matrixStr[i]);
            //if(matrix[i] == 3){ 
            let value = matrixStr[i].split(".")
            if(value.length > 1){
                this.listExtraFree[i.toString()] = parseInt(value[1]);
            }
            //}
        }
        cc.log(this.listExtraFree);
    },

    ResetUINewTurn(){
        if(this.slotView.isFree){
            //reset tao hop qua moi
        }
        else{
            if(this.isResetColum)
                this.ActiveColorButtonNormalGame();
        }   
        this.isNewColum = false;
        this.isResetColum = false;
    },

    ActiveColorButtonNormalGame(){
        this.slotView.ActiveColorButtonNormalGame();
    },

    //reset luc het free
    resetWild() {
        this.listWild = [];

    },

    ClearWildEndFree() {
        for(let i = this.listWild.length - 1; i >= 0; i--) {
            this.listWild[i].data.destroy();
            this.listWild.splice(i, 1);
        }
        this.listWild = [];
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },

    ScrollContentSpin(colum){
        let pos = DEFAUT_POS_SCROLL - 220*(colum -3);

        this.content_Scroll.runAction(cc.moveTo(0.5, cc.v2(pos, 0)).easing(cc.easeSineOut()));
        this.content_Moc_Scroll.runAction(cc.moveTo(0.5, cc.v2(pos, 0)).easing(cc.easeSineOut()));
        if(colum != 3 && this.isNewColum){
            this.animNewColum.node.setPosition(cc.v2(DEFAUT_POS_EFFECT_SCROLL,0));
            this.animNewColum.node.runAction(cc.moveTo(0.5, cc.v2(DEFAUT_POS_EFFECT_SCROLL-220, 0)).easing(cc.easeSineOut()));
            this.animNewColum.play("NewColumAnim");
        }  
    },
    
    ParseLineData(lineWinData) {
        let lineStr = lineWinData.split(",");
        let result = [];
        
        let check = "[";
        if(lineWinData.indexOf(check) !== -1){
            let model = JSON.parse(lineWinData);
            for(let i = 0; i < model.length; i++) {
                result[i] = model[i].LineID;
            }
            return result;
        }
        if(lineWinData === "" || lineWinData === "[]")
            return result;
        for(let i = 0; i < lineStr.length; i++) {
            result[i] = parseInt(lineStr[i]);
        }
        return result;
    },

    ParseLengthColum(extendMatrixDescription){
        let listExtend = extendMatrixDescription.split(".");
        let extend = parseInt(listExtend[0]);
        return extend;
    },

    ParseIdItemFree(extendMatrixDescription){
        let listExtend = extendMatrixDescription.split(".");
        let id = parseInt(listExtend[1]);
        return id;
    },

    CheckTimeShowPrize(prizeValue) {
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(prizeValue > 0) {
            let isBigWin = this.slotView.CheckBigWin(prizeValue);
            this.isWin = true;
            if(isBigWin)
                this.slotView.toDoList.Wait(2.5);
            else if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(1.5);
                else this.slotView.toDoList.Wait(1.5);
            } else{
                this.slotView.toDoList.Wait(1);
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
});
