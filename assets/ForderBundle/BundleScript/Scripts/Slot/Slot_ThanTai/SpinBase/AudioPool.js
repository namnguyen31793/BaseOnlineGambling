// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
 
    properties: {
    
    },

    onLoad: function () {
        this.SetupAudioPool();
        this.AudioController =  require("AudioController").getIns();
       
        this.SetupSpinController();
       
    },

    SetupAudioPool()
    {
        require("AudioController").getIns().setAudioPool(this);
    },

    SetupSpinController()
    {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setAudioPool(this);
    }
});
