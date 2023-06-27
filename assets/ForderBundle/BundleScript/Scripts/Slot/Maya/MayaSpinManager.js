cc.Class({
    extends: require("SpinManager"),

    ctor() {
        this.countSpinColumn = 0;
        this.listSpinFreeObj = [];
        this.listStopFreeObj = [];
    },

    properties: {
        spinFreeObj : cc.Node,
        stopFreeObj : cc.Node,
        itemFree : require("ItemMaya"),
        BigItemSound : cc.AudioClip,
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 5;
        this.NUMBER_ITEM_BELOW = 4;
        this.NUMBER_SPEED = 11;
        this.TIME_SPIN = 0.1;
        this.TIME_DISTANCE_COLUMN = 0.1;
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

    SetPreWin() {
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.listIdPreWin[0] = this.ID_BONUS;
        this.listIdPreWin[1] = this.ID_FREE;
        this.listCountPreWin[0] = 5;
        this.listCountPreWin[1] = 2;
    },

    CreateItem() {
        this._super();
        this.listSpinFreeObj[0] = this.listSpinObj[0];
        this.listSpinFreeObj[1] = this.listSpinObj[4];
        this.listSpinFreeObj[2] = this.spinFreeObj.getComponent("SpinColumnController");
        this.listStopFreeObj[0] = this.listStopObj[0];
        this.listStopFreeObj[1] = this.listStopObj[4];
        this.listStopFreeObj[2] = this.stopFreeObj;

        this.slotView.itemManager.RandomImageBig(this.itemFree, true);

        this.itemFree.node.parent = this.listStopFreeObj[2];
        this.listSpinFreeObj[2].CreateSpinColumn(this.slotView, this.itemFree.node,450,1, 2, 1, 1, 2);
        this.listSpinFreeObj[2].node.active = false;
    },

    PlaySpinColumn(timeDistanceColumn) {
         if(!this.slotView.isFree) {
            for(let i = 0; i < this.listSpinObj.length; i++)
            {
                this.scheduleOnce(()=>{
                    this.listStopObj[i].active = false;
                    this.slotView.PlaySpinStart();
                    this.listSpinObj[i].PlaySpin();
                    this.CheckSpinColumn(this.listSpinObj[i].node.children[0], i);
                } , i*timeDistanceColumn)
            }
            
        } else {
            for(let i = 0; i < this.listSpinFreeObj.length; i++)
            {
                this.scheduleOnce(()=>{
                    this.listStopFreeObj[i].active = false;
                    this.slotView.PlaySpinStart();
                    this.listSpinFreeObj[i].PlaySpin();
                } , i*timeDistanceColumn)
            }
            this.scheduleOnce(function() {
                this.slotView.freeManager.AnimCloseDoor();
            }, 0.1);
        }
        
    },

    CheckItemBonus(index) {
        if(this.slotView.isBonus) {
            if(this.slotView.isBonus && (this.cacheMatrix[index] == 3 || this.cacheMatrix[index] == 1)) {
                this.slotView.itemManager.SetColorActive(this.listItem[index], true);
            } else {
                this.slotView.itemManager.SetColorActive(this.listItem[index], false);
            }
        } else {
            this.slotView.itemManager.SetColorActive(this.listItem[index], true);
        }
    },

    SetColorItemSpin(active) {
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            for(let k = 0; k < this.listSpinObj[i].node.children.length; k++) {
                this.slotView.itemManager.SetColorActive(this.listSpinObj[i].node.children[k].getComponent("ItemSlotView"), active);
            }
        }
    },

    CheckSpinColumn(nodeIndex, index) {
        if(this.slotView.bonusManager.stateBonus == 2) {
            this.countSpinColumn += 1;
            let list = this.slotView.normalManager.listItemBonus;
            for(let temp in list){
                if(temp == index || temp == index+5 || temp == index+10) {
                    list[temp].item.node.active = true;
                    list[temp].node.active = false;
                }
            }
            if(this.countSpinColumn >= this.NUMBER_COLUMN) {
                this.countSpinColumn = 0;
                this.slotView.normalManager.EndBonus();
            }
        }
    },

    OnCheckUpdateMatrix(isSet = false) {
        this._super(isSet);
        if(this.stateSpin == 2 || isSet) {
            if(this.slotView.isFree) {
             
                this.slotView.itemManager.SetImageBig(this.cacheMatrix[1], this.itemFree);
                this.scheduleOnce(()=>{
                    cc.audioEngine.playEffect(this.BigItemSound, false);       
                } , 1); 
            }
        }
    },

    OnSpinDone(indexColumn) {
        this.countSpinDone+=1;
        if(!this.slotView.isFree) {
            this.listStopObj[indexColumn].active = true;
            this.CheckItemWhenSpinDone(indexColumn);
            this.listStopObj[indexColumn].getComponent(cc.Animation).play(); 
            
            if(this.countSpinDone >= this.NUMBER_COLUMN) {
                this.scheduleOnce(()=>{
                    this.slotView.HideAllEffectPreWin();
                } , 0.2);
                this.countSpinDone = 0;
                this.slotView.toDoList.DoWork();
            }
        } else {
            this.listStopFreeObj[indexColumn].active = true;
            this.listStopFreeObj[indexColumn].getComponent(cc.Animation).play();
            if(this.countSpinDone >= 3) {
                this.slotView.freeManager.AnimOpenDoor();
                this.countSpinDone = 0;
                this.scheduleOnce(function() {
                    this.slotView.toDoList.DoWork();
                }, 0.3);
            }
        }
    },

    OnCheckSpinSuccess() {
        this.stateGetResult += 1;
        if(this.stateGetResult == 2) {
            if(!this.slotView.isFree) {
                this.OnStopSpin(this.listSpinObj);
            } else {
                this.OnStopSpin(this.listSpinFreeObj);
            }
        }
    },

    CheckItemWhenSpinDone(indexColum) {
        for(let i = 0; i < 3; i++) {
            this.listItem[indexColum + 5 * i].node.active = true;
        }
        if(this.slotView.isBonus) {
            let list = this.slotView.normalManager.listItemBonus;
            for(let temp in list){
                if(indexColum == temp%5) {
                    this.listItem[temp].node.active = false;
                }
            }
        }
    },

    CheckIdPreWin(idItem, idCheck) {
        if(idCheck == 3) {
            if(idItem == 3 || idItem == 1)
                return true;
        } else return idItem == idCheck;
    },
    
});
