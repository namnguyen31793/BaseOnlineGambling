
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.isEndBigWin = false;
    },

    properties: {
        objTextFree : cc.Node,
        charecter : cc.Animation,
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
        this.lbFree.string = freeSpinTurn + "Lượt";
        this.objTextFree.active = true;
    },

    ShowNotifyWinFree(num) {
        this.mark.active = true;
        this.freeObj.active = true;
        this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        this.objTextFree.active = false;
    },

    HideNotifyWinFree(){
        this.mark.active = false;
        this.freeObj.active = false;
    },

    PlayStartBigWinCharater(){
        this.isEndBigWin = false;
        let acStartAnimBigWin = cc.callFunc(() => {
            this.charecter.play("CharacterStartBigWin");
        });
        let acWaitAnimBigWin = cc.callFunc(() => {
            if(!this.isEndBigWin)
                this.charecter.play("CharacterLoopBigWin");
        });
        this.charecter.node.runAction(cc.sequence(acStartAnimBigWin,cc.delayTime(2.5),acWaitAnimBigWin));
    },

    PlayEndBigWinCharacter(){
        this.isEndBigWin = true;
        this.charecter.play("CharacterEndBigWin");
    },

    PlayStartFreeCharacter(){
        let acStartAnimFree = cc.callFunc(() => {
            this.charecter.play("CharacterShowFree");
        });
        let acWaitAnimFree = cc.callFunc(() => {
            this.charecter.play("CharacterFreeWait");
        });
        this.charecter.node.runAction(cc.sequence(acStartAnimFree,cc.delayTime(2),acWaitAnimFree));
    },

    PlayEndFreeCharacter(){
        let acStartAnimFree = cc.callFunc(() => {
            this.charecter.play("CharacterShowFree");
        });
        let acWaitAnimFree = cc.callFunc(() => {
            this.charecter.play("CharacterNormalWait");
        });
        this.charecter.node.runAction(cc.sequence(acStartAnimFree,cc.delayTime(2),acWaitAnimFree));
    },
});
