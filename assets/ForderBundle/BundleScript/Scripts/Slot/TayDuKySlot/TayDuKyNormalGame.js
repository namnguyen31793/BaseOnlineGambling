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
        
        if(accountBalance < 0){
            this.slotView.ActiveButtonMenu();
            return;
        }
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
        toDoList.AddWork(()=>this.SetWildItem(toDoList), true);

        if(!slotView.isFree){
            if(this.CheckBonusTayDu(extendMatrixDescription)){
                toDoList.AddWork(()=>slotView.effectManager.ShowBonus(),false);
                toDoList.Wait(2);
                toDoList.AddWork(()=>this.ShowBonus(winBonusValue, totalWin, extendMatrixDescription,toDoList),true);  
            }
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
        }
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, this.ParseLineData(listLineWinData), winNormalValue, isTakeJackpot),true);
        if(!slotView.isFree && !this.slotView.isBonus){
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        if(isTakeJackpot)
            toDoList.Wait(1);
        //check item
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },
    CheckBonus(){},

    CheckBonusTayDu(extendMatrixDescription){
        if(extendMatrixDescription === '[]' || extendMatrixDescription === ''){
            return false;
        }else{
            return true;
        }
    },

    ShowBonus(winBonusValue, totalWin,extendMatrixDescription, toDoList){
        let valueBonus = totalWin - winBonusValue;
        let listBonus =  JSON.parse(extendMatrixDescription);
        this.slotView.bonusManager.ShowBonusGame(listBonus, valueBonus, toDoList);
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
        this.resetWild();
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
        if(this.posData.length == 0) {
            toDoList.DoWork();
            return;
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
