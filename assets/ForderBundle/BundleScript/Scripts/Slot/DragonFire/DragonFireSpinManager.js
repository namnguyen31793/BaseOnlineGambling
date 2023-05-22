
let DEFAUT_POS_EFFECT = 285;
cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.listLengthmatrix;
        this.listEffect = [];
    },

    properties: {
        effectShowExtraItem : cc.Node,
        posNumberFree : cc.Node,
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 8;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 3;
        this.NUMBER_ITEM_BELOW = 3;
        this.NUMBER_SPEED = 12;
    },

    SetPreWin() {
        this.ID_FREE = 2;
        this.ID_WILD = 1;
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.1;
            this.TIME_DISTANCE_COLUMN = 0.08;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 15;
        }
    },

    UpdateMatrix(matrix, isSet = false) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix(isSet);
    },

    OnCheckUpdateMatrix(isSet) {
        if(!isSet) {
            this.stateSpin += 1;
        } 
        if(this.stateSpin == 2|| isSet) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                // if(this.cacheMatrix[i] == this.ID_WILD){  
                //     //item wild dien tu item thuong bien thanh
                //     let r = Global.RandomNumber(1,7)+3;
                //     this.slotView.itemManager.SetImage(r, this.listItem[i], i);
                // }
                // else
                    this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
            }
        }
    },

    HideWildFree(){
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideValueWild();
        }
    },

    ShowAnimPreWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i] == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },

    EndItemFreePreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i] == this.ID_FREE)
                this.listItem[i].EndAnimPreWin();
        }
    },
    PlayEffectSpin() {
        this.isgetResult = false;
        this.stateSpin = 0;
        this.stateGetResult = 0;
        let timeSpin = this.TIME_SPIN;
        let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(isSpeed)
            timeDistanceColumn = 0;
        if(!this.slotView.normalManager.isWin && !this.slotView.isFree && !this.slotView.isBonus)
            timeSpin = timeSpin/2;
        let num =this.slotView.normalManager.extandMatrixNextTurn;
        if(num == 3)
            timeSpin = timeSpin + timeDistanceColumn * (this.NUMBER_COLUMN-1);
        else
            timeSpin = timeSpin+timeDistanceColumn;
        this.scheduleOnce(()=>{
            this.OnCheckSpinSuccess();
            this.OnCheckUpdateMatrix();
        } , timeSpin);
        this.PlaySpinColumn(timeDistanceColumn);
    },

    PlaySpinColumn(timeDistanceColumn) {
        let num =this.slotView.normalManager.extandMatrixNextTurn;
        if(num == 3)
            for(let i = 0; i < num; i++)
            {
                this.scheduleOnce(()=>{
                    this.listStopObj[i].active = false;
                    this.slotView.PlaySpinStart();
                    this.listSpinObj[i].PlaySpin(this.listStopObj[i]);
                    this.CheckSpinColumn(this.listSpinObj[i].node.children[0], i);
                } , i*timeDistanceColumn)
            }
        else{
            this.scheduleOnce(()=>{
                this.listStopObj[num-1].active = false;
                this.slotView.PlaySpinStart();
                this.listSpinObj[num-1].PlaySpin(this.listStopObj[num-1]);
                this.CheckSpinColumn(this.listSpinObj[num-1].node.children[0], 0);
            } , timeDistanceColumn)
        }
    },

    OnSpinDone(indexColumn) {
        this.listStopObj[indexColumn].active = true;
        this.CheckItemWhenSpinDone(indexColumn);
        let animStop = this.listStopObj[indexColumn].getComponent(cc.Animation);
        if(animStop) {
            animStop.play();
        }
        this.countSpinDone+=1;  
        let num =this.slotView.normalManager.extandMatrixThisTurn;
        if(num == 3){
            if(this.countSpinDone >= 3) {
                this.scheduleOnce(()=>{
                    this.slotView.HideAllEffectPreWin();
                } , 0.2);
                this.countSpinDone = 0;
                this.slotView.toDoList.DoWork();
            }
        }else{
            this.scheduleOnce(()=>{
                this.slotView.HideAllEffectPreWin();
            } , 0.2);
            this.countSpinDone = 0;
            this.slotView.toDoList.DoWork();
        }
    },

    ShowExtra(pos, value){
        cc.log("ShowExtra "+pos+" -- "+value+ " -- "+this.slotView.normalManager.extandMatrixThisTurn);
        if((pos+1)% this.NUMBER_COLUMN != this.slotView.normalManager.extandMatrixThisTurn && this.slotView.normalManager.extandMatrixThisTurn != 8)
            return;
        cc.log("ShowExtra 2 "+pos+" -- "+value+ " -- "+this.slotView.normalManager.extandMatrixThisTurn);
        this.CreateExtraItem(this.listItem[pos].node.getPosition(), value);
    },

    CreateExtraItem(pos, value){
        let timeShow = 1;
        let timeMove = 0.5;
        this.listEffect = [];
        let eff = cc.instantiate(this.effectShowExtraItem);
        let acCreater = cc.callFunc(() => {
            eff.parent = this.effectShowExtraItem.parent;
            eff.setPosition(cc.v2(DEFAUT_POS_EFFECT,pos.y));
            eff.active = true;
            eff.getChildByName('Value').getComponent(cc.Label).string = "+"+value;
            eff.getComponent(cc.Animation).play("AnimAddFree");
            this.listEffect[this.listEffect.length] = eff;
        });
        let acMove = cc.callFunc(() => {
            eff.runAction(cc.moveTo(timeMove, this.posNumberFree.getPosition()).easing(cc.easeSineOut()));    
            cc.log("acMove");    
        });
        let acEnd = cc.callFunc(() => {
            cc.log("acEnd");
            this.slotView.UpdateNumberFree(value);
            for(let i = 0; i < this.listEffect.length; i++) {
                this.listEffect[i].destroy();
            }
            this.listEffect = [];
        });

        eff.runAction(cc.sequence(acCreater, cc.delayTime(timeShow), acMove, cc.delayTime(timeMove), acEnd));
    },
});
