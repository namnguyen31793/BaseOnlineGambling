let ID_WILD = 3;
cc.Class({
    extends: require("SpinColumnController"),

    GetResult(index, matrix) {
        let listRs = [];
        this.indexSpin = index;
        let point = 0;
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.listItem[i].y < this.startPos + this.distanceY) {
                point = i;
                break;
            }
        }
        for(let i = 0; i < this.numberRow; i++) {
            let indexMatrix = index + this.numberColumn*i;
            listRs[i] = matrix[indexMatrix];
            if(listRs[i] == ID_WILD)
                listRs[i] = Global.RandomNumber(1,10)+3;
            let node = this.listItem[point-this.numberRow+i];
            if(node != null) {
                this.SetImage(listRs[i], node.getComponent("ItemSlotView"), indexMatrix);
            }
            
        }
        this.nodeEnd = this.listItem[point-this.numberRow];
        this.isGetResult = true;
    },
});
