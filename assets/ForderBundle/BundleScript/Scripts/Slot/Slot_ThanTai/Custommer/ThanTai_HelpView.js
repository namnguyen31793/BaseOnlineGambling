// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("PopupViewBase"),

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onEnable()
    {
        this.Animation_ShowPopup();
    },

    onClick_On()
    {

    },

    onClick_Off()
    {
        this.Animation_ClosePopup(()=>{
            require("ThanTaiSpinController").getIns().mainView.Destroy_HelpView();
        });
        
    }
    // update (dt) {},
});
