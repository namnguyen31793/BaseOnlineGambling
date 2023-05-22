

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_ACCOUNT_INFO:
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_SPIN:
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
    },

    
});
