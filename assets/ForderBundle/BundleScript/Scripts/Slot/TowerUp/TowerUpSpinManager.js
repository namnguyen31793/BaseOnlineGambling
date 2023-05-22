cc.Class({
    extends: require("SpinManager"),

    ctor() {
        this.nameSpin = "TowerUpSpinColumnController";
        this.countSpinDoneBot = 0;
    },

    properties: {
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 3;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 8;//6;
        this.NUMBER_ITEM_BELOW = 8;//5;
        this.NUMBER_SPEED = 12;
        this.TIME_SPIN = 0.6;
        this.TIME_DISTANCE_COLUMN = 0.1;
    },

    SetPreWin() {
        this.ID_BONUS = 33;
        this.ID_FREE = 2;
        this.listIdPreWin[0] = this.ID_BONUS;
        this.listIdPreWinIncrease[0] = this.ID_FREE;
        this.listCountPreWin[0] = 3;
        this.listCountPreWinIncrease[0] = 2;
        // this.listCountPreWin[1] = 2;
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.6;
            this.TIME_DISTANCE_COLUMN = 0.08;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 12;
        }
    },

    CheckItemBonus(index) {
        if(this.slotView.isBonus) {
            if(this.slotView.isBonus && (this.cacheMatrix[index] == 3 || this.cacheMatrix[index] == 5 || this.cacheMatrix[index] == 1)) {
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

    ShowAnimPreWinItem(id) {
    },

    PlayEffectSpinTowerFall(){
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                this.listStopObj[i].active = false;
                for(let j = 0; j < this.listStopObj[i].children.length; j++) {
                    this.listStopObj[i].children[j].getComponent("TowerUpItemView").OffChangeParent();
                }
                this.listSpinObj[i].PlaySpinTowerFall(this.listStopObj[i]);
            } , 0)
        }
    },

    OnSpinDoneBottom(indexColumn) {
        this.listStopObj[indexColumn].active = true;
        let animStop = this.listStopObj[indexColumn].getComponent(cc.Animation);
        if(animStop) {
            animStop.play();
        }
        this.countSpinDoneBot+=1;  
        if(this.countSpinDoneBot >= this.NUMBER_COLUMN) {
            this.countSpinDoneBot = 0;
            this.scheduleOnce(()=>{
                this.slotView.toDoList.DoWork();
            } , 0.2);
        }
    },

    PlaySpinColumn(timeDistanceColumn) {
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            for(let j = 0; j < this.listStopObj[i].children.length; j++) {
                this.listStopObj[i].children[j].getComponent("TowerUpItemView").OffChangeParent();
            }
            this.scheduleOnce(()=>{
                this.listStopObj[i].active = false;
                
                this.slotView.PlaySpinStart();
                this.listSpinObj[i].PlaySpin(this.listStopObj[i]);
                this.CheckSpinColumn(this.listSpinObj[i].node.children[0], i);
            } , i*timeDistanceColumn)
        }
    },

    OnSpinDone(indexColumn) {
        this._super(indexColumn);
        this.scheduleOnce(()=>{
            for(let i = 0; i < this.listStopObj[indexColumn].children.length; i++) {
                this.listStopObj[indexColumn].children[i].getComponent("TowerUpItemView").OnChangeParent();
            }
        } , 0.17);
    },
});
