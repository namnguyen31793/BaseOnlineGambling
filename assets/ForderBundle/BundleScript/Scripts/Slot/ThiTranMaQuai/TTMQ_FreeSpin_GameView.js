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
        this.freeSpinCount = 0;
    },

    properties: {
        Freespin_Counter_Lb : cc.Label,
        FreeSpin_Info_Panel : cc.Node,
        FreeSpin_StartEffect_Ske : sp.Skeleton,
        Block_Panel :  cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("ThanTaiSpinController").getIns();
        this.spinController.setFreeGameView(this);
    },
    onEnable()
    {
        this.Block_Panel.active = true;
       this.ShowAnimation_StartEffect();
        
    },

    ShowAnimation_StartEffect()
    {
        this.FreeSpin_StartEffect_Ske.node.active = true;
        this.FreeSpin_StartEffect_Ske.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'FreeSpin') {
                this.FreeSpin_StartEffect_Ske.node.active = false;    
                this.Block_Panel.active = false; 
             }
        });
        this.FreeSpin_StartEffect_Ske.setAnimation(0,'FreeSpin',false);
    },

    start () {

    },

    FreeSpin_SetUp(freespinCounter)
    {  
        this.Freespin_Counter_Lb.string = freespinCounter;
        this.FreeSpin_Info_Panel.active = true;
    },
    FreeSpin_UpdateInfo(freespinCounter)
    {
        this.Freespin_Counter_Lb.string = freespinCounter;
        this.FreeSpin_Info_Panel.active = true;
        if(freespinCounter == 0)
        {
            this.node.active = false;
            this.node.destroy();
        }
    },
    onDestroy()
    {
        this.spinController.setFreeGameView(null);
    },
   

    // update (dt) {},
});
