cc.Class({
    extends: require("SpinColumnController"),

    ctor() {
        this.isTowerFall = false;
        this.timeRun = 1,0;
    },

    properties: {
    },


    PlaySpinTowerFall(listStopObj) {
        this.isGetResult = false;
        this.node.active = true;
        this.isTowerFall = true;
        this.currentSpeed = this.speed;
        this.isSpeedUp = false;
        this.timeRun = 0.8;
    },

    PushOnBottom() {
        this.listItem[this.listItem.length-1].y = this.startPos- this.distanceY * this.numberRow ;//this.listItem[0].y + this.distanceY;
        let newList = [];
        newList[0] = this.listItem[this.listItem.length-1];
        for(let i = 0; i < this.listItem.length-1; i++) {
            newList[newList.length] = this.listItem[i];
        }
        this.listItem = newList;
        this.RandomImage(this.listItem[0]);
    },

    EndSpinBottom() {
        this.isTowerFall = false;
        let listItemSlot = this.slotView.spinManager.listItem;
        for(let j = 0; j < this.numberRow; j++) {
            listItemSlot[this.indexSpin+j*this.numberColumn].node.active = true;
        }
        this.slotView.spinManager.OnSpinDoneBottom(this.indexSpin);
        this.node.active = false;
    },

    update(dt) {
        this._super(dt);
        if(this.isTowerFall) {
            this.timeRun -= dt;
            for(let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].y += this.currentSpeed * dt;
            }
            // if(this.listItem[this.listItem.length-1].y <= this.startPos - this.distanceY * this.numberRow) {
            //     this.PushOnBot();
            // }
            if(this.listItem[this.listItem.length-1].y >= this.startPos ) {
                this.PushOnBottom();
            }
            if(this.timeRun <= 0){
                if(this.nodeEnd == null) {
                    this.EndSpinBottom();
                    cc.log("nodeEnd null");
                    return;
                }
                if(this.nodeEnd.y <= this.startPos) {
                    cc.log("nodeEnd startPos");
                    this.EndSpinBottom();
                }
            }
        }
    },
});
