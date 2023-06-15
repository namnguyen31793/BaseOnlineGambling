var SendRequest = cc.Class({

    statics: {
        getIns() {
            if (this.self == null) this.self = new SendRequest();
            return this.self;
        }
    },

    MST_Client_Login(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_LOGIN, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Join_Room(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_JOIN_ROOM, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Send_Ping(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_PING, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    //fishing
    MST_Client_Shot_Ingame(msg) {

        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SHOOTING, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Fish_Collision(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_FISH_COLLISION, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Other_Fish_Collision(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_ORTHER_PLAYER_FISH_COLLISION, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Shooting_Jackpot(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SHOOTING_JACKPOT, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_LeaveRoom() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_LEAVE_ROOM, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Account_Balance() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_ACCOUNT_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Use_Item(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_USING_ITEM, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Kill_Electric_Fish(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_KILL_ELECTRIC_FISH, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Change_Gun(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_CHANGE_GUN, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Shooting_Fish_Collision_Speical_Gun(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_KILL_FISH_SPECIAL_BULLET, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Special_Fish_Play_Turn(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MSG_CLIENT_SPECIAL_FISH_PLAY_TURN, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Special_Gun_Play_Turn(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MSG_CLIENT_SPECIAL_GUN_PLAY_TURN, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Get_Jackpot_Info(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_JACKPOT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    RequestMessageNoData(RequestCode, tag) {
        let msg = {};
        Global.NetworkManager.sendRequest(RequestCode, msg, tag);
    },

    MST_Client_Jackpot_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_JACKPOT_INFO, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Get_Mission_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_MISSION_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Receive_Mission_Reward(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_RECEIVE_MISSION_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Vip_Config_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_VIP_CONFIG_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Send_Gift_Code(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_GIFTCODE_CHECK_CODE, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Play_Daily_Bonus() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_PLAY_DAILY_SPIN, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Daily_Spin_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_DAILY_SPIN_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Buy_Spin(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_BUY_DAILY_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Read_Mail(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_READ_MAIL, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Accept_Money_Mail(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_ACCEPT_MONEY_MAIL, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Delete_Mail(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_DELETE_MAIL, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_News() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_NEWS, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Event_Config_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_EVENT_CONFIG_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Top_Event(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_TOP_EVENT, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Update_PhoneNumber(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_UPDATE_PHONENUMBER, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Change_Password(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_CHANGE_PASSWORD, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Buy_Shop_Package(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_BUY_SHOP_PACKAGE, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Shop_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_SHOP_CONFIG, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Account_History() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_ACCOUNT_HISTORY, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Rank_Take_Jackpot() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_RANK_TAKE_JACKPOT, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Top_Rank_Take_Jackpot() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_RANK_TOP_TAKE_JACKPOT, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Telco_CashOut(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_TELCO_CASHOUT, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Telco_CashIn(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_TELCO_CASHIN, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Join_Card_Piece_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_JOIN_CARD_PIECES_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Join_Card_Piece(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_JOIN_CARD_PIECES, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Play_Daily_Telco_Reward_Spin(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MST_CLIENT_PLAY_DAILYTELCOREWARD_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_Login_Gift_Reward(msg) {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHECK_LOGIN_REWARD, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Get_All_Mail() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_ALL_MAIL, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_View_Ads(msg) {
        Global.NetworkManager.sendRequest (Global.Enum.REQUEST_CODE.MSG_CLIENT_VIEW_ADS, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    // Slot
    MST_Client_Slot_Get_Game_Config_Info(msg) {
        cc.log("send ----------------")
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_GAME_CONFIG_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },
    
    MST_Client_Slot_Get_Account_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_ACCOUNT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Get_Jackpot_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_JACKPOT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Set_Data(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_SET_DATA, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Play_Bonus(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_PLAY_BONUS, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Open_Game(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_SELECT_GAME_TYPE, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Get_Game_Detail_History(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_DETAIL_HISTORY, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Get_Top_Jackpot(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_TOP_JACKPOT, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Leave_Room() {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_LEAVE_ROOM, {}, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Mission_Get_Current_Mission() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_MISSION_GET_CURRENT_MISSION, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Play_X2() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_PLAY_X2, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },
    
    //mini poker
    MST_Client_MiniPoker_Get_Jackpot_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_MINIPOKER_GET_JACKPOT_INFO, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },

    MST_Client_MiniPoker_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_MINIPOKER_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },
    
    MST_Client_MiniPoker_Set_Data(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_MINIPOKER_SET_DATA, msg, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },

    MST_Client_MiniPoker_Get_Top_Winner() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_MINIPOKER_GET_TOP_WINNER, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },

    MST_Client_MiniPoker_Get_Detail_History() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_SERVER_MiniPOKER_JOKERGAME_GET_DETAIL_HISTORY, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },

    MST_Client_MiniPoker_Get_Account_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_MINIPOKER_GET_ACCOUNT_INFO, Global.Enum.NETWORK_TARGET_CODE.MINIPOKER);
    },

	//mini slot
    MST_Client_MiniSlot_Get_Jackpot_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_MINISLOT_GET_JACKPOT_INFO, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_MiniSlot_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_MINISLOT_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_MiniSlot_Get_Top_Winner() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_MINISLOT_GET_TOP_WINNER, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },
    MST_Client_Get_Play_Spin_History() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_PLAY_SPIN_HISTORY, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    //daily game
    MST_Client_Play_Daily_Login_Game(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_PLAY_DAILY_LOGIN_GAME, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Get_Daily_Game_Reward_List(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_GET_DAILY_GAME_REWARD_LIST, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //collection
    MST_Client_Get_My_Collection() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_COLLECTION_GET_MY_COLLECTION, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Collection_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_COLLECTION_TAKE_ACCOUNT_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //quest
    MST_Client_Event_Mission_Get_List_Reward_Account(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_GET_LIST_REWARD_ACCOUNT, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Get_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_TAKE_REWARD_ACCOUNT, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Get_Mission_Config(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_MISSION_GET_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Account_Accept_Mission(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_ACCEPT_MISSION, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //not enought money
    MST_Client_Event_Take_Not_Enought_Money_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_POPUP_TAKE_NOT_ENOUGH_MONEY_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },


    //daily
    MST_Client_Event_Mission_Daily_Get_List_Reward_Account() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_DAILY_GET_LIST_REWARD_ACCOUNT, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Daily_Get_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_DAILY_GET_TAKE_ACCOUNT_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Daily_Get_Mission_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_DAILY_GET_MISSION_CONFIG, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },
    
    //pigbank
    MST_Client_Event_PingBank_Get_Current_PigBank_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_PIGBANK_GET_CURRENT_PIGBANK_INFO, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Event_PigBank_Take_PigBank() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_PIGBANK_TAKE_PIGBANK, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    //level
    MST_Client_Event_Level_System_Get_Reward_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_LEVEL_SYSTEM_GET_REWARD_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Level_System_Take_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_LEVEL_SYSTEM_TAKE_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Score_Get_Current_Account_Score() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_SCORE_GET_CURRENT_ACCOUNT_SCORE, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //top
    MST_Client_Event_Score_Get_Top_Player_By_Game(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_SCORE_GET_TOP_PLAYER_BY_GAME, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Score_Get_Top_Player() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_SCORE_GET_TOP_PLAYER, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //tournament
    MST_Client_Event_Tournament_Get_Current_Score(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TOURNAMENT_GET_CURRENT_SCORE, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Tournament_Get_Top_Winner(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TOURNAMENT_GET_TOP_WINNER, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Tournament_Get_Config_List() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TOURNAMENT_GET_CONFIG_LIST, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Tournament_Get_Account_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TOURNAMENT_GET_ACCOUNT_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Tournament_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TOURNAMENT_TAKE_ACCOUNT_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

  
    //city
    MST_Client_CityGame_ChatRoom_GetChat() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_CITYGAME_CHATROOM_GETCHAT, Global.Enum.NETWORK_TARGET_CODE.CITY_GAME);
    },

    MST_Client_CityGame_ChatRoom_Chat(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CITYGAME_CHATROOM_CHAT, msg, Global.Enum.NETWORK_TARGET_CODE.CITY_GAME);
    },

    //home
    MST_Client_CityGame_House_Account_House_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CITYGAME_HOUSE_ACCOUNT_HOUSE_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.CITY_GAME);
    },
    MST_Client_CityGame_House_Item_Get_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CITYGAME_HOUSE_ITEM_GET_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.CITY_GAME);
    },
    MST_Client_CityGame_House_Item_Buy(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CITYGAME_HOUSE_ITEM_BUY, msg, Global.Enum.NETWORK_TARGET_CODE.CITY_GAME);
    },

    //challenge
    MST_Client_Challenge_Get_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHALLENGE_GET_CONFIG, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Challenge_Register(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHALLENGE_REGISTER, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    MST_Client_Challenge_Start(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHALLENGE_START, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Challenge_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHALLENGE_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Challenge_End(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_CHALLENGE_CONFIRM_LOSE, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

  
    //mission fish
    MST_Client_Get_Fish_Current_Mission_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_FISH_MISSION_CURRENT_MISSION_INFO, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Get_Fish_Reward_Mission_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_FISH_MISSION_GET_REWARD_INFO, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Get_Fish_Mission_Take_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_GET_FISH_MISSION_TAKE_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    MST_Client_Get_Fish_Mission_Get_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_FISH_MISSION_GET_MISSION_CONFIG, Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING);
    },

    //tournament
    MST_Client_Get_Fish_Tournament_Get_Account_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_FISH_TOURNAMENT_GET_ACCOUNT_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Get_Fish_Tournament_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_FISH_TOURNAMENT_TAKE_ACCOUNT_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Get_Fish_Tournament_Get_Top_Score() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_FISH_TOURNAMENT_GET_TOP_SCORE, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Get_Fish_Tournament_Get_Ranking() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_FISH_TOURNAMENT_GET_RANKING, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //item
    MST_Client_Account_Bag_Get_Sell_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_ACCOUNT_BAG_GET_SELL_CONFIG, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Account_Bag_Get_Account_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_ACCOUNT_BAG_GET_ACCOUNT_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Account_Bag_Sell_Item(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_ACCOUNT_BAG_SELL_ITEM, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

     //gacha
     MST_Client_Event_LootBox_Get_Room_Config(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENTGAME_LOOTBOX_GET_ROOM_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_LootBox_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENTGAME_LOOTBOX_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //online gift
    MST_Client_Event_Mission_Online_Account_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_ONLINE_ACCOUNT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Mission_Online_Account_TakeReward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_ONLINE_TAKE_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //random mission
    MST_Client_Event_Charactor_Get_Random_Mission() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_GET_RANDOM_MISSION, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Charactor_Get_Mission_By_Id(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_GET_MISSION_BY_ID, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Charactor_Accept_Mision(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_ACCEPT_MISSION, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Charactor_Get_Account_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_GET_ACCOUNT_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Charactor_Take_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_TAKE_REWARD_ACCOUNT, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Charactor_Get_Account_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_CHARACTOR_GET_ACCOUNT_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //bean
    MST_Client_Bean_Stack_Get_Mission_Info_By_Group() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_BEAN_STACK_MISSION_GET_MISSION_INFO_BY_GROUP, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Bean_Stack_Accept_Mission(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_BEAN_STACK_MISSION_ACCEPT_MISSION, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Bean_Stack_Get_Account_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_BEAN_STACK_MISSION_GET_ACCOUNT_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Bean_Stack_Take_Account_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_BEAN_STACK_MISSION_TAKE_ACCOUNT_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Bean_Stack_Get_All_Mission_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_BEAN_STACK_MISSION_GET_ALL_MISSION_CONFIG, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //gift card
    MST_Client_Gift_Card_Get_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GIFT_CARD_GET_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Gift_Card_Get_Jackpot() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GIFTCARD_GET_JACKPOT_FUND_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Gift_Card_Play() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GIFTCARD_PLAY_TAKE_CARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //ads
    MST_Client_Ads_Get_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_MISSION_GET_CONFIG, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Ads_Get_Account_Info() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_MISSION_GET_ACCOUNT_INFO, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Ads_Accept_Mission() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_MISSION_ACCEPT_MISSION, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Ads_View_Complete_Config() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_COMPLETED_CONFIG, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Ads_View_Complete_Take_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_COMPLETED_TAKE_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //free bonus
    MST_Client_FreeReward_Show_Banner() {
        cc.log("show free bonus");
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_FREEREWARD_SHOW_BANNER, {}, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_FreeReward_Take_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_FREEREWARD_TAKE_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //keypass daily mission
    MST_Client_Event_Mission_Using_KeyPass(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_USING_KEYPASS, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //tracking
    MST_Client_Ads_Tracking(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_ADS_VIEW_TRACKING, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //share money
    MST_Client_Share_Money_Get_Reward() {
        this.RequestMessageNoData(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_SHARE_MONEY_GET_REWARD, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Share_Money_Take_Reward(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_SHARE_MONEY_TAKE_REWARD, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

   

    //#region REAL MONEY
    // Slot
    MST_Client_Real_Money_Slot_Open_Game(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SELECT_SLOT_GAME_TYPE, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Get_Account_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_GET_ACCOUNT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Spin(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Get_Jackpot_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_GET_JACKPOT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Set_Data(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_SET_DATA, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Play_Bonus(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_PLAY_BONUS, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Get_Game_Detail_History(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_GET_DETAIL_HISTORY, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Get_Top_Jackpot(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_GET_TOP_JACKPOT, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Real_Money_Slot_Leave_Room() {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_REAL_MONEY_SLOT_LEAVE_ROOM, {}, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    MST_Client_Slot_Get_Room_Config(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_GET_ROOM_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },
    //#endregion

    //skill game
    //plinko
    MST_Client_Plinko_Get_Account_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_PLINKO_BASE_GET_ACCOUNT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    MST_Client_Plinko_Get_Room_Info(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_PLINKO_BASE_GET_ROOM_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    MST_Client_Plinko_Play(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_PLINKO_BASE_PLAY, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    MST_Client_Plinko_Check_Ads() {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_CHECK_ADS, {}, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    MST_Client_Plinko_View_Ads_Complete(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_VIEW_ADS_COMPLETED, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    //billing
    MST_Client_Event_Api_Send(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_API_SEND_MESSAGE, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //nickname
    MST_Client_Change_NickName(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SET_NICKNAME, msg, Global.Enum.NETWORK_TARGET_CODE.LOBBY);
    },

    //event
    MST_Client_Event_Get_Account_Info() {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GAMES_GET_ACCOUNT_INFO, {}, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Play_Game(msg) {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GAMES_PLAYGAME, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Get_High_Score() {
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_GAMES_GET_HIGH_SCORE, {}, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Get_ReferenceInfo(){
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TRI_AN_GET_INFO, {}, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    MST_Client_Event_Set_Reference_Id(msg){
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_TRI_AN_SET_REFERENCE_ID, msg, Global.Enum.NETWORK_TARGET_CODE.EVENT);
    },

    //Miner
    MST_Client_Miner_Play(msg) {
        cc.log(msg);
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_MINE_STARTGAME, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },

    MST_Client_Miner_Complete(msg) {
        cc.log(msg);
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SKILLGAME_MINE_CASHOUT, msg, Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME);
    },
});
module.exports = SendRequest