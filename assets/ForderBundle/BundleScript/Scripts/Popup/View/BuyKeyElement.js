

cc.Class({
    extends: cc.Component,

    properties: {
        numb : cc.Label,
        prize : cc.Label,
        numbSpin : 0,
    },

    Init(data) {
        this.numb.string = data.SpinAmount.toString();
        this.numbSpin = data.SpinAmount;
        this.prize.string = Global.Helper.formatNumber(data.MoneyAmount);
    },

    ClickBuy() {
        Global.UIManager.showConfirmPopup(Global.Helper.formatString(Global.MyLocalization.GetText("BUY_KEY_CONFIRM"),[this.prize.string, this.numb.string]), ()=>{
            let msgData = {};
            msgData[1] = this.numbSpin;
            require("SendRequest").getIns().MST_Client_Buy_Spin(msgData);
        }, null);
        
    },
    
});
