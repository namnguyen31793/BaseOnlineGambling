cc.Class({
    extends: require("SpinColumnController"),

    properties: {
        itemBig : require("ItemMaya"),
    },

    RandomImage(item) {
        this.slotView.itemManager.SetImageBig(Global.RandomNumber(4,10), item.getComponent("ItemSlotView"), 3);
    },

    SetImage(id, item, indexMatrix) {
        this.slotView.itemManager.SetImageBig(id, item, indexMatrix);
    },
    
    GetResult(index, matrix) {
        this.indexSpin = index;
        let point = 0;
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.listItem[i].y < this.startPos + this.distanceY) {
                point = i;
                break;
            }
        }
        this.SetImage(matrix[1], this.listItem[point-this.numberRow].getComponent("ItemSlotView"), index);
        this.nodeEnd = this.listItem[point-this.numberRow];
        this.isGetResult = true;
    },

    EndSpin() {
        this.isSpin = false;
        this.slotView.PlaySpinStop();
        this.slotView.spinManager.OnSpinDone(this.indexSpin);
        this.node.active = false;
        this.itemBig.node.active = true;
    },
});
