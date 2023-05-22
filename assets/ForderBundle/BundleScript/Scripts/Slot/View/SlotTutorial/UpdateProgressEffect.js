

cc.Class({
    extends: cc.Component,
    ctor() {
        this.isPlay = false;
        this.countTime = 0;
        this.endTime = 0;
        this.target = 0;
        this.type = 0;
        this.lastValue = 0;
        this.speed = 0;
        this.currentValue = 0;
        this.contentObj = null;
    },

    properties: {
        lengthImg : 1,
    },

    onLoad() {
        this.GetUI();
    },

    GetUI() {
        if(!this.img) {
            this.img = this.getComponent(cc.Sprite);
            this.lb = this.getComponent(cc.Label);
            if(this.img)
                this.img.fillRange = 0;
        }
    },

    Reset() {
        this.isPlay = false;
        this.countTime = 0;
        this.endTime = 0;
        this.target = 0;
        this.type = 0;
        this.lastValue = 0;
        this.speed = 0;
        this.currentValue = 0;
        if(this.img) {
            this.img.fillRange = 0;
        }
        if(this.lb)
            this.lb.string = "0%";
    },

    UpdateFillRange(value, time) {
        this.GetUI();
        if(!this.node.activeInHierarchy) {
            this.img.fillRange = value*this.lengthImg;
            return;
        }
        this.isPlay = true;
        this.countTime = 0;
        this.endTime = time;
        this.target = value;
        this.type = 1;
        this.speed = (value - this.img.fillRange/this.lengthImg)/time;
    },

    UpdatePercent(value, time) {
        this.GetUI();
        if(!this.node.activeInHierarchy) {
            this.lb.string = parseInt(value)+"%";
            return;
        }
        this.isPlay = true;
        this.countTime = 0;
        this.endTime = time;
        this.target = value;
        this.type = 2;
        this.speed = (value - this.lastValue)/time;
    },

    ShowTick(delayTime) {
        if(!this.node.activeInHierarchy) {
            this.node.active = true;
            this.node.scale = 0.6;
            return;
        }
        if(this.node.active)
            return;
        Global.Helper.LogAction("quest success");
        this.scheduleOnce(()=>{
            this.node.active = true;
            this.node.scale = 3;
            this.node.runAction(cc.scaleTo(0.5, 0.6));
        } ,  delayTime);
    },

    UpdateWidth(value, time, contentObj) {
        this.GetUI();
        if(!this.node.activeInHierarchy) {
            if(contentObj != null)
                contentObj.UpdateProgress(false);
            this.node.width = value;
            this.node.children[0].active = false;
            return;
        }
        this.contentObj = contentObj;
        if(value == this.node.width)
            return;
        this.isPlay = true;
        this.countTime = 0;
        this.endTime = time;
        this.target = value;
        this.type = 4;
        this.speed = (value - this.node.width)/time;
        if(value > this.node.width) {
            this.node.children[0].active = true;
        } else {
            this.node.children[0].active = false;
        }
    },

    update(dt) {
        if(this.isPlay) {
            this.countTime += dt;
            if(this.type == 1) {
                this.img.fillRange += this.speed * dt*this.lengthImg;
            }
            if(this.type == 2) {
                this.currentValue += this.speed * dt;
                this.lb.string = parseInt(this.currentValue)+"%";
            }
            if(this.type == 4) {
                this.node.width += this.speed * dt;
                this.node.children[0].width = this.node.width;
                if(this.contentObj != null)
                    this.contentObj.UpdateProgress(true);
            }
            if(this.countTime >= this.endTime) {
                this.isPlay = false;
                this.lastValue = this.target;
                this.currentValue = this.lastValue;
                if(this.type == 1)
                    this.img.fillRange = this.target*this.lengthImg;
                else if(this.type == 2)
                    this.lb.string = parseInt(this.target)+"%";
                else if(this.type == 4) {
                    if(this.contentObj != null)
                        this.contentObj.UpdateProgress(false);
                    this.node.width = this.target;
                    this.node.children[0].active = false;
                }
                    
            }
        }
    },
});
