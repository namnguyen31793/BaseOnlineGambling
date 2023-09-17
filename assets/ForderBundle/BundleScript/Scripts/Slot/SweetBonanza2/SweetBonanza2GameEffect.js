
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.isEndBigWin = false;
    },

    properties: {
        objTextFree : cc.Node,
        objTextFreeEnd : cc.Node,
        WinMoneyLabel: cc.Label,
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
        this.objTextFreeEnd.active = false;
    },

    ShowNotifyWinFree(num) {

        this.mark.active = true;
        this.freeObj.active = true;
        this.freeObj.getComponent(cc.Animation).play("EffectFreeSpin");;
        this.lbFree.string =  Global.Helper.formatNumber(num);
        this.objTextFree.active = false;
        this.objTextFreeEnd.active = true;
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

    ShowNotifyBonusFree() {
        this.bonusObj.active = true;
        this.bonusObj.getComponent(cc.Animation).play("AnimBonusFree");
    },

    HideNotifyBonusFree() {
        this.bonusObj.getComponent(cc.Animation).play("AnimBonusFreeEnd");
    },

    ShowWinMoneyEffect(pos,winMoney)
    {
      
        this.WinMoneyLabel.node.setPosition(pos);
        this.WinMoneyLabel.string = Global.Helper.formatNumber(winMoney);
        this.WinMoneyLabel.node.active = true;
    
        let WinMoneyLabel_Animation =  this.WinMoneyLabel.getComponent(cc.Animation);
        let callback = ()=>{     
            this.WinMoneyLabel.node.active = false;
        }
        WinMoneyLabel_Animation.on("finished", callback);
        WinMoneyLabel_Animation.play("WinMoney_Animation");
    },

});
