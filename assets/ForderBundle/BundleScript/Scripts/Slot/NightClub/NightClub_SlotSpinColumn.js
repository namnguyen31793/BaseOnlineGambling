cc.Class({
    extends: cc.Component,

    properties: {

        minRandom : {
            default : 4,
        },

        maxRandom : {
            default : 10,
        },
    },

    ctor() {
        this.isSpin = false;
        this.isGetResult = false;
        this.isSpeedUpColump = false;
        this.startPos = 0;
        this.distanceY = 0;
        this.numberRow = 0;
        this.numberColumn = 0;
        this.speed = 0;
        this.listItem = [];
        this.nodeEnd = null;
        this.indexSpin = 0;
        this.numberSpeed = 0;
        this.currentSpeed = 0;
        this.slotUI = null;
    },

    InitSpinColumn(slotUI, startObj, distanceY, numberItemAbove, numberItemBelow, numberRow, numberColumn, numberSpeed) {
        this.slotUI = slotUI;
        this.distanceY = distanceY;
        this.startPos = startObj.y;
        this.numberRow = numberRow;
        this.numberColumn = numberColumn;
        this.numberSpeed = numberSpeed;
        this.speed = this.distanceY * this.numberSpeed;
        let nodeItem = cc.instantiate(startObj);
        nodeItem.parent = this.node;
        for(let j = numberItemAbove-1; j >= 0; j--) {
            let nodeHight = cc.instantiate(startObj);
            nodeHight.parent = nodeItem.parent;
            nodeHight.setPosition(cc.v2(nodeItem.x, nodeItem.y + distanceY * (j+1)));
            this.listItem[this.listItem.length] = nodeHight;
            this.RandomImageColump(nodeHight);
        }
        this.listItem[this.listItem.length] = nodeItem;
        for(let j = 0; j < numberItemBelow; j++) {
            let nodeLow = cc.instantiate(startObj);
            nodeLow.parent = nodeItem.parent;
            nodeLow.setPosition(cc.v2(nodeItem.x, nodeItem.y - distanceY * (j+1)));
            this.listItem[this.listItem.length] = nodeLow;
            this.RandomImageColump(nodeLow);
        }
        this.SetSpeedMobile();
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.speed = this.speed*1.2;
        }
    },

    PlaySpin(listStopObj) {
        this.isGetResult = false;
        this.node.active = true;
        this.isSpin = true;
        this.currentSpeed = this.speed;
        this.isSpeedUpColump = false;
    },

    GetResult(index, matrix) {
        cc.log("GetResult "+index);
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
            let node = this.listItem[point-this.numberRow+i];
            if(node != null) {
                this.SetImageSpinColump(listRs[i], node, indexMatrix);
            }
        }
        this.nodeEnd = this.listItem[point-this.numberRow];
        this.isGetResult = true;
    },

    PushOnTop() {
        this.listItem[this.listItem.length-1].y = this.listItem[0].y + this.distanceY;
        let newList = [];
        newList[0] = this.listItem[this.listItem.length-1];
        for(let i = 0; i < this.listItem.length-1; i++) {
            newList[newList.length] = this.listItem[i];
        }
        this.listItem = newList;
        this.RandomImageColump(this.listItem[0]);
    },

    SpeedUp() {
        this.isSpeedUpColump = true;
    },

    update(dt) {
        if(this.isSpeedUpColump) {
            if(this.currentSpeed < this.speed * 1.2) {
                this.currentSpeed += dt * this.speed * 0.3;
            }
            else if(this.currentSpeed < this.speed * 1.5) {
                this.currentSpeed += dt * this.speed * 0.8;
            }
            else if(this.currentSpeed < this.speed * 2) {
                this.currentSpeed += dt * this.speed;
            }
        }
        if(this.isSpin) {
            for(let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].y -= this.currentSpeed * dt;
            }
            if(this.listItem[this.listItem.length-1].y <= this.startPos - this.distanceY * this.numberRow) {
                this.PushOnTop();
            }
            if(this.isGetResult) {
                if(this.nodeEnd == null) {
                    this.EndSpin();
                    return;
                }
                if(this.nodeEnd.y <= this.startPos) {
                    this.EndSpin();
                }
            }
        }
    },

    EndSpin() {
        this.isSpin = false;
        //this.soundControl.PlaySpinStop();
        let listItemSlot = this.slotUI.listItem;
        for(let j = 0; j < this.numberRow; j++) {
            let item = listItemSlot[this.indexSpin+j*this.numberColumn].node;
            let pos = item.getPosition();
            item.active = true;
            item.runAction(cc.sequence(cc.moveTo(0.12,cc.v2(pos.x, pos.y - 15)),cc.moveTo(0.08, pos))).setTag(2);
        }
        this.slotUI.OnSpinDone(this.indexSpin);
        this.node.active = false;
    },

    SetImageSpinColump(id, item, indexMatrix) {
        this.slotUI.SetImageItem(id, item);
    },

    RandomImageColump(item) {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        this.slotUI.SetImageItem(r, item);
    },
});
