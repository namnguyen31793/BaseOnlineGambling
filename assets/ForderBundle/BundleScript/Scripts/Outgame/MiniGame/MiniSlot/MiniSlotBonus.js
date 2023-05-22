
cc.Class({
    extends: require("SlotBonusManager"),

    ctor() {
        this.actResult = null;
        this.number_Item = 15;
        this.initPosItem = cc.v2(-325, 145);
        this.spaceItem = 60;
    },
    properties: {
        bonusResultObj : cc.Node,
        lb_WinResult: cc.Label,
    },

    ClickPlayFast() {
        this.isEndBonus = true;
        this.slotView.menuView.UpdateWinValue(this.totalWin);
        this.slotView.UpdateAccountBalance(this.accountBalance);
        //sua show popup
        this.showResultBonus(this.bonusWin, ()=>{
            this.bonusObj.active = false;
            this.slotView.PlayBonusEnd();
            this.slotView.ActionAutoSpin();
            this.slotView.effectManager.ClickCloseBonus();
        });
    },

    showResultBonus(winValue, act) {
        this.bonusResultObj.active = true;
        this.actResult = act;
        this.lb_WinResult.string = Global.formatNumber(winValue);
    },
    
    ClickHideBonus() {
        this.bonusResultObj.active = false;
        if(this.actResult)
            this.actResult();
        this.actResult = null;  
    },

    //ke thua sua effect show item
    effShowItem(item, data) {
        this.slotView.PlayWinMoney();
        let random = Global.RandomNumber(0,3);
        //show effect nhan vat o giua
        this.node_Item.getComponent("TamQuocBonusItem").showEffect(random, data.chip);

        item.getComponent("TamQuocBonusItem").showUIItem(random);
        //this.lb_Win.string = Global.formatNumber(this.curBonusWin);
    },

    resetlist(){
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].getComponent("TamQuocBonusItem").resetUINewTurn();
        }
    },
});
