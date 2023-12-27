var slotsConfig = require('EffectType');

cc.Class({
    extends: require("SpinEffectBase"),

    properties: {
        WinEffect_Spine : sp.Skeleton,
        WinLabel: require("LabelIncrement"),
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        this.WinEffect_Spine.node.active = false;
        this.WinLabel.node.active = false;
    },

    ShowEffect(type, rewardAmount , time)
    {
        cc.log("INPUT --- SHOW EFFECT--> rewardAmount: "+rewardAmount);
        let animationName = "";
        let isShowEffect = false;
        switch (type) {
        case  slotsConfig.JACKPOT:
            cc.log(">>>>>>>>>>>>>>>>>>>> JACKPOT EFFECT --------> ");
            isShowEffect = true;
            
            animationName = "NoHu_thantai";
            this.WinLabel.node.active = true;
            this.WinLabel.tweenValueto(rewardAmount);
            require("AudioController").getIns().playSound(cc.AudioTypes.JACKPOT);
            break;
        case  slotsConfig.SUPER_WIN:
            isShowEffect = true;
            animationName = "bigwin_ech_op";
            this.WinLabel.node.active = true;
            this.WinLabel.tweenValueto(rewardAmount);
            break;
        case  slotsConfig.FREESPIN:
            isShowEffect = true;
            animationName = "freespin";
            
            break;
        case  slotsConfig.NORMAL_WIN:
            break;
        }

        if(isShowEffect)
        {
            cc.log("SHOW EFFECT--> : "+animationName);
            this.WinEffect_Spine.node.active = true;
             this.WinEffect_Spine.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === animationName) {
                cc.log("END EFFECT: "+animationName);
                this.node.active = false;        
             }
        });
        this.WinEffect_Spine.setAnimation(0,animationName,false);
        }

    },

    ResetAllEffect()
    {
        this.WinEffect_Spine.node.active = false;
        this.WinLabel.setValueText(0);
        this.WinLabel.node.active = false;
        this.node.active = false;
    },
    
});
