let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT = 0.5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        nodeBG : cc.Node,
        nodeKhung : cc.Node,
    },

    ctor() {
        this.listItemBonus = [];
        this.listExtra = {};
        this.listJackpot = {};
        this.listMultiExtraFree = {};
        this.toDoList = null;
        this.currentIndexMulti = -1;
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
        // cc.game.on(cc.game.EVENT_HIDE, ()=>{
        //     this.timer = setInterval(()=>{
        //         this.update(0.1);
        //     }, 100);
        // })
        
        // cc.game.on(cc.game.EVENT_SHOW, ()=>{
        //     clearInterval(this.timer);
        // })
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.slotView.OnUpdateMoney(accountBalance);

        this.slotView.SetFreeSpin(freeSpin);
        this.slotView.UpdateTotalBetValue(totalBetValue);
        this.slotView.UpdateJackpotValue(jackpotValue);
        this.slotView.SetLastPrizeValue(lastPrizeValue);
        this.slotView.SetLineData(lineData);
        this.slotView.toDoList.DoWork();
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot,extandMatrix, isUpdateBuyFree) {
        if(isTakeJackpot)
            winNormalValue = totalWin;
        
        this.listMultiExtraFree = {};
//lay list cac ma tran roi
        let listMatrix = this.ParseMatrix(matrix);
        
        let listLineWinDataModel = this.ParseLineData(listLineWinData);        
        let extend = this.ParseExtendData(extandMatrix);
        let listWinStepDataModel = this.ParseListWinData(extandMatrix);

        this.slotView.UpdateMatrix(listMatrix[0], this.listMultiExtraFree[0]);

        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance, isUpdateBuyFree);
        
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
//add show line and drop matrix
        toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[0]),true);
        if(listMatrix.length > 1){
            for(let i = 1; i < listMatrix.length; i++){
                //roi ma tran moi
                toDoList.AddWork(()=>slotView.spinManager.nodeEffect.enabled = true,false);
                toDoList.AddWork(()=>slotView.DropMatrix(listMatrix[i], this.listMultiExtraFree[i], listWinStepDataModel[i-1], i),true);              
                toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[i]),true);
            }
        }
//end drop
        if(!slotView.isFree)
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, true),true);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, winNormalValue, extend, this.listMultiExtraFree),true);
        

        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
       
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckBonus() {
        
    },

    EndBonus() { 
        if(!this.slotView.isBonus) {
            for(let i = 0; i < this.listItemBonus.length; i++) {
                if(this.listItemBonus[i] != null) {
                    this.listItemBonus[i].node.destroy();
                }
            }
            this.listItemBonus = [];
        }
    },

    HideValueWildFree(){
        this.listMultiExtraFree = {};
        this.slotView.HideWildFree();
    },

    ParseMatrix(matrixData) {
        let listMatrix = [];
        this.listMultiExtraFree = []
        let listMatrixString = matrixData.split("|");
        for(let i = 0; i < listMatrixString.length; i++){
            let matrixStr = listMatrixString[i].split(",");
            let matrix = [];
            let multil = [];
            for(let i = 0; i < matrixStr.length; i++) {
                matrix[i] = parseInt(matrixStr[i]);
                if(matrix[i] == 2){ 
                    let value = matrixStr[i].split(".")
                    if(value.length > 1){
                        multil[i.toString()] = value[1];
                    }
                }
            }
            listMatrix[i] = matrix;
            this.listMultiExtraFree[i] = multil;
        }
        return listMatrix;
    },
    
    ParseLineData(lineWinData) {
        let listLineWin = [];
        let listLineWinString = lineWinData.split("|");

        for(let i = 0; i < listLineWinString.length; i++){
            let result = [];
            if(listLineWinString[i] !== ""){
                let lineStr = listLineWinString[i].split(",");
                for(let i = 0; i < lineStr.length; i++) {
                    result[i] = parseInt(lineStr[i]);
                }
            }
            listLineWin[i] = result;
        }
        return listLineWin;
    },
    

    ParseListWinData(extendData) {
        let listExtendString = extendData.split(":");

        let listLineWin = [];
        let listWinString = listExtendString[0].split("|");

        for(let i = 0; i < listWinString.length; i++){
            let result = 0;
            if(listWinString[i] !== ""){
                result = parseInt(listWinString[i]);
            }
            listLineWin[i] = result;
        }
        return listLineWin;
    },
    
    ParseExtendData(extendData) {
        let listExtendString = extendData.split(":");
        let extend = parseInt(listExtendString[1]);
        
        return extend;
    },

    playAnimHades(){
    },

    resetMulti(){
        this.currentIndexMulti = 0;
    },

    showBoxMulti(isFree){

    },

    changeMulti(num){
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },

    showBGFree(isStart){
        if(isStart){
            this.nodeBG.active = false;
            this.nodeKhung.active = false;
        }else{
            this.nodeBG.active = true;
            this.nodeKhung.active = true;
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
                this.slotView.toDoList.Wait(2.2);
            else if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(0.5);
                else this.slotView.toDoList.Wait(0.5);
            } else{
                this.slotView.toDoList.Wait(0.5);
            }
            
        } else {
            this.isWin = false;
            if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(0.5);
                else this.slotView.toDoList.Wait(1.2);
            }             
            else  {
                this.slotView.toDoList.Wait(0.2);
            }
        }
    },
});
