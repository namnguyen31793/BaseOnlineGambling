

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        cc.log(JSON.stringify(packet));
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_ACCOUNT_INFO:
                cc.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_SPIN:
                cc.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_TOP_TAKE_JACKPOT_INFO:
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
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    BattleRivalSpin(packet) {
        cc.log(packet);
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
        let currentJackpotValue = 0;
        let isTakeJackpot = packet[13];

        let accountBalance = rivalInfo.BattleScore;
        let rivalTurn = rivalInfo.BattleNormalTurn;

        Global.SlotNetWork.slotView.UpdateRivalTurn(rivalTurn);
        Global.OtherBattle.SetAccountBalance(accountBalance);
        Global.OtherBattle.slotView.OnGetSpinResult(0, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
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
        let listLengthMatrixString = packet[14];
        let accountBalance = playerInfo.BattleScore;
        this.slotView.OnGetSpinResult(0, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            0, isTakeJackpot, listLengthMatrixString);
        
        let userTurn = playerInfo.BattleNormalTurn;
        this.slotView.UpdateUserTurn(userTurn);

    },
    //end battle

    
});
