cc.Class({
    extends: cc.Component,

    properties: {
        ava : cc.Sprite,
        cardValue : cc.Label,
        lbMoney : cc.Label,
        lbName : cc.Label,
        iconIphone : cc.Node,
        iconCard : cc.Node,
    },

    initItem(info) {
        cc.log(info);
        this.lbName.string = Global.Helper.formatName(info.DisplayName, 9);
        if(info.DisplayName == Global.MainPlayerInfo.nickName) {
            Global.Helper.GetAvata(this.ava);
        } else {
            Global.Helper.GetAvataOther(this.ava, info.DisplayName);
        }
        if(info.ExtendDescription.includes("VIETTEL") || info.ExtendDescription.includes("VINA") || info.ExtendDescription.includes("MOBI")) {
            this.lbMoney.node.active = false;
            this.iconIphone.active = false;
            this.iconCard.active = true;
            this.cardValue.node.active = true;
            let w = info.ExtendDescription.split(" ");
            this.cardValue.string = w[1];
        } else {
            if(info.ExtendDescription.includes("IPHONE")) {
                this.lbMoney.node.active = false;
                this.iconIphone.active = true;
                this.iconCard.active = false;
                this.cardValue.node.active = false;
            } else {
                this.lbMoney.node.active = true;
                this.iconIphone.active = false;
                this.iconCard.active = false;
                this.cardValue.node.active = false;
                this.lbMoney.string = info.ExtendDescription;
            }
            
        }
    },
});
