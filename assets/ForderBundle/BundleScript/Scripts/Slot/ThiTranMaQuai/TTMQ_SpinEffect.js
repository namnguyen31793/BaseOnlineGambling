var slotsConfig = require('EffectType');

cc.Class({
    extends: require("SpinEffectBase"),

    properties: {
        Charactor_Skeleton : sp.Skeleton,      
        BigWin_Skeleton : sp.Skeleton,   
        Freespin_Skeleton : sp.Skeleton,   
        Jackpot_Skeleton : sp.Skeleton,   
        WinLabel: require("LabelIncrement"),
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        this.WinLabel.node.active = false;

        this.Charactor_Skeleton.setAnimation(0,'idle',true);
        //this.Freespin_Skeleton.setAnimation(0,'FreeSpin',false);
        this.Jackpot_Skeleton.node.active = false;
        this.Freespin_Skeleton.node.active = false;
        this.BigWin_Skeleton.node.active = false;
    },

    ShowEffect(type, rewardAmount , time)
    {
       this.rewardAmount = rewardAmount;
        let animationName = "";
        let isShowEffect = false;
        switch (type) {
        case  slotsConfig.JACKPOT:      

            this.spinController.audioPool.play_Jackpot_Fx_Sound();
            isShowEffect = true;
            this.ShowAnimation_Jackpot_Opening();
            break;
        case  slotsConfig.BIG_WIN:

            this.spinController.audioPool.play_BigWin_Fx_Sound();
            isShowEffect = true;
            this.WinLabel.node.active = true;
            this.WinLabel.tweenValueto(rewardAmount);
            this.BigWin_Skeleton.node.active = true;    
            this.BigWin_Skeleton.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'animation') {
                    this.BigWin_Skeleton.node.active = false;    
                    this.WinLabel.node.active = false;   
                    this.WinLabel.setValueText(0);        
                 }
            });        
            this.BigWin_Skeleton.setAnimation(0,'animation',false);


            break;
        case  slotsConfig.FREESPIN:
            isShowEffect = true;
            this.Freespin_Skeleton.node.active = true;    
            this.Freespin_Skeleton.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'FreeSpin') {
                    this.Freespin_Skeleton.node.active = false;                  
                 }
            });        
            this.Freespin_Skeleton.setAnimation(0,'FreeSpin',false);
        
            break;
        case  slotsConfig.NORMAL_WIN:
            this.spinController.audioPool.play_CharactorSmile_Fx_Sound();
            this.ShowAnimation_WinCharactor();
            break;
        }

       
    },

    ResetAllEffect()
    {
        this.Charactor_Skeleton.setAnimation(0,'idle',true);
        this.WinLabel.setValueText(0);
        this.WinLabel.node.active = false;
        this.node.active = false;
       
    },

    ShowAnimation_WinCharactor()
    {
      

        this.Charactor_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'ChucMung') {         
                this.Charactor_Skeleton.setAnimation(0,'idle',true);
              
             }
        });
        this.Charactor_Skeleton.setAnimation(0,'ChucMung',false);
    },

    ShowAnimation_Jackpot_Opening()
    {
        this.Jackpot_Skeleton.node.active = true;
        this.Jackpot_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'Jackpot_opening') {            
               this.ShowAnimation_Jackpot_Loop();                           
             }
        });
        this.Jackpot_Skeleton.setAnimation(0,'Jackpot_opening',false);
    },

    ShowAnimation_Jackpot_Loop()
    {
        this.WinLabel.node.active = true;
        this.WinLabel.tweenValueto(this.rewardAmount);    
        this.Jackpot_Skeleton.setAnimation(0,'Jackpot_loop',true);
        this.scheduleOnce(()=>{
            this.Jackpot_Skeleton.node.active = false;    
            this.WinLabel.node.active = false;   
            this.WinLabel.setValueText(0);     
        },5);           
    }
    
});
