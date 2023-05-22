var MiniGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new MiniGameLogicManager();
            return this.self;
        }
    },

    MiniGameHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        switch (responseCode) {
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_SESSION_INFO:
            //     if (Global.TaiXiu != null) {
            //         Global.TaiXiu.responseServer(responseCode, packet);
            //     } else {
            //         if(Global.BtnMiniGame != null)
            //             Global.BtnMiniGame.initTimeTaiXiu(packet[2], packet[3]);
            //     }
            //     break;
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_SET_BET:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_RESULT:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_ACCOUNT_RESULT:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WINNER:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_BET_OF_ACCOUNT:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_BET_SESSION_INFO:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_OPEN_GAME:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_SERVER_MESSAGE:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_GAME_HISTORY:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_CHAT:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_CHAT_HISTORY:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_TRANSACTION_DETAIL:
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_DICE_GET_CHAIN:
            //     if (Global.TaiXiu != null) {
            //         Global.TaiXiu.responseServer(responseCode, packet);
            //     }
            //     break;
            // case Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_LOG_TAI_XIU_IN_GAME:
            //     if (Global.HistoryTaiXiu != null) {
            //         Global.HistoryTaiXiu.responseServer(packet);
            //     }
            //     break;
			case Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN:
                if (Global.MiniSlot != null) {
                    Global.MiniSlot.responseServer(responseCode, packet);
                }
                break;
            case Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_TOP_WINNER:
                if (Global.RankMiniSlot != null) {
                    Global.RankMiniSlot.responseServer(packet);
                }
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_SPIN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_DETAIL_HISTORY :
                if(Global.MiniSlotNetWork) Global.MiniSlotNetWork.ResponseServer(responseCode, packet);
                break;
            default:
                break;
        }
    },
});
module.exports = MiniGameLogicManager;