let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT = 0.5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        listMultiNote: {
            default: [],
            type: cc.Animation,
        },
        listMultiNoteFree: {
            default: [],
            type: cc.Animation,
        },
        nodeMultiNoral : cc.Node,
        nodeMultiFree : cc.Node,
        hadesCharacter : cc.Animation,
    },

    ctor() {
        this.listItemBonus = [];
        this.listExtra = {};
        this.listJackpot = {};
        this.listBonus = {};
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

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot,extandMatrix) {
        if(isTakeJackpot)
            winNormalValue = totalWin;
        this.listBonus = {};
        this.listMultiExtraFree = {};
//lay list cac ma tran roi
        let listMatrix = this.ParseMatrix(matrix);
        let listLineWinDataModel = this.ParseLineData(listLineWinData);        
        let listWinStepDataModel = this.ParseListWinData(extandMatrix);
        let listMultiStepModel = this.ParseListMultiData(extandMatrix);

        this.slotView.UpdateMatrix(listMatrix[0]);

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
//add show line and drop matrix
        toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[0]),true);
        if(listMatrix.length > 1){
            for(let i = 1; i < listMatrix.length; i++){
                //roi ma tran moi
                toDoList.AddWork(()=>slotView.ShowMoneyWinStep((listWinStepDataModel[i-1]/listMultiStepModel[i-1])* this.slotView.GetBetValue()),false);
                toDoList.AddWork(()=>slotView.DropMatrix(listMatrix[i], listWinStepDataModel[i-1], listMultiStepModel[i-1], i),true);
                //anim hades
                toDoList.AddWork(()=> this.playAnimHades(),false);
                toDoList.AddWork(()=>this.changeMulti(listMultiStepModel[i]),false);
                toDoList.Wait(1.2);
                //show line win cua ma tran moi
                toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[i]),true);
            }
            //neu co cac luot roi ma tran thi turn cuoi cung cho them 1 ti
            toDoList.Wait(0.3);
        }
//end drop
        if(!slotView.isFree)
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot),true);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, winNormalValue),true);

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
                if(matrix[i] == 3){ 
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
        let listLineWin = [];
        let listWinString = extendData.split("|");

        for(let i = 0; i < listWinString.length; i++){
            let result = 0;
            if(listWinString[i] !== ""){
                let data = listWinString[i].split(".");
                result = parseInt(data[1]);
            }
            listLineWin[i] = result;
        }
        return listLineWin;
    },

    ParseListMultiData(extendData) {
        let listLineWin = [];
        let listWinString = extendData.split("|");

        for(let i = 0; i < listWinString.length; i++){
            let result = 0;
            if(listWinString[i] !== ""){
                let data = listWinString[i].split(".");
                result = parseInt(data[0]);
            }else{
                result = listLineWin[i-1]+1;
            }
            listLineWin[i] = result;
        }
        return listLineWin;
    },

    playAnimHades(){
 //       this.hadesCharacter.play("HadesActive");
    },

    resetMulti(){
        if(this.currentIndexMulti > 0){
            cc.log("resetMulti "+this.currentIndexMulti);
            this.listMultiNote[this.currentIndexMulti].play("AnimMultiHide");
            this.listMultiNoteFree[this.currentIndexMulti].play("AnimMultiHide");
            
            let acShow = cc.callFunc(() => {
                this.listMultiNote[0].play("AnimMultiActive");
                this.listMultiNoteFree[0].play("AnimMultiActive");
            });
            this.node.runAction(cc.sequence(cc.delayTime(0.5), acShow));
        }
        this.currentIndexMulti = 0;
    },

    showBoxMulti(isFree){
        if(!isFree){
            this.nodeMultiNoral.active = true;
            this.nodeMultiFree.active = false;
        }else{
            this.nodeMultiNoral.active = false;
            this.nodeMultiFree.active = true;
        }
    },

    changeMulti(num){
        if(num <= 0)
            return;
        let newIndex = 0;
        if(!this.slotView.isFree){
            if(num == 1)
                newIndex = 0;
            else if (num == 2)
                newIndex = 1;
            else if (num == 3)
                newIndex = 2;
            else if (num == 5)
                newIndex = 3;
        }else{
            if(num == 3)
                newIndex = 0;
            else if (num == 6)
                newIndex = 1;
            else if (num == 9)
                newIndex = 2;
            else if (num == 15)
                newIndex = 3;
        }
        if(newIndex != this.currentIndexMulti){
            this.listMultiNote[this.currentIndexMulti].play("AnimMultiHide");
            this.listMultiNoteFree[this.currentIndexMulti].play("AnimMultiHide");
            
            this.currentIndexMulti = newIndex;
            let acShow = cc.callFunc(() => {
                this.listMultiNote[this.currentIndexMulti].play("AnimMultiActive");
                this.listMultiNoteFree[this.currentIndexMulti].play("AnimMultiActive");
            });
            this.node.runAction(cc.sequence(cc.delayTime(0.5), acShow));
        }
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },
});
