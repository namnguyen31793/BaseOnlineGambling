var DEFAUT_SIZE_NAME = 90;

cc.Class({
    extends: cc.Component,

    properties: {
        imgAvata : cc.Sprite,
        imgNation : cc.Sprite,
        lbLevel : cc.Label ,
        lbName : cc.RichText
    },

    Setup(info){
        Global.Helper.GetAvataOtherById(this.imgAvata, info.AccountId);
        Global.Helper.GetNationRandom(this.imgNation, info.AccountId);
        let lvl = info.VipLevel;
        if(info.VipLevel == 0)
            lvl = 1;
        this.lbLevel.string = lvl;
        let message = "";
        let random = Global.RandomNumber(0, 100);
        if(random > 80){
            message = "<color=#FFF14B>" + ' on auto spin' + "</c>" ;
        }else if(random > 60){
            message = "<color=#FFF14B>" + ' on spin' + "</c>" ;
        }else if(random > 50){
            message = "<color=#FFF14B>" + ' on play' + "</c>" ;
        }
        this.lbName.node.setPosition(cc.v2(0, 0));
        this.lbName.string = info.Nickname+message;
        this.scheduleOnce(()=>{
            this.PlayAnimText(this.lbName.node.width, info.Nickname);
		} , 0.5);
    },

    PlayAnimText(width, name){
        this.lbName.node.stopActionByTag(1);
        if(width >= DEFAUT_SIZE_NAME){
            let length = width - DEFAUT_SIZE_NAME + 5;
            if(length < 5)
                length = 5;
            let time = (length/10);
            let action1 =  cc.callFunc(() => { 
                this.lbName.node.runAction(cc.moveTo(time, cc.v2(-1*length,0)).easing(cc.easeSineOut()));
            });
            let action2 =  cc.callFunc(() => { 
                this.lbName.node.runAction(cc.moveTo(time, cc.v2(length, 0)).easing(cc.easeSineOut()));
            });
            var seq = cc.repeatForever(
                cc.sequence(
                    action1, cc.delayTime(time+0.5), action2)
                );
            this.lbName.node.runAction(seq).setTag(1);;
        }else{
            this.lbName.node.setPosition(cc.v2(0, 0));
        }
    },
});
