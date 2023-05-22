
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
    },

    properties: {
        objTextFree : cc.Node,
    },
    

    onLoad() {
    },

    ShowWinMoneyFree(winMoney, extandMatrix){
        this.lbWin.string = "";
        this.lbWin.node.active = true;
        this.lbWin.string = extandMatrix+"x "+Global.Helper.formatNumber(parseInt(winMoney));
        this.lbWin.node.parent.getComponent(cc.Animation).play();
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.lbFree.string = freeSpinTurn + "Lượt";
        this.objTextFree.active = true;
    },

    ShowNotifyWinFree(num) {
        this.freeObj.active = true;
        this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        this.objTextFree.active = false;
    },

    HideNotifyWinFree(){
        this.freeObj.active = false;
    },

});
