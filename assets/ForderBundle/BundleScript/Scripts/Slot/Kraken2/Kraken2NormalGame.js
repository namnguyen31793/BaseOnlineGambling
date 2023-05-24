let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT_MAX = 0.4;
let TIME_TWEEN_PER_JACKPOT = 0.04;
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
    },

    ctor() {
        this.listExtra = {};
        this.listJackpot = {};
        this.toDoList = null;
        this.numJackpot = 0;
        this.currentNumJackpot = 0;
        this.timerRumTweenJackpot = 0;
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot) {
        if(isTakeJackpot)
            winNormalValue = totalWin;
            
        let matrixInfo = this.ParseMatrix(matrix)
        this.slotView.UpdateMatrix(matrixInfo);
       
        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);

        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        }
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, this.ParseLineData(listLineWinData), winNormalValue),true);
        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },



    CheckBonus(){

    },

    HideValueWildFree(){
        this.slotView.HideWildFree();
    },

    ParseMatrix(matrixData) {
        let matrixString = matrixData.split("|");
        let matrixStr = matrixString[0].split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },

    ParseExtendMatrix(matrixData) {
        let matrixString = matrixData.split("|");
        return parseInt(matrixString[1]);
    },


    ResetUINewTurn(){
        if(this.slotView.isFree)
            this.HideValueWildFree();
        else
            this.slotView.ActiveColorButtonNormalGame();
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },
});
