// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Hu_Skeleton : sp.Skeleton,
        SpriteMulti : cc.Sprite,
        SpriteMulti_Array: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },
    onEnable()
    {
        this.Hu_Skeleton.setAnimation(0,'Bonus_Hu_ChuaChon',false);
        this.SpriteMulti.node.active = false;
    },

    onClick_SelectMulti(numberBonus,multiReward,isSelect = false)  
    {
        this.Hu_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'Bonus_Hu_DaChon') {              
                this.Hu_Skeleton.setAnimation(0,'Bonus_Hu_DaChon_Idle',true);
             }
        });
        this.Hu_Skeleton.setAnimation(0,'Bonus_Hu_DaChon',false);

        this.SpriteMulti.node.active = true;
        this.SpriteMulti.spriteFrame = this.SpriteMulti_Array[multiReward-1];
        if(!isSelect)
        {
            this.SpriteMulti.node.opacity = 128;
          
        }
        else
        {
           // cc.log(">>> this.SpriteMulti.opacity = 255;");
            this.SpriteMulti.opacity = 255;
        }
        const tween = cc.tween(this.SpriteMulti.node);
        // Define the initial position
        this.SpriteMulti.node.setPosition(cc.v2(0,0));
        tween.to(0.5, { position: cc.v2(0, 180) });
        // Start the Tween
        tween.start();
    },

   

    // update (dt) {},
});
