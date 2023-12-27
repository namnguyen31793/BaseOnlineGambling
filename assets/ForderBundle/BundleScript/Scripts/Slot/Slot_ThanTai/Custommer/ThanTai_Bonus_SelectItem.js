// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFallIcons: cc.SpriteFrame,
        WinLabel : cc.Label,
        Icon_Img : cc.Sprite,
        Fall_icon : cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spriteImg = this.node.getComponent(cc.Sprite);
        this.Icon_Img.node.active = true;
    },
    onEnable()
    {
        this.WinLabel.node.active = false;
        this.Fall_icon.node.active = false;
    },

    start () {

    },

    onClick(rewardValue)
    {
        this.Icon_Img.node.active = false;
        if(rewardValue == 0)
        {
            this.Fall_icon.node.active = true;
            let targetNode = this.Fall_icon.node;
            // Khởi tạo tween
            let scaleTween = cc.tween(targetNode)
                .to(0.25, { scale: 1.3 }) // Tween tỷ lệ lên 1.3 trong 0.5 giây
                .to(0.25, { scale: 1 })   // Tween tỷ lệ trở lại 1 trong 0.5 giây
            // Chạy tween
            scaleTween.start();
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
        }
    },
    
});
