// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor(){
      
    },

    properties: {
       Content_Lb : cc.Label,
       finishCallbackFunc : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.BonusGame_PopupEndGame_Animation = this.node.getComponent(cc.Animation);
    },
    onEnable()
    {
        let callBack = ()=>{         
            this.BonusGame_PopupEndGame_Animation.off("finished" , callBack);
            this.Off_Popup();
           }
           this.BonusGame_PopupEndGame_Animation.on("finished" ,callBack );
           this.BonusGame_PopupEndGame_Animation.play("BonusGame_PopupEndGame_Start");

    },
    EndGamePopup_Setup(totalSelectReward,multiReward,totalReward,finishCallbackFunc)
    {
        this.Content_Lb.string = totalSelectReward+" x "+multiReward+" = "+totalReward;
        this.node.active = true;
        this.finishCallbackFunc = finishCallbackFunc;
    },
    Off_Popup()
    {
        this.scheduleOnce(()=>{
            this.node.opacity = 0;
            if(this.finishCallbackFunc != null && (typeof this.finishCallbackFunc === "function" ))
            {
              
                this.finishCallbackFunc();
            }
        },3);
    },

    start () {

    },

    // update (dt) {},
});
