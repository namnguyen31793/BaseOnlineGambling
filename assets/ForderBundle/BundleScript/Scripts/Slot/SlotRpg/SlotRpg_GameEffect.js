// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbBet : cc.Label,
        lbWin : cc.Label,
        notifyObj : cc.Node,
        lbNotify : cc.Label,
        mark : cc.Node,
        bigWinEffect : require("BigWinEffect"),
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    ShowWinBetMoney(betMoney) {
        // if(betMoney > 0) {
        //     this.lbBet.string = "+"+Global.Helper.formatNumber(betMoney);
        //     this.lbBet.node.parent.getComponent(cc.Animation).play();
        // }
    },

    ShowWinMoney(winMoney) {
        this.lbWin.string = "";
        this.lbWin.node.active = true;
        this.lbWin.node.parent.getComponent(cc.Animation).play();
        this.lbWin.getComponent("LbMonneyChange")._currentMonney = 0;
        this.lbWin.getComponent("LbMonneyChange").setMoney(winMoney);
    },

    ShowBigWin(winMoney, toDoList, isUpdateWinValue = true, isUpdateWallet = false) {
        this.bigWinEffect.ShowBigWin(winMoney, this.slotView.GetBetValue(), toDoList, this.slotView, isUpdateWinValue, isUpdateWallet);
    },

    HideWinMoney() {
        this.lbWin.node.parent.getComponent(cc.Animation).stop();
        this.lbWin.node.active = false;
    },

    ShowNotify(winValue, act) {
        this.notifyObj.active = true;
        this.actNotify = act;
        this.lbNotify.string = Global.Helper.formatNumber(winValue);
    },

    ClickCloseNotify(activeAction = true) {
            this.notifyObj.active = false;
            if(this.actNotify && activeAction) {
                this.actNotify();
            }
                
            this.actNotify = null;
        
    },
});
