var MiniPokerNetworkManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new MiniPokerNetworkManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];

        switch (responseCode) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MINIPOKER_GET_DETAILS_HISTORY:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_JACKPOT_INFO_NEW:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MiniPOKER_JOKERGAME_TAKE_JACKPOT:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MiniPOKER_JOKERGAME_TAKE_MINIJACKPOT:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_JOKERGAME_SPIN_RESULT:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_TOP_WINNER:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_MULTI_TIMES:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MINIPOKER_JOKERGAME_GET_ACCOUNT_INFO:

                if (Global.MiniPoker != null) {
                    Global.MiniPoker.responseServer(responseCode, packet);
                }
                break;
            default:
                break;
        }
    },

});
module.exports = MiniPokerNetworkManager;