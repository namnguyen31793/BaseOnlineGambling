
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.SpinEffect_Setup();
    },

    SpinEffect_Setup()
    {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setEffectView(this);
    },

    start () {

    },

    ShowEffect(type, rewardAmount, time)
    {

    },

    ResetAllEffect()
    {
        
    },
    FinishAllEffect()
    {
        
    }

});
