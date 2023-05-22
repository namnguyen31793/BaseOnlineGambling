cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
    },

    SetUp(data) {
        this.node.active = true;
        this.data = data;
        this.lbName.string = data.name+" ("+data.code+")";
    },

    OnClick() {
        Global.ShopPopup.bank.SelectBank(this.data);
    },

    OnClickBankOut() {
        Global.ShopPopup.bankOut.SelectBank(this.data);
    },

    
});
