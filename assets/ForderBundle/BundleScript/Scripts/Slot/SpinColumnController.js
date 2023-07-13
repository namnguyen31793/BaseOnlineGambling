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
        this.isSpeedUp = false;
        this.startPos = 0;
        this.distanceY = 0;
        this.numberRow = 0;
        this.numberColumn = 0;
        this.speed = 0;
        this.listItem = [];
        this.slotView = null;
        this.nodeEnd = null;
        this.indexSpin = 0;
        this.numberSpeed = 0;
        this.currentSpeed = 0;
    },

    CreateSpinColumn(slotView, startObj, distanceY, numberItemAbove, numberItemBelow, numberRow, numberColumn, numberSpeed) {
        cc.log("Start Object: "+ startObj);
        this.slotView = slotView;
        this.distanceY = distanceY;
        this.startPos = startObj.y;
        this.numberRow = numberRow;
        this.numberColumn = numberColumn;
        this.numberSpeed = numberSpeed;
        this.speed = this.distanceY * this.numberSpeed;
        let node = cc.instantiate(startObj);
        node.parent = this.node;
        for(let j = numberItemAbove-1; j >= 0; j--) {
            let nodeHight = cc.instantiate(startObj);
            nodeHight.parent = node.parent;
            nodeHight.setPosition(cc.v2(node.x, node.y + distanceY * (j+1)));
            this.listItem[this.listItem.length] = nodeHight;
            this.RandomImage(nodeHight);
        }
        this.listItem[this.listItem.length] = node;
        for(let j = 0; j < numberItemBelow; j++) {
            let nodeLow = cc.instantiate(startObj);
            nodeLow.parent = node.parent;
            nodeLow.setPosition(cc.v2(node.x, node.y - distanceY * (j+1)));
            this.listItem[this.listItem.length] = nodeLow;
            this.RandomImage(nodeLow);
        }
        this.SetSpeedMobile();
    },

    SetSpeedMobile() {
        // this.speed = this.speed*1.2;
        if (cc.sys.isNative) {
            this.speed = this.speed*1.2;
        }
    },

    RandomImage(item) {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        this.slotView.itemManager.SetImage(r, item.getComponent("ItemSlotView"));
    },

    SetImage(id, item, indexMatrix) {
        this.slotView.itemManager.SetImage(id, item);
    },

    PlaySpin(listStopObj) {
        this.isGetResult = false;
        this.node.active = true;
        this.isSpin = true;
        this.currentSpeed = this.speed;
        this.isSpeedUp = false;
    },

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
            let node = this.listItem[point-this.numberRow+i];
            if(node != null) {
                this.SetImage(listRs[i], node.getComponent("ItemSlotView"), indexMatrix);
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
        this.RandomImage(this.listItem[0]);
    },

    EndSpin() {
        this.isSpin = false;
        this.slotView.PlaySpinStop();
        let listItemSlot = this.slotView.spinManager.listItem;
        for(let j = 0; j < this.numberRow; j++) {
            listItemSlot[this.indexSpin+j*this.numberColumn].node.active = true;
        }
        this.slotView.spinManager.OnSpinDone(this.indexSpin);
        this.node.active = false;
    },

    SpeedUp() {
        this.isSpeedUp = true;
    },

    update(dt) {
        if(this.isSpeedUp) {
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
                //fix tạm
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
});
