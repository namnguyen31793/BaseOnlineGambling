let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT_MAX = 0.4;
let TIME_TWEEN_PER_JACKPOT = 0.04;
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        listjackpotObj : [cc.Node],
        effectjackpotObj : cc.Node,
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
        
        /*he so gem hoac so tich luy queen trong free*/
        let numberPots = this.ParseExtendMatrix(matrix);
       
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
            toDoList.AddWork(()=>this.ShowPotsWin(numberPots, totalWin, toDoList),true);
        }
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, numberPots, true, this.ParseLineData(listLineWinData), winNormalValue),true);
        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    ShowPotsWin(numberPots, totalWin, todolistCall){
        if(numberPots < 3)
            todolistCall.DoWork();
        else{
            this.toDoList.CreateList();
            this.toDoList.Wait(0.3);
            this.toDoList.AddWork(()=>this.ShowEffectPot(numberPots),false);  //show
            this.toDoList.Wait(2.9);
            this.toDoList.AddWork(()=>this.SetEffectPot(numberPots, totalWin),false);  //set value
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>this.AnimHideEffectPot(),false);  //show
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>this.HideEffectPot(),false); 
            this.toDoList.AddWork(()=>todolistCall.DoWork(),false);  //play continue todolist view
            this.toDoList.Play();
        }
    },

    ShowEffectPot(numberPots){
        let nameSkin = "pot"+numberPots
        //anim show
        this.slotView.effectManager.AnimShowNotifyWinPot(nameSkin)
    },

    SetEffectPot(numberPots, totalWin){
        let valueWin = this.slotView.GetValueJackpot(numberPots)
        if(numberPots > 9){
            numberPots = 9;
            valueWin = totalWin;
        }
        this.effectjackpotObj.parent = this.listjackpotObj[numberPots-3];
        this.effectjackpotObj.setSiblingIndex(0);
        this.effectjackpotObj.setPosition(cc.v2(0, 0));
        this.effectjackpotObj.active = true;
        this.listjackpotObj[numberPots-3].setSiblingIndex(6);
        //show money
        this.slotView.effectManager.SetValueWinPot(valueWin)
    },

    AnimHideEffectPot(){
        this.slotView.effectManager.AnimHideNNotifyWinPot()
    },

    HideEffectPot(){
        this.slotView.effectManager.HideNotifyWinPot();
    },

    ResetEffectPots(){
        this.effectjackpotObj.active = false;
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
        this.ResetEffectPots();
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
