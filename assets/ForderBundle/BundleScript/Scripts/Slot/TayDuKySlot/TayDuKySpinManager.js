cc.Class({
    extends: require("SpinManager"),
    ctor() {
    },

    properties: {
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 6;
        this.NUMBER_ITEM_BELOW = 6;
        this.NUMBER_SPEED = 16;
        this.TIME_SPIN = 0.05;
        this.TIME_BACK = 0.8;
        this.TIME_ACTION = 0.4;
        this.TIME_DISTANCE_COLUMN = 0.06;
    },

    SetPreWin() {
        this.ID_POTS = 1;
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.listIdPreWin[0] = this.ID_POTS;
        this.listIdPreWin[1] = this.ID_BONUS;
        this.listIdPreWin[2] = this.ID_FREE;
        this.listCountPreWin[0] = 2;
        this.listCountPreWin[1] = 3;
        this.listCountPreWin[2] = 3;
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.05;
            this.TIME_DISTANCE_COLUMN = 0.06;
            this.TIME_BACK = 0.8;
            this.TIME_ACTION = 0.4;
            this.NUMBER_SPEED = 16;
        }
    },

    UpdateMatrix(matrix) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
            }
        }
    },

    SetWildFree(listMultiWild){
        for(let temp in listMultiWild){
            if(parseInt(listMultiWild[temp]) > 1)
                this.listItem[temp].SetValueWild("X"+parseInt(listMultiWild[temp]));
            else
                this.listItem[temp].HideValueWild();
        }
    },

    HideWildFree(){
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideValueWild();
        }
    },

    CountPreWin() {
        let listCount = [];
        let listIndex = [];
        for(let i = 0; i < this.listIdPreWin.length; i++) {
            listCount[i] = 0;
            listIndex[i] = -1;
        }
        if(this.slotView.isBonus || this.slotView.isFree)
            return listIndex;
        for(let i = 0; i < this.NUMBER_COLUMN-1; i++) {
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                for(let k = 0; k < this.listIdPreWin.length; k++) {
                    if(this.cacheMatrix[i+j*this.NUMBER_COLUMN] == this.listIdPreWin[k]) {
                        listCount[k] += 1;
                        if(listCount[k] >= this.listCountPreWin[k] && listIndex[k] == -1) {
                            listIndex[k] = i;
                        }
                    }
                }
            }
        }
        return listIndex;
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
            if(this.cacheMatrix[i] == this.ID_BONUS)
                this.listItem[i].EndAnimPreWin();
        }
    },
});
