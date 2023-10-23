var SlotNetworkManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new SlotNetworkManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        cc.log("slot:"+responseCode);

        switch (responseCode) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MST_SERVER_STAR_SLOT_BONUS_RESULT:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_TOP_TAKE_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_DETAIL_HISTORY:
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_ACCOUNT_FREETURN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_TOP_TAKE_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_25LINEBASIC_GET_DETAIL_HISTORY:
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_JUMPGAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TANSUUGAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DRAGON_PHOENIX_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_QUEEN_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SNOW_FALL_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_MAYA_GAME_GET_DETAIL_HISTORY :
                
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EXTEND_COLUMNS_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break

            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ALICE_JUMP_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break
                
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_JACKPOT_INFO : 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_SPIN : 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_GET_ACCOUNT_INFO : 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_GET_ACCOUNT_FREETURN : 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_GET_TOP_TAKE_JACKPOT_INFO : 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GONZO_GAME_GET_DETAIL_HISTORY : 
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;

          
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_ROOM_CONFIG:
                if(Global.SlotNetWork) Global.SlotNetWork.GetRoomConfig(packet);
                break;
           
            
            //CLIMB_STAIRS
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;
            //THAI SLOT
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_THAI_BLOSSOMS_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break
            //9 pot
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_POTS_OF_GOLD_GAME_GET_DETAIL_HISTORY :
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break
            //sweet bonanza
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_GET_DETAIL_HISTORY :   
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SWEET_BONANZA_GAME_BUY_FEATURE:
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break
            //tayduky
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_DETAIL_HISTORY:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_ACCOUNT_FREETURN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_TOP_TAKE_JACKPOT_INFO: 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN_CHOI_THU: 
                if(Global.SlotNetWork) Global.SlotNetWork.ResponseServer(responseCode, packet);
                break;
            //mini slot
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_FREETURN :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_TOP_TAKE_JACKPOT_INFO :
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_DETAIL_HISTORY :
                if(Global.MiniSlotNetWork) Global.MiniSlotNetWork.ResponseServer(responseCode, packet);
                break
            default:
                break;
        }
    },

});
module.exports = SlotNetworkManager;