
cc.Class({
    extends: cc.Component,

    properties: {
        avata : cc.Sprite,
        stringContent : cc.RichText,
    },

    Setup(info){
        this.node.active = true;
        Global.Helper.GetAvataOtherById(this.avata, info.AccountId);
        this.stringContent.string = info.Nickname+" "+"<color=#EEE518>"+Global.Helper.formatNumber(info.Gold) +"</color>";
    },

    Clear(){
        this.node.active = false;
    },
});
