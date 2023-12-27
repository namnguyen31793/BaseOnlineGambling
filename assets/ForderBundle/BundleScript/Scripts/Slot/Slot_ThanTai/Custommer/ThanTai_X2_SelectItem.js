// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       Bag_Img : cc.Node,
       Gold_Object : cc.Node,
       Fall_Object : cc.Node,
       Win_EffectObject : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
 
    onEnable()
    {
      this.Handle_ResetUI();
    },

    Handle_ResetUI()
    {
        this.Bag_Img.active = true;
        this.Gold_Object.active = false;
        this.Fall_Object.active = false;
        this.Win_EffectObject.active = false;
    },

   
    Handle_ShowReward(isReward,isShowEffect)
    {
        this.Bag_Img.active = false;
        this.Gold_Object.active = false;
        this.Fall_Object.active = false;
        if(isReward)
        {
            this.Gold_Object.active = true;
            if(isShowEffect)
            this.Win_EffectObject.active = true;
        }
        else
            this.Fall_Object.active = true;
    }

    // update (dt) {},
});

