var TIME_UP = 0.15;
var SUB_DIS_UP = 5;
var TOTAL_DIS_UP = 30;
cc.Class({
    extends: require("SpinColumnController"),

    ctor() {
        this.numbAbove = 0;
        this.itemFallRandom = null;
        this.TIME_DELAY_ITEM = 0.03;
        this.TIME_DELAY_2 = 0.08;
        this.TIME_FALL_OUT = 0.4;
        this.TIME_FALL_ITEM = 0.15;
        this.TIME_FALL_2 = 0.4;
        this.TIME_FREEDOM = 0.25;
    },

    CreateSpinColumn(slotView, startObj, distanceY, numberItemAbove, numberItemBelow, numberRow, numberColumn, numberSpeed) {
        this.slotView = slotView;
        this.distanceY = distanceY;
        this.startPos = startObj.y;
        this.numberRow = numberRow;
        this.numberColumn = numberColumn;
        this.numberSpeed = numberSpeed;
        this.speed = this.distanceY * this.numberSpeed;
        for(let j = numberItemAbove-1; j >= 0; j--) {
            let nodeHight = cc.instantiate(startObj);
            nodeHight.parent = this.node;
            nodeHight.setPosition(cc.v2(startObj.x, startObj.y + distanceY * (j+1)));
            this.listItem[this.listItem.length] = nodeHight;
        }
        this.itemFallRandom = cc.instantiate(startObj);
        this.itemFallRandom.parent = this.node;
        this.itemFallRandom.setPosition(cc.v2(startObj.x, 800));
        this.itemFallRandom.active = false;
    },

    SetSpeedMobile() {
        this.speed = this.speed*2;
        if (cc.sys.isNative) {
            this.speed = this.speed*3;
            this.TIME_DELAY_ITEM = 0.03;
            this.TIME_DELAY_2 = 0.06;
            this.TIME_FALL_OUT = 0.33;
            this.TIME_FALL_ITEM = 0.13;
            this.TIME_FALL_2 = 0.33;
            this.TIME_FREEDOM = 0.22;
        }
    },

    PlaySpin(listStopObj) {
        this._super();
        let length = this.listItem.length;
        this.numbAbove = 0;
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].active = true;
        }
        for(let i = 0; i < length; i++) {
            this.listItem[length-i-1].setPosition(listStopObj.children[length-i-1].getPosition());
            this.listItem[length-i-1].getComponent("ItemSlotView").CloneImage(listStopObj.children[length-i-1].getComponent("ItemSlotView"), this.slotView.itemManager.useSpine);
            this.FallOut(this.listItem[length-i-1], i*this.TIME_DELAY_ITEM, this.TIME_FALL_OUT);
        }
        this.scheduleOnce(()=>{
            this.slotView.spinManager.OnFallOutDone();
        } , ((length-1)*this.TIME_DELAY_ITEM+this.TIME_FALL_OUT));  
    },

    FallOut(item,delayTime, timeFall) {
        item.stopActionByTag(1);
        item.stopActionByTag(2);
        //item.runAction(cc.sequence(cc.delayTime(delayTime-0.4), cc.rotateTo(0.2,0)));
        item.runAction(cc.sequence(cc.delayTime(delayTime),cc.moveTo(timeFall, cc.v2(item.x, item.y - this.distanceY * 6)))).setTag(1);
        
    },

    FallItem(item,delayTime, timeFall, indexRow, step) {
        let y = item.y;
        // item.runAction(cc.sequence(cc.delayTime(delayTime),cc.moveTo(timeFall, cc.v2(item.x, y - (TOTAL_DIS_UP-(6-indexRow)*SUB_DIS_UP) - this.distanceY * step))));
        // item.runAction(cc.sequence(cc.delayTime(delayTime+timeFall),cc.moveTo(TIME_UP,  cc.v2(item.x, y - this.distanceY * step))));
        // this.scheduleOnce(()=>{
        // } , (delayTime+timeFall));   
        item.stopActionByTag(1);
        item.stopActionByTag(2);
        item.runAction(cc.sequence(cc.delayTime(delayTime),cc.moveTo(timeFall, cc.v2(item.x, y - this.distanceY * step)))).setTag(1);
        item.runAction(cc.sequence(cc.delayTime(delayTime+timeFall),cc.rotateTo(0.08,Global.RandomNumber(-7,0)),cc.rotateTo(0.08,0))).setTag(2);
        this.scheduleOnce(()=>{
        } , (delayTime));  
    },

    CreateItemWait(index) {
        this.RandomImage(this.listItem[0]);
        this.itemFallRandom.active = true;
        this.itemFallRandom.setPosition(cc.v2(this.itemFallRandom.x, this.distanceY + this.startPos));
        this.FallOut(this.itemFallRandom,0, this.TIME_FREEDOM);
        this.scheduleOnce(()=>{
            this.itemFallRandom.active = false;
            this.slotView.spinManager.OnFallRandomDone(index);
        } , this.TIME_FREEDOM);
    },

    RandomImage(item) {
        this.slotView.itemManager.SetImage(Global.RandomNumber(4,9), item.getComponent("ItemSlotView"), 3);
    },

    GetResult(index, matrix) {
        let listRs = [];
        this.node.y = 0;
        this.indexSpin = index;
        for(let i = 0; i < this.numberRow; i++) {
            let indexMatrix = index + this.numberColumn*i;
            listRs[i] = matrix[indexMatrix];
            this.SetImage(listRs[i], this.listItem[i].getComponent("ItemSlotView"), indexMatrix);
        }
        let length = this.listItem.length;
        for(let i = 0; i < length; i++) {
            this.listItem[i].setPosition(cc.v2(this.listItem[i].x, this.startPos-i*this.distanceY+this.distanceY*6));
        }
        for(let i = 0; i < length; i++) {
            this.FallItem(this.listItem[length-i-1], i*this.TIME_DELAY_ITEM, this.TIME_FALL_ITEM, i, 6);
        }
        this.scheduleOnce(()=>{
            this.slotView.spinManager.OnSpinDone(this.indexSpin);
            for(let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].active = false;
            }
        } , 3 * this.TIME_DELAY_ITEM + this.TIME_FALL_ITEM + TIME_UP);
    },

    AddAboveItem(numbAbove, matrix, countDelay) {
        this.node.active = true;
        if(numbAbove != null) {
            this.numbAbove = numbAbove;
            for(let i = 0; i < numbAbove; i++) {
                this.listItem[i].active = true;
                let indexMatrix = this.indexSpin + this.numberColumn*i;
                this.listItem[i].y = this.startPos + this.distanceY * (numbAbove - i);
                this.SetImage(matrix[indexMatrix], this.listItem[i].getComponent("ItemSlotView"), indexMatrix);
            }
            for(let i = 0; i < numbAbove; i++) {
                this.FallItem(this.listItem[numbAbove-i-1], countDelay * this.TIME_DELAY_2, this.TIME_FALL_2/4*(numbAbove-i), i, numbAbove);
                countDelay += 1;
            }
        }
    },

    AddBelowItem(step, currentIndex, matrix, indexDelay) {
        this.numbAbove += 1;
        this.listItem[this.numbAbove-1].active = true;
        let indexRow = parseInt(currentIndex/5);
        let indexMatrix = this.indexSpin + this.numberColumn*indexRow;
        this.listItem[this.numbAbove-1].y = this.startPos - this.distanceY * indexRow;
        this.SetImage(matrix[indexMatrix], this.listItem[this.numbAbove-1].getComponent("ItemSlotView"), indexMatrix);
        //tat ca item tren cot den noi cung luc
        this.FallItem(this.listItem[this.numbAbove-1], indexDelay * this.TIME_DELAY_2, this.TIME_FALL_2 * step/6 / ((6-indexRow)/6), indexRow, step);
        //item trong cot co toc do roi nhu nhau
        // this.FallItem(this.listItem[this.numbAbove-1], indexDelay * TIME_DELAY_2, TIME_FALL_2/4*step, indexRow, step);
        
    },

    EndFall() {
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].active = false;
        }
        this.numbAbove = 0;
    },

    update(dt) {

    },
});
