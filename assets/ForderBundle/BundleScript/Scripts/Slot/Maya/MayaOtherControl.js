cc.Class({
    extends: cc.Component,
    ctor() {
        this.cacheAccountBalance = 0;
    },

    properties: {
        slotView : require("MayaBattleView"),
    },

    start () {
    },

    ProceduGetResult(packet) {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let accountBalance = packet[11];
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let listLengthMatrixString = packet[14];
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, listLengthMatrixString);
    },

    SetAccountBalance(accountBalance) {
        this.cacheAccountBalance = accountBalance;
    },

    ShowAccountBalance() {
        Global.SlotNetWork.slotView.battleManager.UpdateRivalMoney(this.cacheAccountBalance);
    },

    onLoad() {
        Global.OtherBattle = this;
    },

    onDestroy() {
        Global.OtherBattle = null;
    },

    
});
