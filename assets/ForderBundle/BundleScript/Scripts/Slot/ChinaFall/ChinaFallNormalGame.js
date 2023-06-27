let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT = 0.5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        Curtain: cc.Node,
        listMultiNote: {
            default: [],
            type: cc.Node,
        },
        fireAnim : cc.Animation,
        hadesCharacter : cc.Animation,
        animFireMutil : {
            default: [],
            type: cc.Animation,
        },

        hadesLaugh_Sound : {
            default: [],
            type: cc.AudioClip,
        },

    },

    ctor() {
        this.listItemBonus = [];
        this.listExtra = {};
        this.listJackpot = {};
        this.listBonus = {};
        this.listMultiExtraFree = {};
        this.toDoList = null;
        this.isPlayAnimHades = false;
        this.timePlayAnimHades = 0;
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
        //let extend = this.ParseExtendData(extandMatrix);
        //this.slotView.SetFreeSpin(freeSpin, extend);
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
        let listLengthMatrix = this.ParseExtendData(extandMatrix);
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
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
//add show line and drop matrix
        toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[0]),true);
        let index = 0;
        if(listMatrix.length > 1){
            for(let i = 1; i < listMatrix.length; i++){
                //roi ma tran moi
                toDoList.AddWork(()=>slotView.ShowMoneyWinStep((listWinStepDataModel[i-1]/listMultiStepModel[i-1])* this.slotView.GetBetValue()),false);
                toDoList.AddWork(()=>slotView.DropMatrix(listMatrix[i], listWinStepDataModel[i-1], listMultiStepModel[i-1], i),true);
                //anim hades
                if(i < 4){                
                    toDoList.AddWork(()=> this.playAnimHades(i),false);
                    toDoList.Wait(1);
                    //update chieu dai ma tran
                    toDoList.AddWork(()=>this.playTweenCurain(listLengthMatrix[i]),false);
                    toDoList.Wait(0.7);
                   
                    //update multi
                    toDoList.AddWork(()=>this.playAnimFire(listMultiStepModel[i]),false);
                  
                }
                //toDoList.AddWork(()=>this.animFireMutil[listMultiStepModel[i-1]].play("AnimFireMutil"),false);
                toDoList.Wait(0.2);
                toDoList.AddWork(()=>this.changeMulti(listMultiStepModel[i]),false);
                toDoList.Wait(0.2);
                //show line win cua ma tran moi
                toDoList.AddWork(()=>slotView.UpdateLineWinData(listLineWinDataModel[i]),true);
            }
            //neu co cac luot roi ma tran thi turn cuoi cung cho them 1 ti
            //toDoList.Wait(1.5);
        }
//end drop
        //toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, extend, true, winNormalValue),true);
        if(!slotView.isFree)
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot),true);
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
    
    ParseExtendData(extendData) {
        let listExtendString = extendData.split("/");
        
        let listLength = [];
        let listLengthString = listExtendString[1].split("|");

        for(let i = 0; i < listLengthString.length; i++){
            let result = 0;
            if(listLengthString[i] !== ""){
                result = parseInt(listLengthString[i]);
            }
            listLength[i] = result;
        }
        return listLength;
    },

    ParseListWinData(extendData) {
        let listExtendString = extendData.split("/");

        let listLineWin = [];
        let listWinString = listExtendString[0].split("|");

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
        let listExtendString = extendData.split("/");

        let listLineWin = [];
        let listWinString = listExtendString[0].split("|");

        for(let i = 0; i < listWinString.length; i++){
            let result = 0;
            if(listWinString[i] !== ""){
                let data = listWinString[i].split(".");
                result = parseInt(data[0]);
            }else{
                result = listLineWin[i-1]+1;
                if(result > 4)
                    result = 4;
            }
            listLineWin[i] = result;
        }
        return listLineWin;
    },

    playTweenCurain(Lengthmatrix){
        let endPos = 312+(Lengthmatrix-3)*100;
        this.slotView.UpdateLengthMatrix(Lengthmatrix, true);
        if(Lengthmatrix != 3)
            this.fireAnim.play("fireAnim");
        this.Curtain.runAction(cc.sequence(cc.delayTime(0.3),cc.moveTo(0.5,cc.v2(this.Curtain.x,endPos))));       
    },

    playAnimHades(animationIndex){
        this.hadesCharacter.play("HadesActive");
        this.isPlayAnimHades = true;
        this.timePlayAnimHades = 0;
        cc.audioEngine.playEffect(this.hadesLaugh_Sound[animationIndex-1], false);  
    },

    resetLengthMatrix(){
        let defineLength = 3;
        this.playTweenCurain(defineLength);
        this.changeMulti(1);
    },

    changeMulti(num){
        if(num <= 0)
            return;
        for(let i = 0; i < this.listMultiNote.length; i++){
            this.listMultiNote[i].active = false;
        }
        if(num <= this.listMultiNote.length)
        {
            this.listMultiNote[num-1].active = true;
        }
    },

    playAnimFire(num){
        if(num <= this.animFireMutil.length)
            this.animFireMutil[num-1].play("AnimFireMutil")
    },

    update(dt){
        if(this.isPlayAnimHades){
            this.timePlayAnimHades += dt;
            if(this.timePlayAnimHades >= 3.2){
                this.isPlayAnimHades = false;
                this.hadesCharacter.play("HadesNormal");
            }
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
                this.slotView.toDoList.Wait(2);
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
                    this.slotView.toDoList.Wait(0.8);
                else this.slotView.toDoList.Wait(0.8);
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
});
