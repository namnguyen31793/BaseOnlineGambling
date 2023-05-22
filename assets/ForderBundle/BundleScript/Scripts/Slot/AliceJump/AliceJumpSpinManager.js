cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.listLengthmatrix;
    },

    properties: {
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 6;
        this.NUMBER_ITEM_BELOW = 6;
        this.NUMBER_SPEED = 12;
        this.TIME_SPIN = 0.1;
        this.TIME_DISTANCE_COLUMN = 0.1;
    },

    SetPreWin() {
        this.ID_FREE = 2;
        this.ID_WILD = 3;
        this.listIdPreWin[0] = this.ID_FREE;
        this.listCountPreWin[0] = 2;
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

    UpdateMatrix(matrix) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            let listJumpModel = this.slotView.normalManager.jumpPosData;
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                if(this.cacheMatrix[i] == this.ID_WILD){  
                    //check xem neu la icon dau tien thi cho xuat hien
                    let isSpawWild = false;
                    let pos = i+1;
                    for(let j = 0; j < listJumpModel.length; j++){
                        if(listJumpModel[j].EP == pos && listJumpModel[j].SP == 0)
                        isSpawWild = true;
                    }
                    //item wild dien tu item thuong bien thanh
                    if(isSpawWild){
                        this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
                    }else{
                        let r = Global.RandomNumber(1,10)+3;
                        this.slotView.itemManager.SetImage(r, this.listItem[i], i);
                    }
                }
                else
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

});
