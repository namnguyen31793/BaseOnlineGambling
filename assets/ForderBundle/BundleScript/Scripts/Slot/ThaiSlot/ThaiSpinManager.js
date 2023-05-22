cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.listLengthmatrix;
        this.CountPreWinFree = 0;
        this.CheckPreWinFree = false;
    },

    properties: {
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 4;
        this.NUMBER_ITEM_ABOVE = 8;
        this.NUMBER_ITEM_BELOW = 8;
        this.NUMBER_SPEED = 20;
        this.TIME_SPIN = 0.1;
        this.TIME_DISTANCE_COLUMN = 0.15;
    },

    SetPreWin() {
        this.ID_FREE = 4;
        this.ID_WILD_STAY = 2;
        this.listIdPreWin[0] = this.ID_FREE;
        this.listCountPreWin[0] = 2;
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.NUMBER_ITEM_ABOVE = 8;
            this.NUMBER_ITEM_BELOW = 8;
            this.TIME_SPIN = 0.1;
            this.TIME_DISTANCE_COLUMN = 0.15;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 20;
        }
    },

    UpdateMatrix(matrix) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            let listJumpModel = this.slotView.normalManager.listWildStay;
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                if(this.cacheMatrix[i] == this.ID_WILD_STAY){  
                    //check xem neu la icon dau tien thi cho xuat hien
                    let isSpawWild = false;
                    for(let j = 0; j < listJumpModel.length; j++){
                        if(listJumpModel[j] == 2)
                        isSpawWild = true;
                    }
                    //item wild dien tu item thuong bien thanh
                    if(isSpawWild){
                        this.slotView.itemManager.SetImageColor(this.cacheMatrix[i], this.listItem[i], i, true);
                    }else{
                        let r = Global.RandomNumber(1,10)+4;
                        this.slotView.itemManager.SetImageColor(r, this.listItem[i], i, true);
                    }
                }
                else
                    this.slotView.itemManager.SetImageColor(this.cacheMatrix[i], this.listItem[i], i, true);
            }
        }
    },

    HideWildFree(){
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideValueWild();
        }
        this.CountPreWinFree = 0;
        this.CheckPreWinFree = false;
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

    CountPreWin() {
        let listCount = [];
        let listCountIncrease = [];
        let listIndex = [];
        
        return listIndex;
    },

    OnCheckUpdateMatrix(isSet = false) {
        if(!isSet) {
            this.stateSpin += 1;
        } 
        if(this.stateSpin == 2 || isSet) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImageColor(this.cacheMatrix[i], this.listItem[i], i, true);
                this.CheckItemBonus(i);
            }
        }
    },
});
