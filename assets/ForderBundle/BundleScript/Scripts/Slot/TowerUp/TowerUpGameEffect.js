
cc.Class({
    extends: require("SlotGameEffect"),

    properties: {
        effectWinMoneyStep : cc.Node,
    },

    CreateWinMoneyWithMutl(value, total, multi){
        this.effectWinMoneyStep.active = true;

        var money = this.effectWinMoneyStep.getChildByName("money");
        money.getComponent("LbMonneyChange").reset();
        money.getComponent("LbMonneyChange").setMoney(value );
        this.effectWinMoneyStep.getChildByName("total").getComponent(cc.Label).string = "+"+ Global.Helper.formatNumber(total );
        this.effectWinMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "x"+ multi;
        this.effectWinMoneyStep.getComponent(cc.Animation).play("WinMoneyStep");
    },

    HideWinMoneyWithMulti(){
        this.effectWinMoneyStep.active = true;

        var money = this.effectWinMoneyStep.getChildByName("money");
        money.getComponent("LbMonneyChange").reset();
        this.effectWinMoneyStep.getChildByName("total").getComponent(cc.Label).string = "";
        this.effectWinMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "";
    },
});
