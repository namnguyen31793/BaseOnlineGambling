var DELAY_COLUM_DROP = 0.1;
cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.countFallOut = 0;
        this.isFreeDom = false;
        this.countTimeFreeDom = 0;
        this.listIndexRandom = [];
        this.toDoList = null;
        this.listEffect = [];
    },

    properties: {
        effectDestroyItem : cc.Node,
        effectShowExtraItem : cc.Node,
        effectLight : cc.Node,
        listEndPosLight : {
            default: [],
            type: cc.Node,
        },
        effectShowMoneyStep : cc.Node,
        nodeEffect : cc.Mask,
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 6;
        this.NUMBER_ROW = 5;
        this.NUMBER_ITEM_ABOVE = 5;
        this.NUMBER_ITEM_BELOW = 0;
        this.NUMBER_SPEED = 18;
        this.ID_GOLD_QUEEN = 3;
        this.TIME_DISTANCE_COLUMN = 0.13;
        this.nameSpin = "SweetBonanza2SpinColumn";
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.1;
            this.TIME_DISTANCE_COLUMN = 0.1;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 18;
        }
    },

    SetPreWin() {
        // this.ID_FREE = 2;
        // this.listIdPreWin[0] = this.ID_FREE;
        // this.listCountPreWin[0] = 2;
    },

    UpdateMatrix(matrix, listMultiWild) {
        this.cacheMatrix = matrix;
        this.listMultiWildCache = listMultiWild;
        this.OnCheckUpdateMatrix();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i, this.listMultiWildCache[i]);
            }
        }
    },

    ChangeItemEffect(matrix) {
        if(this.stateSpin == 2) {
            if(this.slotView.isFree){
                for(let i = 0; i < matrix.length; i++) {
                    this.slotView.itemManager.SetImageFree(matrix[i], this.listItem[i], i, false);
                }
            }
            this.slotView.toDoList.DoWork();
        }
    },


    PlaySpinColumn(timeDistanceColumn) {
        cc.log("nodeEffect PlaySpinColumn "+this.nodeEffect.enabled);
        this.nodeEffect.enabled = true;
        this.countFallOut = 0;
        this.isFreeDom = false;
        this._super(timeDistanceColumn);
    },

    OnFallOutDone() {
        this.countFallOut += 1;
        if(this.countFallOut >= this.NUMBER_COLUMN) {
            if(this.stateGetResult == 2) {
                this.OnCheckStopSpin();
            } else {
                this.isFreeDom = true;
                this.countTimeFreeDom = 0;
            }
            this.nodeEffect.enabled = false;
            cc.log("nodeEffect end "+this.nodeEffect.enabled);
        }
    },


    DropMatrix(matrixNew, listMultiWild, winMoneyStep, multiStep){
        //roi theo ma tran moi
        //ma tran moi = matrixNew
        //ma tran cu = this.cacheMatrix
        //list vi tri an = this.slotView.drawLineManager.listLineWin[0]; //vi tri 0 la all cac vi tri an
        //------------
        //de ma tran moi vao cache
        let oldMatrix = this.cacheMatrix;
        let listIndex = [];
        this.toDoList.CreateList();

        //show bien mat item
        if(this.slotView.drawLineManager.listLineWin.length > 0) {
            this.toDoList.AddWork(()=>{
                    for(let i = 0; i < this.slotView.drawLineManager.listLineWin[0].length; i++) {
                        let index = this.slotView.drawLineManager.listLineWin[0][i];
                        this.listItem[index].node.active = false;
                        this.CreateEffectDestroyItem(this.listItem[index].node.getPosition());
                        oldMatrix[index] = -1;
                        listIndex[listIndex.length] = index;
                    }
                    this.slotView.playBoomSound();
            }, false);
            //create show tien thang cung luot
            if(winMoneyStep > 0){
                this.toDoList.AddWork(()=>{
                    this.slotView.ShowMoneyWinStep(winMoneyStep* this.slotView.GetBetValue()/100);
                },false);
            }
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
            }, false);
        }
        
        this.toDoList.AddWork(()=>{
            let listMin = [];
            let listCountIndex = [];
            for(let i = 0; i < this.NUMBER_COLUMN; i++) {
                listCountIndex[i] = 0;
            }
            for(let i = 0; i < listIndex.length; i++) {
                let indexColumn = listIndex[i] % this.NUMBER_COLUMN;
                listCountIndex[indexColumn] += 1;
                if(listMin[indexColumn] != null) {
                    if(listMin[indexColumn] < listIndex[i])
                        listMin[indexColumn] = listIndex[i];
                } else {
                    listMin[indexColumn] = listIndex[i];
                }
            }
            let countDelay = [];
            for(let i = 0; i < listCountIndex.length; i++) {
                this.listSpinObj[i].numbAbove = listCountIndex[i];
            }
            for(let i = 0; i < listMin.length; i++) {
                if(listMin[i] != null) {
                    let countAbove = parseInt(listMin[i] / this.NUMBER_COLUMN);
                    let step = 1;
                    let stepEnd = [];
                    countDelay[i] = 0;
                    for(let j = 0; j < countAbove; j++) {
                        let currentIndex = listMin[i]-(j+1)*this.NUMBER_COLUMN;
                        let value = oldMatrix[currentIndex];
                        if(value == -1) {
                            step += 1;
                        } else {
                            stepEnd[currentIndex] = step;
                            this.scheduleOnce(()=>{
                                this.listItem[currentIndex].node.active = false;
                                this.listSpinObj[i].AddBelowItem(stepEnd[currentIndex],currentIndex,this.cacheMatrix, countDelay[i]);
                                countDelay[i] += 1;
                            } , i*DELAY_COLUM_DROP);  
                        }
                    }
                }
            }
            for(let i = 0; i < listCountIndex.length; i++) {
                this.scheduleOnce(()=>{
                    this.listSpinObj[i].AddAboveItem(listCountIndex[i], matrixNew, countDelay[i]);
                } , i*DELAY_COLUM_DROP);  
            }
        }, false);
        this.toDoList.Wait(0.1+7*DELAY_COLUM_DROP);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < this.listSpinObj.length; i++) {
                this.listSpinObj[i].EndFall();
            }
            for(let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].node.active = true;
            }
            this.cacheMatrix = matrixNew;
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i, listMultiWild[i]);
            }
            //chay tiep tuc list work show line
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    OnFallRandomDone(index) {
        this.listIndexRandom[index] = null;
        this.OnCheckStopSpin();
    },

    OnCheckStopSpin() {
        if(!this.isFreeDom && this.stateGetResult == 2) {
            let check = true;
            for(let i = 0; i < this.listIndexRandom.length; i++) {
                if(this.listIndexRandom[i] != null) {
                    check = false;
                    break;
                }
            }
            if(check) {
                this.OnStopSpin(this.listSpinObj);
            }
        }
    },

    CreateRandomItemFall() {
        for(let i = 0; i < this.NUMBER_COLUMN; i++) {
            this.listIndexRandom[i] = i;
            this.scheduleOnce(()=>{
                this.listSpinObj[i].CreateItemWait(i);
            } , 0.05 * i); 
        }
    },

    OnCheckSpinSuccess() {
        this.stateGetResult += 1;
        if(this.stateGetResult == 2) {
            this.isFreeDom = false;
            if(this.countFallOut == 5)
                this.OnCheckStopSpin();
        }
    },

    update(dt) {
        if(this.isFreeDom) {
            this.countTimeFreeDom += dt;
            if(this.countTimeFreeDom >= 0.6) {
                this.countTimeFreeDom = 0;
                this.CreateRandomItemFall();
            }
        }
    },


    CreateEffectDestroyItem(pos){
        let eff = cc.instantiate(this.effectDestroyItem);
        eff.parent = this.effectDestroyItem.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(cc.Animation).play("explosionItem");
        this.listEffect[this.listEffect.length] = eff;
    },

    CreateEffectLightFly(pos, value){
        //light bay
        let eff = cc.instantiate(this.effectLight);
        eff.parent = this.effectLight.parent;
        eff.setPosition(this.listEndPosLight[value-1].getPosition());
        eff.active = true;
        eff.runAction(cc.moveTo(0.5,pos));
        this.listEffect[this.listEffect.length] = eff;
    },

    CreateWinMoneyStep(pos, value){
        let eff = cc.instantiate(this.effectShowExtraItem);
        eff.parent = this.effectShowExtraItem.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(cc.Label).string = "+"+ Global.Helper.formatNumber(value * this.slotView.GetBetValue());
        eff.getComponent(cc.Animation).play("AnimWinMoneyStep");
        this.listEffect[this.listEffect.length] = eff;
    },


    CreateWinMoneyWithMutl(value, total, multi){
        let eff = cc.instantiate(this.effectShowMoneyStep);
        eff.parent = this.effectShowMoneyStep.parent;
        eff.setPosition(cc.v2(0,315));
        eff.active = true;

        var money = eff.getChildByName("money");
        money.getComponent("LbMonneyChange")._currentMonney = 0;
        money.getComponent("LbMonneyChange").setMoney(value * this.slotView.GetBetValue());
        eff.getChildByName("total").getComponent(cc.Label).string = "+"+ Global.Helper.formatNumber(total * this.slotView.GetBetValue());
        eff.getChildByName("multi").getComponent(cc.Label).string = "x"+ multi;
        eff.getComponent(cc.Animation).play("WinMoneyStep");

        this.listEffect[this.listEffect.length] = eff;
    },

});
