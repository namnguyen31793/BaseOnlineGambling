// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        WinLabel : cc.Label,
        BiNgo_Skeleton: sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
     
    },
    onEnable()
    {
        this.WinLabel.node.active = false;
        this.BiNgo_Skeleton.setAnimation(0,'Bonus_Bi_Chon',true);
    },

    start () {

    },

    onClick(rewardValue)
    {
        if(rewardValue == 0)
        {
            this.BiNgo_Skeleton.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'Bonus_Bi_Heo') {               
                    this.warningJackpot.setAnimation(0,'Bonus_Bi_Heo_Idle',true);
                 }
            });
            this.BiNgo_Skeleton.setAnimation(0,'Bonus_Bi_Heo',false);
        }
        else
        {  
            this.WinLabel.node.active = true;
            this.WinLabel.string = "+"+rewardValue;
            this.WinLabel.node.setPosition(cc.v2(0,-50));
            const tween = cc.tween(this.WinLabel.node);
            // Define the initial position
            tween.to(0.5, { position: cc.v2(0, 0) });
            // Start the Tween
            tween.start();
            this.BiNgo_Skeleton.setAnimation(0,'Bonus_Bi_DaChon',false);
        }
    },
    
});
