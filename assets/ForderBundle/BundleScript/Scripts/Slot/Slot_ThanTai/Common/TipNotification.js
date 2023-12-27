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
        this.tipIndex = 0;
    },

    properties: {
        TipContent_Collection : [cc.Node],
        Notification_Animation : cc.Animation,
    },

    onEnable()
    {
        this.ShowAnimation_Notification();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ShowAnimation_Notification()
    {
        let callBack = ()=>{
          
            this.Notification_Animation.off("finished" , callBack);
            this.ShowTipNoti();
            this.ShowAnimation_Notification();
           }
           this.Notification_Animation.on("finished" ,callBack );
           this.Notification_Animation.play("Notification_Tip");
    },

    ShowTipNoti()
    {
        for(let i = 0;i< this.TipContent_Collection.length;i++)
        {
            this.TipContent_Collection[i].active = false;
        }
        this.TipContent_Collection[this.tipIndex].active = true;
        this.tipIndex++;
        if(this.tipIndex > this.TipContent_Collection.length)
            this.tipIndex = 0;
    }
   
});
