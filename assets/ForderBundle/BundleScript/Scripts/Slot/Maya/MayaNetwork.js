

cc.Class({
    extends: require("CaChepNetwork"),

    ResponseServer(code, packet) {
        cc.log(code+"    "+packet);
        cc.log(JSON.stringify(packet));
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_ACCOUNT_INFO:
                cc.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_JACKPOT_INFO:
                cc.log(packet);
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_SPIN:
                // cc.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_DETAIL_HISTORY:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_TOP_TAKE_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
    },

    
});
