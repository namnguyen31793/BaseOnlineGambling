// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends:  require("HoldToSpin"),

    properties: {
        spinView: require("SpinViewBase"),
        SpinSkeleton : sp.Skeleton,
    },

    update: function (dt) {
        if (this.holdStart) {
            this.holdTime += dt;
            if (this.sendEventHold === false && this.holdTime >= 1) {
                this.sendEventHold = true;
                this.eventHold();
            }
        }
    },
    TouchStart: function () {
        this.holdStart = true;
        this.holdTime = 0;
        this.sendEventHold = false;
    },

    TouchCancel: function () {
        this.holdStart = false;
        this.sendEventHold = false;
        this.callSpin();
    },

    TouchEnd: function () {
        this.holdStart = false;
        this.sendEventHold = false;
        this.callSpin();
    },
    callSpin: function () {
        if (this.holdTime < 1) {
           
            if(this.isStart)
            {
               this.cancelAutoSpin();
                return;
            }
          
            if (!this.spinView.isSpining) {    
                this.stopAuto();            
                this.spinView.onClick_Spin();
               // this.ShowAnimation_Stop();
            }
        }
    },
    eventHold: function () {
        this.startAuto();
        this.spinView.onClick_AutoSpin();
        this.ShowAnimation_Stop();
    },
    cancelAutoSpin()
    {
        this.stopAuto();
        this.spinView.onClick_AutoSpin();
        this.ShowAnimation_Spining();
    },
     ShowAnimation_Spining()
    {
        this.SpinSkeleton.node.active = true;
        this.SpinSkeleton.setAnimation(0,'Spin',false);
    },

    ShowAnimation_Stop()
    {
        this.SpinSkeleton.node.active = true;
        this.SpinSkeleton.setAnimation(0,'Spin_Stop',false);
    },
    ShowAnimation_Hold()
    {
        this.SpinSkeleton.setAnimation(0,'Spin_Hold',false);
    }
    
});
