

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_ACCOUNT_INFO:
                console.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_SPIN:
                console.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
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
            //  freeSpinLeft = 1;
            /*
        numberBonusSpin = 2;
         if(this.countFree == 3) {
            numberBonusSpin = 3;
            winBonusValue = 10000;
         }
           if(this.countFree == 2)
            numberBonusSpin = 2;
           if(this.countFree == 1)
           numberBonusSpin = 1;
           if(this.countFree == 0) {
            numberBonusSpin = 0;
            winBonusValue = 10000;
            isTakeJackpot = true;
           }
            
           if(this.countFree == -1)
           numberBonusSpin = 0;
           if(this.countFree == -2) {
            numberBonusSpin = 0;
               this.countFree = 4;
           }
           this.countFree -= 1;
            */
           
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    GetJackpotInfo(packet) {
        let listJackpot = [];
        listJackpot[0] = packet[1];
        listJackpot[1] = packet[2];
        listJackpot[2] = packet[3];
        listJackpot[3] = packet[4];
        this.slotView.OnGetJackpotValue(listJackpot);
    },

    //battle
    BattlePlayerSpin(packet) {
        let playerInfo = JSON.parse(packet[1]);
        let rivalInfo = JSON.parse(packet[2]);
        let matrix = packet[3];
        let listLineWinData = packet[4];
        let winNormalValue = packet[5];
        let numberBonusSpin = packet[6];
        let winBonusValue = packet[7];
        let freeSpinLeft = packet[8];
        let valueFreeSpin = packet[9];
        let totalWin = packet[10];
        let isTakeJackpot = packet[13];
        let accountBalance = playerInfo.BattleScore;
        this.slotView.OnGetSpinResult(0, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin, freeSpinLeft, totalWin, accountBalance, 
            0, isTakeJackpot);
        
        let userTurn = playerInfo.BattleNormalTurn;
        this.slotView.UpdateUserTurn(userTurn);
    },

    
});
