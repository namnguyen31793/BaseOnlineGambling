// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.countTime = 0;
        this.checkTime = 0;
        this.callbackFunc = null;
        this.isStart = false;
    },

    properties: {
       
    },

    onLoad()
    {

    },

    startAuto() {
        this.isStart = true;
    },
    stopAuto() {
        this.isStart = false;
    },
    resetTime()
    {
        this.countTime = 0;
    },
    SetupTime(time,callbaclFunc)
    {
        this.checkTime = time;
        this.callbackFunc = callbaclFunc;
        this.isStart = true;
    },
    update: function (dt) {
        if (this.isStart) {
            this.countTime += dt;
            if ( this.countTime > this.checkTime) {
                this.isStart = false;
                this.countTime = 0;
                if(this.callbackFunc != null)
                    this.callbackFunc();
            }
        }
    },
});
