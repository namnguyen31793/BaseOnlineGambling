
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        wildContent : cc.Node,
        itemWildJump : cc.Node,
        effectWin : cc.Node,
        posNumberFree : cc.Node,
        posValueText : cc.Node,
        itemWildExpading : cc.Node,
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
        this.listWildStay = [];
        this.listDataWildStay = {};
        this.listWildExpanding = [];
        this.listDataWildExpanding = {};
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },
    

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.slotView.OnUpdateMoney(accountBalance);
        //let extend = this.ParseExtendData(extandMatrix);
        this.resetWild();
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

        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            this.ClearWildItem(toDoList);
        }, true);
        toDoList.AddWork(()=>{
            let matrixInfo = this.ParseMatrix(matrix)
            this.slotView.UpdateMatrix(matrixInfo);
        }, false);
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>{
            this.SetWildExpandingItem(toDoList);
        }, true);
        toDoList.AddWork(()=>{
            this.SetWildStayItem(toDoList);
        }, true);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, this.ParseLineData(listLineWinData), winNormalValue, totalWin),true);
        toDoList.AddWork(()=>this.CheckHoaBay(totalWin),false);
        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        if(totalWin == 0){
            toDoList.AddWork(()=>this.ActiveColorButtonNormalGame(),false);
        }
        //toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn),true);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        //check item
        toDoList.AddWork(()=>slotView.ShowCommandUseItemBonusTurn(slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckHoaBay(total){
        if(total > 0){
            let isShowEffect = false;
            for (let i = 0; i < this.listDataWildStay.length; i++) {
                if(this.listDataWildStay[i].value >= 0){
                    isShowEffect = true;
                }
            }
            if(isShowEffect){
                this.slotView.PlayEffectHoaBay();
            }
        }
    },

    CheckBonus(){

    },

    ResetUINewTurn(){
        //this.listDataWildStay = {};
        if(this.slotView.isFree){
        }
        else
            this.ActiveColorButtonNormalGame();
    },

    ActiveColorButtonNormalGame(){
        this.slotView.ActiveColorButtonNormalGame();
    },

    SetWildStayItem(toDoList) {
        if(this.listDataWildStay.length == 0){
            if(toDoList != null)
                toDoList.DoWork();
        }else{
            let listItem = this.slotView.spinManager.listItem;
            for (let i = 0; i < this.listDataWildStay.length; i++) {
                if(this.listWildStay[this.listDataWildStay[i].pos] == null){
                    var wildObj = cc.instantiate(this.itemWildJump);
                    wildObj.parent = this.wildContent;
                    wildObj.active = true;
                    wildObj.setPosition(listItem[this.listDataWildStay[i].pos].node.getPosition());
                    wildObj.scale = 1;
                    wildObj.getComponent("ThaiItemSlotView").SetSkin(this.listDataWildStay[i].value);
                    this.listWildStay[this.listDataWildStay[i].pos] = wildObj.getComponent("ThaiItemSlotView");
                }else{
                    this.listWildStay[this.listDataWildStay[i].pos].SetSkin(this.listDataWildStay[i].value);
                }
            }   
            if(toDoList != null)
                toDoList.DoWork();
        }
    },

    SetWildExpandingItem(toDoList) {
        if(this.listDataWildExpanding.length == 0){
            if(toDoList != null)
                toDoList.DoWork();
        }else{
            let listItem = this.slotView.spinManager.listItem;
            for (let i = 0; i < this.listDataWildExpanding.length; i++) {
                if(this.listWildExpanding[this.listDataWildExpanding[i].pos] == null){
                    var wildObj = cc.instantiate(this.itemWildExpading);
                    wildObj.parent = this.wildContent;
                    wildObj.active = true;
                    wildObj.setPosition(listItem[this.listDataWildExpanding[i].pos].node.getPosition(), 0);
                    wildObj.scale = 1;
                    wildObj.getComponent("ThaiItemSlotView").SetSkinExpading();
                    this.listWildExpanding[this.listDataWildExpanding[i].pos] = wildObj.getComponent("ThaiItemSlotView");
                }else{
                    this.listWildExpanding[this.listDataWildExpanding[i].pos].SetSkinExpading();
                }
            }   
            if(toDoList != null)
                toDoList.DoWork();
        }
    },

    ClearWildItem(toDoList){
        for (let i = 0; i < this.listDataWildExpanding.length; i++) {
            if(this.listDataWildExpanding[i].value == 0){
                if(this.listWildExpanding[this.listDataWildExpanding[i].pos] != null){
                    this.listWildExpanding[this.listDataWildExpanding[i].pos].node.destroy();
                    this.listWildExpanding[this.listDataWildExpanding[i].pos] = null;
                }
            }
        }
        if(this.slotView.isFree){
            for (let i = 0; i < this.listDataWildStay.length; i++) {
                if(this.listDataWildStay[i].value != 8){
                    if(this.listWildStay[this.listDataWildStay[i].pos] != null){
                        this.listWildStay[this.listDataWildStay[i].pos].node.destroy();
                        this.listWildStay[this.listDataWildStay[i].pos] = null;
                    }
                }
            }
            toDoList.DoWork();
        }else{
            if(this.listDataWildStay.length == 0){
                toDoList.DoWork();
            }else{
                for (let i = 0; i < this.listDataWildStay.length; i++) {
                    if(this.listDataWildStay[i].value == 0){
                        if(this.listWildStay[this.listDataWildStay[i].pos] != null){
                            this.listWildStay[this.listDataWildStay[i].pos].node.destroy();
                            this.listWildStay[this.listDataWildStay[i].pos] = null;
                        }
                    }
                }
                toDoList.DoWork();
            }
        }
    },

    SetLastViewMatrix(lastMatrix){
        //Update lai vi tri cac wild
        let matrix = this.ParseMatrix(lastMatrix);
        this.slotView.spinManager.UpdateMatrix(matrix, true);
        if(this.listDataWildExpanding.length != 0){
            let listItem = this.slotView.spinManager.listItem;
            for (let i = 0; i < this.listDataWildExpanding.length; i++) {
                if(this.listWildExpanding[this.listDataWildExpanding[i].pos] == null){
                    var wildObj = cc.instantiate(this.itemWildExpading);
                    wildObj.parent = this.wildContent;
                    wildObj.active = true;
                    let vector = 
                    wildObj.setPosition(listItem[this.listDataWildExpanding[i].pos].node.getPosition().x, 0);
                    wildObj.scale = 1;
                    wildObj.getComponent("ThaiItemSlotView").SetSkinExpading();
                    this.listWildExpanding[this.listDataWildExpanding[i].pos] = wildObj.getComponent("ThaiItemSlotView");
                }else{
                    this.listWildExpanding[this.listDataWildExpanding[i].pos].SetSkinExpading();
                }
            }   
        }

        if(this.listDataWildStay.length == 0){
        }else{
            let listItem = this.slotView.spinManager.listItem;
            for (let i = 0; i < this.listDataWildStay.length; i++) {
                if(this.listDataWildStay[i].value > 0){
                    if(this.listWildStay[this.listDataWildStay[i].pos] == null){
                        var wildObj = cc.instantiate(this.itemWildJump);
                        wildObj.parent = this.wildContent;
                        wildObj.active = true;
                        wildObj.setPosition(listItem[this.listDataWildStay[i].pos].node.getPosition());
                        wildObj.scale = 1;
                        wildObj.getComponent("ThaiItemSlotView").SetSkin(this.listDataWildStay[i].value);
                        this.listWildStay[this.listDataWildStay[i].pos] = wildObj.getComponent("ThaiItemSlotView");
                    }else{
                        this.listWildStay[this.listDataWildStay[i].pos].SetSkin(this.listDataWildStay[i].value);
                    }
                }
            }   
        }
    },

    ClearWildEndFree() {
        for(let i = this.wildContent.children.length - 1; i >=0; i--) {
            this.wildContent.children[i].destroy();
        }
        this.listWildStay = [];
        this.listWildExpanding = [];
    },

    //reset luc het free
    resetWild() {
        this.listWildExpanding = [];
        this.listWildStay = [];
        for(let i = this.wildContent.children.length - 1; i >=0; i--) {
            this.wildContent.children[i].destroy();
        }
    },
    
    CheckTimeShowPrize(prizeValue) {
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(prizeValue > 0) {        
            let isBigWin = this.slotView.CheckBigWin(prizeValue);
            this.isWin = true;
            if(isBigWin)
                this.slotView.toDoList.Wait(3);
            else if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(2.2);
                else this.slotView.toDoList.Wait(2.2);
            } else{
                this.slotView.toDoList.Wait(2);
            }
            
        } else {
            this.isWin = false;
            if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(1.2);
                else this.slotView.toDoList.Wait(1.2);
            }             
            else  {
                this.slotView.toDoList.Wait(0.2);
            }
        }
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },

    ShowEffectPreWin(index) {
    },

    HideEffectPreWin(index) {
    },

    HideAllEffectPreWin() {
    },

    ParseMatrix(matrixData) {
        this.listDataWildStay = [];
        this.listDataWildExpanding = [];
        let matrixStr = matrixData.split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
            if(matrix[i] == 2) {
                let value = matrixStr[i].split(".")
                let data = {
                    pos : i,
                    value : parseInt(value[1])
                }
                this.listDataWildStay.push(data);
            }
        }
        //check expading
        let count = 0;
        for(let i = 0; i < 5; i++){
            count = 0;
            for(let j = 0; j < 4; j++){
                if(matrix[i+j*5] == 3){
                    count++;
                }
            }
            if(count >= 4){
                let data = {
                    pos : i,
                    value : 0
                }
                this.listDataWildExpanding.push(data);
            }
        }
        return matrix;
    },
});
