cc.Class({
    extends: cc.Component,
    ctor() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 5;
        this.NUMBER_ITEM_BELOW = 3;
        this.TIME_SPIN = 0.2;
        this.TIME_DISTANCE_COLUMN = 0.25;
        this.TIME_BACK = 1;
        this.TIME_ACTION = 0.6;
        this.NUMBER_SPEED = 8;
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.slotView = null;
        this.itemParent = null;
        this.stateGetResult = 0;
        this.stateSpin = 0;
        this.listItem = [];
        this.listSpinObj = [];
        this.listStopObj = [];
        this.cacheMatrix;
        this.countSpinDone = 0;
        this.isgetResult = false;

        this.listIdPreWin = [];
        this.listCountPreWin = [];
        this.listIdPreWinIncrease = [];
        this.listCountPreWinIncrease = []
        this.listIndexIncrease = [];
        this.listStopIncrease = [];
        this.nameSpin = "SpinColumnController";
    },

    Init(slotView) {
        this.slotView = slotView;
        this.SetSizeMatrix();
        this.CreateItem();
        this.SetPreWin();
        this.SetSpeedMobile();
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.1;
            this.TIME_DISTANCE_COLUMN = 0.08;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 12;
        }
    },

    SetPreWin() {

    },

    SetSizeMatrix() {

    },

    CreateItem() {
        this.itemParent = cc.find("Container/Items", this.node);
        //tao list item va random anh
        let totalItem = this.NUMBER_COLUMN * this.NUMBER_ROW;
        for(let i = 0; i < totalItem; i++)
        {
            this.listItem[i] = cc.find("Container/Normal/Items/"+(i+1), this.node).getComponent("ItemSlotView");
            this.slotView.itemManager.RandomImage(this.listItem[i], true);
        }
        //tao obj cho cot quay
        this.listSpinObj[0] = cc.find("Container/Normal/SpinObj", this.node).getComponent(this.nameSpin);
        cc.log(">>Container/Normal/SpinObj :  ")
        for(let i = 1; i < this.NUMBER_COLUMN; i++) {
            this.listSpinObj[i] = cc.instantiate(this.listSpinObj[0].node).getComponent(this.nameSpin);
            this.listSpinObj[i].node.parent = this.listSpinObj[0].node.parent;
        }
        this.listStopObj[0] = cc.find("Container/Normal/StopObj", this.node);
        for(let i = 1; i < this.NUMBER_COLUMN; i++) {
            this.listStopObj[i] = cc.instantiate(this.listStopObj[0]);
            this.listStopObj[i].parent = this.listStopObj[0].parent;
        }
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                this.listItem[i+j*this.NUMBER_COLUMN].node.parent = this.listStopObj[i];
            }
        }
        let distanceY = this.listItem[0].node.y - this.listItem[this.NUMBER_COLUMN].node.y;
        for(let i = 0; i < this.NUMBER_COLUMN; i++)
        {
            this.listSpinObj[i].CreateSpinColumn(this.slotView, this.listItem[i].node,distanceY,this.NUMBER_ITEM_ABOVE, this.NUMBER_ITEM_BELOW, this.NUMBER_ROW, this.NUMBER_COLUMN, this.NUMBER_SPEED);
            this.listSpinObj[i].node.active = false;
            
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
        timeSpin = timeSpin + timeDistanceColumn * (this.NUMBER_COLUMN-1);
        
        this.scheduleOnce(()=>{
            this.OnCheckSpinSuccess();
            this.OnCheckUpdateMatrix();
        } , timeSpin);
        this.PlaySpinColumn(timeDistanceColumn);
    },

    PlaySpinColumn(timeDistanceColumn) {
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                this.listStopObj[i].active = false;
                this.slotView.PlaySpinStart();
                this.listSpinObj[i].PlaySpin(this.listStopObj[i]);
                this.CheckSpinColumn(this.listSpinObj[i].node.children[0], i);
            } , i*timeDistanceColumn)
        }
    },

    CheckSpinColumn(nodeIndex, index) {
    },

    OffItem() {
        for(let i = 0; i < this.listItem.length; i++)
            this.slotView.itemManager.ActiveItem(this.listItem[i], false);
    },

    OnItem() {
        for(let i = 0; i < this.listItem.length; i++)
            this.slotView.itemManager.ActiveItem(this.listItem[i], true);
    },

    PinItem(listId) {
        for(let i = 0; i < listId.length; i++) {
            this.slotView.itemManager.ActiveItem(this.listItem[listId[i]-1], true);
        }
    },

    UpdateMatrix(matrix, isSet = false) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix(isSet);
    },

    OnCheckUpdateMatrix(isSet = false) {
        if(!isSet) {
            this.stateSpin += 1;
        } 
        if(this.stateSpin == 2 || isSet) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
                this.CheckItemBonus(i);
            }
        }
    },

    CheckItemBonus(index) {

    },

    OnGetResult() {
        this.isgetResult = true;
        this.OnCheckSpinSuccess();
    },

    OnSpinDone(indexColumn) {
        this.listStopObj[indexColumn].active = true;
        this.CheckItemWhenSpinDone(indexColumn);
        let animStop = this.listStopObj[indexColumn].getComponent(cc.Animation);
        if(animStop) {
            animStop.play();
        }
        this.countSpinDone+=1;  
        if(this.countSpinDone >= this.NUMBER_COLUMN) {
            this.scheduleOnce(()=>{
                this.slotView.HideAllEffectPreWin();
            } , 0.2);
            this.countSpinDone = 0;
            this.slotView.toDoList.DoWork();
        }
    },

    CheckItemWhenSpinDone(indexColum) {
    },

    OnCheckSpinSuccess() {
        this.stateGetResult += 1;
        if(this.stateGetResult == 2) {
            this.OnStopSpin(this.listSpinObj);
        }
    },

    OnStopSpin(listSpinObj) {
        cc.log("OnStopSpin")
        let indexPreWin = this.CountPreWin();
        let min = this.NUMBER_COLUMN;
        for(let i = 0; i < indexPreWin.length; i++) {
            if(indexPreWin[i] != -1) {
                if(indexPreWin[i] < min) {
                    min = indexPreWin[i];
                }
            }
        }
        let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(isSpeed)
            timeDistanceColumn = this.TIME_DISTANCE_COLUMN/2;
        let listDelay = [];
        let totalDelay = 0;
        for(let i = 0; i < listSpinObj.length; i++) {
            if(i > min) {
                totalDelay += 2;
            } else {
                totalDelay += timeDistanceColumn;
            }
            listDelay[i] = totalDelay;
        }
        for(let i = 0; i < this.listIndexIncrease.length; i++) {
            if(this.listIndexIncrease[i] != -1) {
                for(let j = this.listIndexIncrease[i]+1; j < this.listStopIncrease[i]; j++) {
                    if(listDelay[j] - listDelay[j-1]< 2) {
                        for(let k = j; k < listSpinObj.length; k++) {
                            listDelay[k] = listDelay[k] + 2 - timeDistanceColumn;
                        }
                    }
                }
            }
        }
        for(let i = 0; i < listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                listSpinObj[i].GetResult(i, this.cacheMatrix);
                let checkShowIncrease = false;
                for(let j = 0; j < this.listIndexIncrease.length; j++) {
                    if(this.listIndexIncrease[j] != -1) {
                        if(i >= this.listIndexIncrease[j]) {
                            if(i < this.listStopIncrease[j]) {
                                checkShowIncrease = true;
                                this.ShowAnimPreWinItem(this.listIdPreWinIncrease[j]);
                            } else {
                                this.scheduleOnce(()=>{
                                    this.slotView.HideEffectPreWin(i);
                                } , 0.4);  
                            }
                        }
                    }
                }
                if((i>=min && i != listSpinObj.length-1) || checkShowIncrease) {
                    this.scheduleOnce(()=>{
                        for(let j = 0; j < indexPreWin.length; j++) {
                            if(indexPreWin[j] != -1 && i >= indexPreWin[j]) {
                                this.ShowAnimPreWinItem(this.listIdPreWin[j]);
                            }
                        }
                        this.slotView.HideEffectPreWin(i);
                        this.slotView.ShowEffectPreWin(i+1);
                        listSpinObj[i+1].SpeedUp();
                    } , 0.4);  
                }
            } , listDelay[i]);
        }
        cc.log(this.listIndexIncrease)
        this.slotView.OnSpinDone();
    },

    ShowAnimPreWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i] == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },

    CountPreWin() {
        let listCount = [];
        let listCountIncrease = [];
        let listIndex = [];
        for(let i = 0; i < this.listIdPreWin.length; i++) {
            listCount[i] = 0;
            listIndex[i] = -1;
        }
        for(let i = 0; i < this.listIdPreWinIncrease.length; i++) {
            listCountIncrease[i] = 0;
            this.listIndexIncrease[i] = -1;
            this.listStopIncrease[i] = this.NUMBER_COLUMN;
        }
        if(this.slotView.isBonus || this.slotView.isFree)
            return listIndex;
        let checkIncrease = true;
        for(let i = 0; i < this.NUMBER_COLUMN-1; i++) {
            let checkIn= false;
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                for(let k = 0; k < this.listIdPreWin.length; k++) {
                    if(this.CheckIdPreWin(this.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdPreWin[k])) {
                        listCount[k] += 1;
                        if(listCount[k] >= this.listCountPreWin[k] && listIndex[k] == -1) {
                            listIndex[k] = i;
                        }
                    }
                }
                for(let k = 0; k < this.listIdPreWinIncrease.length; k++) {
                    if(this.CheckIdPreWin(this.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdPreWinIncrease[k]) && checkIncrease) {
                        listCountIncrease[k] += 1;
                        if(listCountIncrease[k] >= this.listCountPreWinIncrease[k] && this.listIndexIncrease[k] == -1) {
                            this.listIndexIncrease[k] = i;
                        }
                        checkIn = true;
                    } else {
                        if(checkIncrease) {
                            this.listStopIncrease[k] = i+1;
                        }
                    }
                }
            }
            if(!checkIn) {
                checkIncrease = false;
            }
        }
        return listIndex;
    },

    CheckPreWin() {
        return this.listIdPreWin.length > 0;
    },

    CheckIdPreWin(idItem, idCheck) {
        return idItem == idCheck;
    },

    EndAllItemPreWin() {
        for(let i = 0; i < this.listItem.length; i++)
            this.listItem[i].EndAnimPreWin();
    }, 

    EndItemBonusPreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i] == this.ID_BONUS)
                this.listItem[i].EndAnimPreWin();
        }
    },

    EndItemFreePreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i] == this.ID_FREE)
                this.listItem[i].EndAnimPreWin();
        }
    },

    update(dt) {

    },

    onLoad() {
        // cc.game.on(cc.game.EVENT_HIDE, ()=>{
        //     this.timer = setInterval(()=>{
        //         this.update(0.1);
        //     }, 100);
        // })
        
        // cc.game.on(cc.game.EVENT_SHOW, ()=>{
        //     clearInterval(this.timer);
        // })
    },

    PlayAnimWaitAfk(){
        for(let i = 0; i < this.listItem.length; i++) {
            this.slotView.itemManager.playAnimWaitAfk(this.listItem[i]);
        }
    },
    
});
