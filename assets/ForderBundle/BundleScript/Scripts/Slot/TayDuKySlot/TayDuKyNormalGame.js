let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT_MAX = 0.4;
let TIME_TWEEN_PER_JACKPOT = 0.04;
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        wildContent : cc.Node,
        itemWild : cc.Node,
    },

    ctor() {
        this.listExtra = {};
        this.listJackpot = {};
        this.toDoList = null;
        this.numJackpot = 0;
        this.currentNumJackpot = 0;
        this.timerRumTweenJackpot = 0;
        this.WildPosData = null;
        this.listWild = [];
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
        this.resetWild();
        this._super(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
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
        toDoList.AddWork(()=>this.SetWildItem(toDoList), true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);

        toDoList.AddWork(()=>this.CheckBonus(winBonusValue, totalWin, extendMatrixDescription,toDoList),true);      
        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        }
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, numberPots, true, this.ParseLineData(listLineWinData), winNormalValue),true);
        if(!slotView.isFree && !this.slotView.isBonus){
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

    CheckBonus(winBonusValue, totalWin,extendMatrixDescription, toDoList){
        if(extendMatrixDescription != "[]" && extendMatrixDescription.length > 0){
            let valueBonus = totalWin - winBonusValue;
            this.slotView.bonusManager.ShowBonusGame(valueBonus, toDoList);
        }else{
            toDoList.DoWork();
        }
    },

    HideValueWildFree(){
        this.slotView.HideWildFree();
    },

    ParseMatrix(matrixData) {
        let matrixString = matrixData.split("|");
        let matrixStr = matrixString[0].split(",");
        let matrix = [];
        this.posData = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
            //id 2 la wild doc, chi xuat hien cot 2 va 4
            if(matrix[i] == 2){
                if(i == 1 || i == 3)
                    this.posData.push(i);
            }
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

    SetWildItem(toDoList) {
        cc.log(this.posData)
        if(this.posData.length == 0) {
            toDoList.DoWork();
        }
        let listItem = this.slotView.spinManager.listItem;
        for(let i = this.posData.length - 1; i >= 0; i--) {
            let jumpNew = cc.instantiate(this.itemWild);
            jumpNew.parent = this.wildContent;
            jumpNew.setPosition(cc.v2(listItem[this.posData[i]].node.getPosition().x, 0));
            jumpNew.active = true;
            jumpNew.scale = 1;
            let anim = jumpNew.getChildByName("Item").getComponent(sp.Skeleton);
            if(this.posData[i] == 1){
                anim.setAnimation(0, "MonkeyKingWild", true);
            }else if(this.posData[i] == 3){
                anim.setAnimation(0, "DuongtankWild", true);
            }        
        }//thoi gian cho ket thuc nhay
        this.scheduleOnce(()=>{
            toDoList.DoWork();
        } , 2);
    },

    resetWild() {
        for(let i = this.wildContent.children.length - 1; i >=0; i--) {
            this.wildContent.children[i].destroy();
        }
    },

});
