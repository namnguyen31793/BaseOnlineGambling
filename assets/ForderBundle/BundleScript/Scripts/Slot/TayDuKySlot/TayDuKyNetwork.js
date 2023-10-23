

cc.Class({
    extends: require("SlotNetwork"), 
    
    ctor() {
        this.cacheFreeSpin = 0;
    },

    ResponseServer(code, packet) {
      
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_ACCOUNT_INFO:
                cc.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN:
                cc.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN_CHOI_THU:
                this.ProceduGetResultTry(packet);
                break;
        }
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
        let extendMatrixDescription = packet[14];

        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    ProceduGetResultTry(packet) {
        cc.log(packet);
        cc.log(this.slotView.spinManager.isgetResult);
        if(this.slotView.spinManager.isgetResult) {
            this.slotView.AddStack(packet);
            return;
        }
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let accountBalance = 0;
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let extendMatrixDescription = packet[14]; 
        if(this.cacheFreeSpin == 0)
            this.cacheFreeSpin = freeSpinLeft
        else
            this.cacheFreeSpin -= 1;

        accountBalance = require("WalletController").getIns().GetBalance() - 200000 + totalWin;
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin, this.cacheFreeSpin, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
        
    },

   
    GetJackpotInfo(packet) {
        let listJackpot = [];
        listJackpot[0] = packet[1];
        listJackpot[1] = packet[2];
        listJackpot[2] = packet[3];
        listJackpot[3] = packet[4];
        listJackpot[4] = packet[5];
        listJackpot[5] = packet[6];
        listJackpot[6] = packet[7];
        this.slotView.OnGetJackpotValue(listJackpot);
    },

 

    
});
