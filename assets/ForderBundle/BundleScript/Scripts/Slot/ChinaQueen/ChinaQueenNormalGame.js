let TIME_TWEEN_CURAIN = 0.8;
let TIME_TWEEN_JACKPOT_MAX = 0.4;
let TIME_TWEEN_PER_JACKPOT = 0.04;
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        listCurtain: {
            default: [],
            type: cc.Node,
        },
        barLightJackpot : cc.Sprite,
        listGemJackpot: {
            default: [],
            type: cc.Node,
        },
    },

    ctor() {
        this.listPosItemChange = [];
        this.listExtra = {};
        this.listJackpot = {};
        this.listItemChange = [];
        this.listIndexItemChange = [];
        this.listMultiWild = {};
        this.timerCurain = 0;
        this.isPlayTweenCurain = false;
        this.listLengthmatrix;
        this.toDoList = null;
        this.isPlayTweenJackpot = false;
        this.timerJackpot = 0;
        this.numJackpot = 0;
        this.currentNumJackpot = 0;
        this.timerRumTweenJackpot = 0;
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

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, listLengthMatrixString) {
        if(isTakeJackpot)
            winNormalValue = totalWin;
        this.listItemChange = [];
        this.listIndexItemChange = [];
        this.listMultiWild = {};
        this.listPosItemChange = [];
        let matrixInfo = this.ParseMatrix(matrix)
        this.slotView.UpdateMatrix(matrixInfo);
        

        /*he so gem hoac so tich luy queen trong free*/
        let extendMatrix = this.ParseExtendMatrix(matrix);
       
        /*set do dai rem coi toDoList rieng*/
        var listLengthmatrix = this.ParseLengthMatrix(listLengthMatrixString);
        //

        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        toDoList.AddWork(()=>this.updateLengthMatrix(listLengthmatrix, toDoList),true);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.ChangeItemEffect(matrixInfo),true);
        if(!slotView.isFree){
            toDoList.Wait(0.3);
            toDoList.AddWork(()=> this.UpdateGemNormal(extendMatrix), true);
        }
        toDoList.AddWork(()=> this.CheckItemChangeFree(listLengthmatrix),false);
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, extendMatrix, this.listMultiWild, true, this.ParseLineData(listLineWinData), winNormalValue),true);
        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        //toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn),true);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckItemChangeFree(listLengthmatrix) {
        cc.log("rival CheckItemChangeFree");
        if(this.slotView.isFree) {
            let listItem = this.slotView.spinManager.listItem;
            for(let i = 0; i < this.listItemChange.length; i++){
                //check pos co trong ma tran khong
                if( this.listItemChange[i]/NUMBER_COLUM_MATRIX >= (6-listLengthmatrix[this.listItemChange[i]%NUMBER_COLUM_MATRIX]) ){
                    this.listPosItemChange[this.listPosItemChange.length] = listItem[this.listItemChange[i]].node.getPosition();
                    this.listIndexItemChange[this.listIndexItemChange.length] = this.listItemChange[i];
                }
            }
        }
    },

    CheckBonus(){

    },

    HideValueWildFree(){
        this.listMultiWild = {};
        this.slotView.HideWildFree();
    },

    ParseMatrix(matrixData) {
        let matrixString = matrixData.split("|");
        let matrixStr = matrixString[0].split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
            
            if(matrix[i] == 1){ 
                let value = matrixStr[i].split(".")
                if(value.length > 1){
                    this.listMultiWild[i.toString()] = value[1];
                }
            }
            if(matrix[i] > 40 ) {
                this.listItemChange[this.listItemChange.length] = i;
            }
        }
        return matrix;
    },


    ParseExtendMatrix(matrixData) {
        let matrixString = matrixData.split("|");
        return parseInt(matrixString[1]);
    },

    ParseLengthMatrix(listLengthMatrixString){
        let lengthMatrix = listLengthMatrixString.split(",");
        let listLength = [];
        for(let i = 0; i < lengthMatrix.length; i++) {
            listLength[i] = parseInt(lengthMatrix[i]);
        }
        return listLength;
    },

    update(dt){
        // if(this.isPlayTweenCurain){
        //     this.timerCurain += dt/TIME_TWEEN_CURAIN;
        //     if(this.timerCurain >=1)
        //         this.isPlayTweenCurain = false;
        //     for(let i = 0; i < this.listCurtain.length; i++){
        //         this.listCurtain[i].setContentSize(137, this.lerp(this.listCurtain[i].getContentSize().height, 15+95*(6-this.listLengthmatrix[i]), this.timerCurain));
        //     }
        // }
        if(this.isPlayTweenJackpot){
            this.timerJackpot += dt/this.timerRumTweenJackpot;
            if(this.timerJackpot >=1){
                this.isPlayTweenJackpot = false;
                this.slotView.toDoList.DoWork();
            }
            this.updateTweenJackpot(parseInt(this.timerJackpot*this.numJackpot));
        }
    },

    UpdateGemNormal(num, isReset = false){
        cc.log("rival update gem normal:"+isReset+"   "+num);
        if(isReset) {
            this.ResetUIGem();
            return;
        }
        if(num == 0) {
            this.ResetUIGem();
            this.slotView.toDoList.DoWork();
            return;
        }
        this.timerRumTweenJackpot = num*TIME_TWEEN_PER_JACKPOT;
        if(this.timerRumTweenJackpot > TIME_TWEEN_JACKPOT_MAX)
            this.timerRumTweenJackpot = TIME_TWEEN_JACKPOT_MAX;
        this.numJackpot = num;
        this.timerJackpot = 0;
        this.currentNumJackpot = 0;
        this.isPlayTweenJackpot = true;
        //id anh jackpot tuong ung
        let type = 0;
        if(num >= 12)
            type = 1;
        else if(num == 15)
            type = 2;
        this.slotView.SetTypeJackpot(type);
    },

    ResetUIGem(){
        this.isPlayTweenJackpot = false;
        for(let i = 0; i < this.listGemJackpot.length; i++){
            this.listGemJackpot[i].active = false;
        }
    },

    updateTweenJackpot(num){
        if(num > this.currentNumJackpot){
            this.currentNumJackpot = num;
            this.listGemJackpot[this.currentNumJackpot-1].active = true;
            this.listGemJackpot[this.currentNumJackpot-1].getComponent(cc.Animation).play("EffectScaleGemJackpot");
        }
    },

    playTweenCurain(listLengthmatrix){
        // this.isPlayTweenCurain = true;
        // this.timerCurain = 0;
        // this.listLengthmatrix = listLengthmatrix;
        for(let i = 0; i < this.listCurtain.length; i++){
            //this.listCurtain[i].setContentSize(137, this.lerp(this.listCurtain[i].getContentSize().height, 15+95*(6-this.listLengthmatrix[i]), this.timerCurain));
            let endPos = 297+(listLengthmatrix[i]-3)*90;
            this.listCurtain[i].runAction(cc.moveTo(0.5,cc.v2(this.listCurtain[i].x,endPos)));
        }
    },

    updateLengthMatrix(listLengthmatrix, todolist = null, isReset = false){
        if(JSON.stringify(this.slotView.spinManager.listLengthmatrix)!==JSON.stringify(listLengthmatrix)){

            this.slotView.UpdateLengthMatrix(listLengthmatrix);
            if(!isReset){
                this.slotView.PlayAnimPullCurtain();
                this.toDoList.CreateList();
                this.toDoList.Wait(0.6);
                this.toDoList.AddWork(()=>this.playTweenCurain(listLengthmatrix),false);
                this.toDoList.Wait(0.6);
                this.toDoList.AddWork(()=>{
                    if(todolist)
                        todolist.DoWork();
                },false);
                this.toDoList.Play();
            } else{
                this.playTweenCurain(listLengthmatrix);
            }
        }else{
            if(todolist)
                todolist.DoWork();
        }
    },

    resetLengthMatrix(){
        let defineLength = [3,3,3,3,3];
        this.slotView.UpdateLengthMatrix(defineLength, true);
        this.playTweenCurain(defineLength);
    },

    ResetUINewTurn(){
        this.resetLengthMatrix();
        this.UpdateGemNormal(0, true);
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
