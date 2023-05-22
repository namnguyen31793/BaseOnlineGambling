

cc.Class({
    extends: require("SlotNetwork"),

    ctor() {
        this.countFree = 3;
    },

    ResponseServer(code, packet) {
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_ACCOUNT_INFO:
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_SPIN:
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
    },

    ProceduGetResult(packet) {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let winBonusValue = packet[5];
        let freeSpinLeft = packet[6];
        let totalWin = packet[8];
        let accountBalance = packet[10];
        let currentJackpotValue = packet[11];
        let isTakeJackpot = packet[12];
        let jumpPosData = null;

        // if(this.countFree == 3)
        //     freeSpinLeft = 0;
        // if(this.countFree == 2)
        //     freeSpinLeft = 2;
        // if(this.countFree == 1)
        //     freeSpinLeft = 1;
        // if(this.countFree == 0)
        //     freeSpinLeft = 0;
        // if(this.countFree == -1)
        //     freeSpinLeft = 0;
        // if(this.countFree == -2) {
        //     freeSpinLeft = 0;
        //     this.countFree = 4;
        // }
        // this.countFree -= 1;
            
        if(packet[13])
            jumpPosData = JSON.parse(packet[13]);
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, jumpPosData);
    },

    
});
