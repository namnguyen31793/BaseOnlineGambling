// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       BonusGame_Skeleton : sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },
 
    onEnable()
    {
      this.Handle_ResetUI();
    },

    Handle_ResetUI()
    {
        this.BonusGame_Skeleton.node.active = true;
        this.BonusGame_Skeleton.setAnimation(0,'x2-Mo',true);
    },

   
    Handle_ShowReward(isReward,isShowEffect)
    {
       
        if(isReward)
        {
            this.BonusGame_Skeleton.setCompleteListener((trackEntry) => {
                if (this.BonusGame_Skeleton.animation.name === 'x2_Thang') {          
                    this.BonusGame_Skeleton.setAnimation(0,'x2_Thang_Idle',true);
                 }
            });
            this.BonusGame_Skeleton.setAnimation(0,'x2_Thang',false);
        }
        else
        {
            this.BonusGame_Skeleton.setCompleteListener((trackEntry) => {
                if (this.BonusGame_Skeleton.animation.name === 'x2-Thua') {          
                    this.BonusGame_Skeleton.setAnimation(0,'x2_Thua_Idle',true);
                 }
            });
            this.BonusGame_Skeleton.setAnimation(0,'x2-Thua',false);
        }
    }

    // update (dt) {},
});

