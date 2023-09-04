
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.isEndBigWin = false;
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
        this.mark.active = true;
        this.freeObj.active = true;
        this.freeObj.getComponent(cc.Animation).play("EffectFreeSpin");;
        this.lbFree.string = freeSpinTurn;
        this.objTextFree.active = true;
    },

    ShowNotifyWinFree(num) {
        this.mark.active = true;
        this.freeObj.active = true;
        this.freeObj.getComponent(cc.Animation).play("EffectFreeSpin");;
        this.lbFree.string = "X" + Global.Helper.formatNumber(num);
        this.objTextFree.active = false;
    },

    HideNotifyWinFree(){
        this.mark.active = false;
        this.freeObj.active = false;
    },

    PlayStartBigWinCharater(){
        this.isEndBigWin = false;
    },

    PlayEndBigWinCharacter(){
        this.isEndBigWin = true;
    },
});
