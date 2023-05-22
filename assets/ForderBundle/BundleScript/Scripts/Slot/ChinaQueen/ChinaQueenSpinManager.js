cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.listLengthmatrix;
    },

    properties: {
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 6;
        this.NUMBER_ITEM_ABOVE = 6;
        this.NUMBER_ITEM_BELOW = 6;
        this.NUMBER_SPEED = 16;
        this.ID_GOLD_QUEEN = 3;
        this.TIME_SPIN = 0.05;
        this.TIME_BACK = 0.8;
        this.TIME_ACTION = 0.4;
        this.TIME_DISTANCE_COLUMN = 0.06;
    },

    SetPreWin() {
        this.ID_FREE = 2;
        this.listIdPreWin[0] = this.ID_FREE;
        this.listCountPreWin[0] = 2;
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

    UpdateLengthMatrix(lengthmatrix){
        this.listLengthmatrix = lengthmatrix;
        cc.log("---update maxtrix----");
        cc.log(this.listLengthmatrix);
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
            }
        }
    },

    ChangeItemEffect(matrix) {
        cc.log("ChangeItemEffect:"+this.stateSpin);
        if(this.stateSpin == 2) {
            if(!this.slotView.isFree){
                for(let i = 0; i < matrix.length; i++) {
                    this.slotView.itemManager.ShowAnimGem(matrix[i], this.listItem[i], i);
                }
            }
            this.slotView.toDoList.DoWork();
        }
    },

    ChangeQueenEffectFree(){
        let isHaveGoldQueen = this.CheckHaveGoldQueen(this.cacheMatrix);
        for(let i = 0; i < this.cacheMatrix.length; i++) {
            this.slotView.itemManager.SetAnimChangeQueen(this.cacheMatrix[i], this.listItem[i], i, isHaveGoldQueen);
        }
    },

    ChangeItemEffectFree(index){
        this.slotView.itemManager.SetAnimChangeItemFree(this.cacheMatrix[index], this.listItem[index], index);
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
                if(j >= (this.NUMBER_ROW - this.listLengthmatrix[i])){
                    for(let k = 0; k < this.listIdPreWin.length; k++) {
                        if(this.cacheMatrix[i+j*this.NUMBER_COLUMN]%20 == this.listIdPreWin[k]) {
                            listCount[k] += 1;
                            if(listCount[k] >= this.listCountPreWin[k] && listIndex[k] == -1) {
                                listIndex[k] = i;
                            }
                        }
                    }
                }
            }
        }
        return listIndex;
    },

    ShowAnimPreWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i]%20 == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },

    EndItemFreePreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.cacheMatrix[i]%20 == this.ID_FREE)
                this.listItem[i].EndAnimPreWin();
        }
    },

    CheckHaveGoldQueen(matrix){
        var isHave = false;
        for(let i = 0; i < matrix.length; i++) {
            if(matrix[i]%20 == this.ID_GOLD_QUEEN)
                isHave = true;
        }
        return isHave;
    },
});
