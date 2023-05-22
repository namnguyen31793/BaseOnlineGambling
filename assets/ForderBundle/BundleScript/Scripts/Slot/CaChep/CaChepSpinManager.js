cc.Class({
    extends: require("SpinManager"),

    properties: {
        
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 4;
        this.NUMBER_ITEM_ABOVE = 6;
        this.NUMBER_ITEM_BELOW = 5;
        this.NUMBER_SPEED = 12;
        this.TIME_SPIN = 0.1;
        this.TIME_DISTANCE_COLUMN = 0.1;
    },

    SetPreWin() {
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.listIdPreWin[0] = this.ID_BONUS;
        this.listIdPreWinIncrease[0] = this.ID_FREE;
        this.listCountPreWin[0] = 5;
        this.listCountPreWinIncrease[0] = 2;
        // this.listCountPreWin[1] = 2;
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

    CheckSpinColumn(item, index) {
        if(item.x == this.slotView.freeManager.wildColumn.node.x) {
            this.slotView.freeManager.wildColumn.node.active = false;
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
    
});
