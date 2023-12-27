// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.PopupAnimation = this.node.getComponent(cc.Animation);
    },

    start () {

    },

    Animation_ShowPopup()
    {
        this.node.active = true;
        this.PopupAnimation.play("PopupBase_Show_Type1");
        this.PopupAnimation.wrapMode = cc.WrapMode.Normal;
    },

    Animation_ClosePopup(funcCallback = null)
    {
        this.node.enable = false;
        this.funcCallback = funcCallback;

        if(this.funcCallback != null && typeof this.funcCallback === "function")
        {
            this.funcCallback();
            this.funcCallback = null;
        }

        return;
        
        this.funcCallback = funcCallback;
        let callBack = ()=>{
          
            this.PopupAnimation.off("finished" , callBack);
            this.node.active = false;
            if(this.funcCallback != null && typeof this.funcCallback === "function")
            {
                this.funcCallback();
                this.funcCallback = null;
            }
                
           }
        this.PopupAnimation.on("finished" ,callBack );
        this.PopupAnimation.play("PopupBase_Show_Type1");
        this.PopupAnimation.wrapMode = cc.WrapMode.Reverse;
    },

    // update (dt) {},
});
