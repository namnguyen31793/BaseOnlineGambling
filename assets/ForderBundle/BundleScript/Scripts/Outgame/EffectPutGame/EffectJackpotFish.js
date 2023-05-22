cc.Class({
    extends: cc.Component,
    ctor() {
        this.countTime = 0;
    },

    properties: {
        lbTotalSpin : require("LbMonneyChange"),
        startJackpotValue : 5000000,
        heso : 495495,
        hTime : 613,
    },

    start() {
        this.SetJackpotValue();
    },

    SetJackpotValue() {
        let current = new Date();
        let jackpotValue = parseInt(this.startJackpotValue + (current.getTime()/1000)%this.hTime*this.heso);
        this.UpdateTotalSpin(jackpotValue);
    },

    UpdateTotalSpin(value) {
        this.lbTotalSpin.setMoney(value, true, false);
    },

    update(dt) {
        this.countTime +=  dt;
        if(this.countTime >= 15) {
            this.countTime = 0;
            this.SetJackpotValue();
        }
    },
});
