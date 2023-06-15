var OutGameLogicManager = require("OutGameLogicManager");
var InGameLogicManager = require("InGameLogicManager");
var TogetherLogicManager = require("TogetherLogicManager");
var MiniGameLogicManager = require("MiniGameLogicManager");

var ReceiveResponse = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new ReceiveResponse();
            return this.self;
        }
    },
	
	reviceData(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        // console.log("nhan ve:"+responseCode);
		if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_LOGIN) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CHAT) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CHAT_LIST) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_INGAME_CHAT) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_NOTIFICATION) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ALLMAIL) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_PLAYER_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ALLMAIL) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_ACCEPT_MONEY_MAIL) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_NEW_MAIL) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_NOTIFICATION_LOBBY_INFO) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JACKPOT_INFO) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_ACCOUNT_HISTORY) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOPUP_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_RANK) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_DELETE_MAIL_RESPONSE) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PHONENUMBER) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_TAKE_JACKPOT_PERCENT_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_QUEST_SUCCESSED) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JOIN_WAIITNG_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_START_BATTLE_GAME) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_ENDGAME_BATTLE_GAME) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_OTHER_LEAVE_WAITING_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BATTLE_ROOM_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_BONUS) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_REWARD) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_QUEST_INFO){
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        }  else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_DAILY_REWARD_CONFIG){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_DAILY_BONUS){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_TIMEONLINE_BONUS){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_INFO){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_VIP){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_VIP_CONFIG_INFO_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_VIP_POINT){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_JOIN_CARD_PIECES_CONFIG){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JOIN_CARD_PIECES){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_NEWS_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_EVENT_INFO){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_REWARD) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_PLAY_SPIN_HISTORY_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_SHOP_SPIN_CONFIG) {
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BUY_SHOP_PACKAGE_RESPONSE) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_BAG_ITEM_INFO_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BUY_DAILY_SPIN_RESPONSE){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_SHOP_CONFIG) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_TELCO_SPIN) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_MOMO_ORDER_REQUEST) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_VIEW_ADS) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_RETURN_REQUEST) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_REWARD_SPIN_TAKE_REWARD) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_VIP_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_SET_NICKNAME) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_GAME_CONFIG) {
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        
        //region mini slot
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW){
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN){
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_MINISLOT_TOP_WINNER){
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        //MiniSLot new
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_JACKPOT_INFO){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_SPIN){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_INFO){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_FREETURN){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_TOP_TAKE_JACKPOT_INFO){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_DETAIL_HISTORY){
            MiniGameLogicManager.getIns().MiniGameHandleResponse (operationResponse);
        }

        //daily
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_LIST_REWARD_ACCOUNT){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_TAKE_ACCOUNT_REWARD){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_MISSION_CONFIG){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        //pigbank
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_PIGBANK_GET_PIGBANK_INFO){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_PIGBANK_TAKE_PIGBANK){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        //login gift
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_LOGIN_REWARD){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        //tournament
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_TOP_PLAYER){
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_TOP_WINNER){
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_GET_CONFIG){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_GET_ACCOUNT_REWARD){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_TAKE_ACCOUNT_REWARD){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        //free spin reward
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_REWARD_SPIN_GET_INFO){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        //challenge
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_CHALLENGE_GET_CONFIG){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_CHALLENGE_REGISTER_CONFIRM){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        //
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ACCOUNT_INFO){
            InGameLogicManager.getIns().InGameHandleResponse (operationResponse);
        }
        //battle
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_REGISTER){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_GET_CONFIG){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_GET_PLAYING_MATCH){
            OutGameLogicManager.getIns().OutGameHandleResponse (operationResponse);
        }
        //rpg
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_RPG_BATTLE_FIELD_GET_CONFIG){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_RPG_BATTLE_FIELD_REGISTER){
            TogetherLogicManager.getIns().TogetherHandleResponse (operationResponse);
        }
	},
    
    GetPlatFrom() {
        if (cc.sys.isBrowser) return "1";//CONFIG.SOURCE_ID_WEB;
        switch (cc.sys.os) {
             case cc.sys.OS_ANDROID:
                 return "3";//CONFIG.SOURCE_ID_ANDROID;
             case cc.sys.OS_IOS:
                 return "2";//CONFIG.SOURCE_ID_IOS;
             case cc.sys.OS_WINDOWS:
                 return "4";//CONFIG.SOURCE_ID_PC;
         }
    },
	
});
module.exports = ReceiveResponse;