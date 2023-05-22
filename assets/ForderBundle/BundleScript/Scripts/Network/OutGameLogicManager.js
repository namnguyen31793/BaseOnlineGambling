const DailyGameManager = require("../DailyGame/DailyGameManager");

var OutGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new OutGameLogicManager();
            return this.self;
        }
    },



    OutGameHandleResponse(operationResponse) {
        if (require("ScreenManager").getIns().currentScreen != Global.Enum.SCREEN_CODE.LOBBY && 
            require("ScreenManager").getIns().currentScreen != Global.Enum.SCREEN_CODE.CITY) {
            return;
        }
        var data = operationResponse;

        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        // cc.log("outgame:"+responseCode);
        if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CHAT) {
            this.HandleServerChat(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CHAT_LIST) {
            this.HandleServerChatList(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponce(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalanceResponce(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ALLMAIL) {
            this.HandleGetAllMail(packet);
        // } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_RESPONSE) {
        //     this.HandleResultSpinMiniPoker(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            this.HandleNotifyCashOut(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_NOTIFICATION_LOBBY_INFO) {
            this.HandleNotifyLobby(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JACKPOT_INFO) {
            this.HandleJackpotInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_ACCOUNT_HISTORY) {
            this.HandleAccountHistory(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            this.HandleTelcoHistory(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_RANK) {
            this.HandleTakeJackpotRank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            this.HandleTopJackpotRank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_DAILY_REWARD_CONFIG) {
            this.HandleGetDailyRewardConfig(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_DAILY_BONUS) {
            this.HandleReceiveDailyBonus(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_TIMEONLINE_BONUS) {
            this.HandleReceiveTimeOnlineBonus(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_INFO) {
            this.HandleGetDailySpinInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            this.HandlePlayDailySpin(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_VIP) {
            this.HandleUpdateVip(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_VIP_CONFIG_INFO_RESPONSE) {
            this.HandleGetVipConfigInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_VIP_POINT) {
            this.HandleUpdateVipPoint(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_JOIN_CARD_PIECES_CONFIG) {
            this.HandleGetJoinCardFromPieceInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JOIN_CARD_PIECES) {
            this.HandleJoinCardFromPiece(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_NEWS_RESPONSE) {
            this.HandleGetNews(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_EVENT_INFO) {
            this.HandleGetEventInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE) {
            this.HandleGetTopEvent(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_PLAY_SPIN_HISTORY_RESPONSE) {
            this.HandleGetHistoryPlaySpin(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_BAG_ITEM_INFO_RESPONSE) {
            this.HandleGetBagItemInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BUY_SHOP_PACKAGE_RESPONSE) {
            this.HandleBuyShopPackage(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            this.HandleReceiveDiamond(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            this.HandleUpdateDiamond(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_SHOP_SPIN_CONFIG){
            this.HandleGetShopSpinConfig (packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BUY_DAILY_SPIN_RESPONSE){
            this.HandleBuySpin (packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING){
            this.HandlePingTime (packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_PIGBANK_GET_PIGBANK_INFO){
            this.HandleGetPigBankInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_PIGBANK_TAKE_PIGBANK){
            this.HandleTakePigBank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_GET_CONFIG){
            this.HandleGetTournamentConfig(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_REWARD_SPIN_GET_INFO){
            this.HandleRewardSpinGetInfo(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_CHALLENGE_GET_CONFIG){
            this.HandleGetConfigChallenge(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_CHALLENGE_REGISTER_CONFIRM){
            this.HandleRegisterChallenge(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_REGISTER){
            this.HandleBattleFieldRegister(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_GET_CONFIG){
            this.HandleBattleFieldGetConfig(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_BATTLE_FIELD_GET_PLAYING_MATCH){
            this.HandleBattleFieldGetPlayingMatch(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_LOGIN_REWARD){
            this.HandleGetLoginGiftReward(packet);
        }
    },

    HandleLoginResponse(packet) {
        Global.UIManager.hideLoading();
        Global.LevelManager.GetLevelInfo();
        Global.MainPlayerInfo.SetUpInfo(JSON.parse(packet[1]));
        Global.LobbyView.UpdateInfoView();
        Global.LobbyView.CheckShowMiniGame();
        
        let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_SLOT || lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS)
                require("ScreenManager").getIns().LoadScene(lastScreenCode);
        }
    },

    HandleJackpotInfo(packet) {


    },

    HandleGetVipConfigInfo(packet) {
        let vipConfigInfoString = packet[1];
        let description = packet[2];
        let dq = packet[3];
        let listVipInfo = [];
        for (let i = 0; i < vipConfigInfoString.length; i++) {
            listVipInfo [i] = JSON.parse (vipConfigInfoString[i]);
        }
        if(Global.VipInfoPopup != null && Global.VipInfoPopup.node.active == true)
            Global.VipInfoPopup. GetVipInfo (listVipInfo, description, dq);
        if(Global.ProfilePopup != null && Global.ProfilePopup.node.active == true) {
            Global.ProfilePopup.UpdateInfoVip (listVipInfo);
        }
            
    },

    HandleGetAllMail(packet) {
        let data = packet[1];
        let listMailObj = [];
        let numMailNotRead = 0;
        for (let i = 0; i < data.length; i++) {
            listMailObj [i] = JSON.parse (data [i]);
            if (listMailObj [i].IsReaded == 0)
                numMailNotRead += 1;
        }
        Global.MainPlayerInfo.SetUpMail (listMailObj, numMailNotRead);
        if(Global.LobbyView != null)
            Global.LobbyView.UpdateMailStatus ();
        if(numMailNotRead > 0) {
            Global.LobbyView.OnCheckMail();
            
        }
    },

    HandleNotifyLobby(packet) {
        let notify = packet[1];
        let speed = packet[2];
        if(Global.LobbyView != null)
            Global.LobbyView.UpdateNotify(notify, speed);
    },

    HandleNotifyCashOut(packet) {
        let content = packet[1];
        let speed = packet[2];
        let repeat = packet[3];
        Global.LobbyView.ShowNotifyCash (content, speed, repeat);
    },

    HandleUpdateVipPoint(packet) {
        let levelVip = packet[1];
        let vipPoint = packet[2];
        Global.MainPlayerInfo.SetVip (levelVip);
        Global.MainPlayerInfo.SetVipPoint (vipPoint);
        let view = Global.LobbyView;
		if(require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
			view = Global.CityView;
		} 
        view.UpdateInfoView ();
    },

    HandleGetMissionInfo(packet) {
        let questDataArray = packet[1];
        let questList = [];
        for (let i = 0; i < questDataArray.length; i++) {
            questList [i] = JSON.parse (questDataArray[i]);
        }
        if(Global.QuestPopup != null && Global.QuestPopup.node.active == true)
            Global.QuestPopup.UpdateQuestInfo (questList);
    },

    HandleGetShopSpinConfig(packet) {
        let shopSpinString = packet[1];
        let listShopSpinConfig = [];
        for (let i = 0; i < shopSpinString.length; i++) {
            listShopSpinConfig [i] = JSON.parse (shopSpinString[i]);
        }
        Global.shopSpinConfig = listShopSpinConfig;
    },

    HandleGetDailySpinInfo(packet) {
        let rewardSpinString = packet[1];
        let listReward = [];
        for (let i = 0; i < rewardSpinString.length; i++) {
            listReward [i] = JSON.parse (rewardSpinString[i]);
        }
        Global.listResult = listReward;
        let numberSpin = packet[2];
        Global.currentSpin = numberSpin;
        let listPercentBonus = packet[3];
        for (let i = 0; i < listPercentBonus.length; i++) {
            Global.listPercentBonus [i] = JSON.parse (listPercentBonus[i]);
        }
        Global.isPlayBonus = packet[4];
        Global.bonusRate = packet[5];
        
    },

    HandleBuySpin(packet) {
        let numberSpin = packet[1];
        let accountBalance = packet[2];
        Global.currentSpin = numberSpin;
        Global.MainPlayerInfo.ingameBalance = accountBalance;
        Global.LobbyView.UpdateInfoView();
        Global.LuckySpinPopup.UpdatecurrentSpin (numberSpin);
        Global.UIManager.showCommandPopup (Global.MyLocalization.GetText("SUCCESS"));
    },

    HandleUpdateBalanceResponce(packet) {
        if(DailyGameManager.getIns().openGame)
            return;
        let playerId  = packet[1];
        let money = packet[2];
        if (playerId == Global.MainPlayerInfo.accountId) {
            // Global.MainPlayerInfo.ingameBalance = money;
            require("WalletController").getIns().UpdateWallet(money);
            let view = Global.LobbyView;
            if(require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
                view = Global.CityView;
            } 
            view.UpdateInfoView ();
        }
    },

    //gift
    HandleGetDailyRewardConfig(packet) {
        let listDailyReward = JSON.parse(packet[1]);
        let listOnlineReward = JSON.parse(packet[2]);
        let indexDailyReward = packet[3];
        let indexOnlineReward = packet[4];
        let timeRemain = packet[5];
        Global.listDailyReward = listDailyReward;
        Global.listOnlineReward = listOnlineReward;
        Global.indexDailyReward = indexDailyReward;
        Global.indexOnlineReward = indexOnlineReward;
        Global.NetworkManager.SetTimeOnline (timeRemain);
    },

    HandleReceiveDailyBonus(packet) {
        let indexDailyReward = packet[1];
        let accountBalance = packet[2];
        Global.indexDailyReward = indexDailyReward;
        Global.MainPlayerInfo.ingameBalance = accountBalance;
        Global.LobbyView.UpdateInfoView ();
        Global.UIManager.showRewardPopup (Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE);
    },

    HandleReceiveTimeOnlineBonus(packet) {
        let indexOnlineReward = packet[1];
        let accountBalance = packet[2];
        let timeRemain = packet[3];
        Global.indexOnlineReward = indexOnlineReward;
        Global.MainPlayerInfo.ingameBalance = accountBalance;
        Global.LobbyView.UpdateInfoView ();
        Global.UIManager.showRewardPopup (Global.Enum.STATUS_GIFT_POPUP.ONLINE);
        Global.NetworkManager.SetTimeOnline (timeRemain);
    },

    HandleUpdateVip(packet) {
        let levelVip = packet[1];
        let vipPoint = packet[2];
        let rewardSpinString = packet[3];
        let accountBalance = packet[4];
        Global.MainPlayerInfo.vipLevel = levelVip;
        Global.MainPlayerInfo.vipPoint = vipPoint;
        Global.MainPlayerInfo.ingameBalance = accountBalance;
            Global.LobbyView.UpdateInfoView ();
        Global.UIManager.showRewardPopup (Global.Enum.STATUS_GIFT_POPUP.VIP);
    },

    HandleAccountHistory(packet) {
        Global.UIManager.hideMiniLoading();
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] =  JSON.parse(listDataString[i]);
            }
            Global.HistoryPopup.SetInfoHistoryPlay (listData);
    },

    HandleGetJoinCardFromPieceInfo(packet) {
        let telcoPieceString = packet[1];
        let listTelcoPiece = [];
        for (let i = 0; i < telcoPieceString.length; i++) {
            listTelcoPiece [i] = JSON.parse (telcoPieceString[i]);
        }
        let numbPiece = packet[2];
        Global.ShopPopup.SetUpListInfoPiece (listTelcoPiece, numbPiece);
    },

    HandlePingTime(packet) {
        require("SyncTimeControl").getIns().HandlePing(packet);
        Global.LobbyView.UpdateTime();
    },

    //news 
    HandleGetNews(packet) {
        let newsString = packet[1];
        let newsConfig = [];
        for (let i = 0; i < newsString.length; i++) {
            newsConfig [i] = JSON.parse (newsString[i]);
        }
        Global.EventPopup.GetNews (newsConfig);
    },

    HandleGetEventInfo(packet) {
            let infoEventString = packet[1];
            let listData = [];
            for (let i = 0; i < infoEventString.length; i++) {
                listData[i] =  JSON.parse(infoEventString[i]);
            }
            if(Global.EventPopup != null && Global.EventPopup.node.active == true)
                Global.EventPopup.GetListEventInfo (listData);
    },

    HandleGetTopEvent(packet) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] =  JSON.parse(listDataString[i]);
            }
            let currentDataString = packet[2];
            let currentData = JSON.parse(currentDataString);
            Global.EventPopup.GetRankEvent (listData, currentData);
    },

    //diamond
    HandleBuyShopPackage(packet) {
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("SUCCESS"));
        let itemData = packet[1];
        let accountBalance = packet[2];
        let diamondBalance = packet[3];
        Global.MainPlayerInfo.SetUpDiamond(diamondBalance);
        Global.MainPlayerInfo.SetupMoney(accountBalance);
        Global.LobbyView.UpdateInfoView();
        Global.ShopDiamondPopup.UpdateDiamond(diamondBalance);
    },

    HandleReceiveDiamond(packet) {
        let accountId = packet[1];
        let rewardDiamond = packet[2];
        let diamondBalance = packet[3];
        if (accountId == Global.MainPlayerInfo.accountId)
        {
            let reward = {
                RewardType : Global.Enum.REWARD_TYPE.DIAMOND,
                Amount : rewardDiamond,
                ItemType : 0,
            };
            let listReward = [];
            listReward[0] = reward;
            Global.listReward[Global.listReward.length] = listReward;
            Global.MainPlayerInfo.SetUpDiamond(diamondBalance);
                Global.LobbyView.UpdateInfoView();
            Global.UIManager.showRewardPopup(WeeklyRewardPopup.STATUS_GIFT_POPUP.REWARD, Global.MyLocalization.GetText("GET_REWARD"));
        }
    },

    HandleUpdateDiamond(packet) {
        let diamondBalance = packet[1];
        Global.MainPlayerInfo.SetUpDiamond(diamondBalance);
        Global.LobbyView.UpdateInfoView();
    },

    //rank
    HandleTakeJackpotRank(packet) {
        Global.UIManager.hideMiniLoading();
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] =  JSON.parse(listDataString[i]);
            }
            if(Global.RankPopup != null && Global.RankPopup.node.active == true)
                Global.RankPopup.SetInfoTakeJackpot (listData);
    },

    HandleTopJackpotRank(packet) {
        Global.UIManager.hideMiniLoading();
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] =  JSON.parse(listDataString[i]);
            }
            if(Global.RankPopup != null && Global.RankPopup.node.active == true)
                Global.RankPopup.SetInfoTopWinJackpot (listData);
        }
    },

    //pigbank
    HandleGetPigBankInfo(packet) {
        Global.UIManager.showPigBankPopup(packet[1]);
    },

    HandleTakePigBank(packet) {
        let reward = packet[1];
        let accountBalance = packet[2];
        let description = packet[3];
        if(Global.PigBankPopup) {
            Global.PigBankPopup.ShowEffect(reward, accountBalance, description);
        }
    },

    //tournament
    HandleGetTournamentConfig(packet) {
        cc.log(packet);
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        Global.LobbyView.ShowTournament(listData);
    },

    //free spin reward
    HandleRewardSpinGetInfo(packet) {
        //let info = JSON.parse(packet[1]);
        // DailyGameManager.getIns().InitInfoFreeGame(info);
        cc.log(packet);
        let info = [];
        for(let i = 0; i < packet[1].length; i++){
            info.push(JSON.parse(packet[1][i]));
        }
        Global.RewardSpin_Model = info;
        cc.log(Global.RewardSpin_Model);
    },
    
    //challenge
    HandleGetConfigChallenge(packet) {
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        Global.ChallengePopup.UpdateChallengeInfo(listData);
        cc.log(listData);
    },

    HandleRegisterChallenge(packet) {
        cc.log(packet);
        Global.isChallenge = 1;
        require("ScreenManager").getIns().roomType = 20;
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
    },

    //battle
    HandleBattleFieldRegister(packet) {
        cc.log(packet);
        let accountBalance = packet[1];
        let user = JSON.parse(packet[2]);
        let rival = JSON.parse(packet[3]);
        let gameId = packet[4];
        let endTimeLive = packet[5];
        let turnModelString = packet[6];
        let betModel = packet[7];
        let betReward = packet[8];
        Global.betRewardBattle = betReward;
        Global.MainPlayerInfo.ingameBalance = accountBalance;
        Global.LobbyView.UpdateInfoView();
        let turnModel = [];
        if(turnModelString!= null && turnModelString.length > 0) {
            for(let i = 0; i < turnModelString.length; i++) {
                turnModel[i] = JSON.parse(turnModelString[i]);
            }
        }
        let betValue = JSON.parse(betModel).Bet;
        let dataBattle = {
            rivalName : rival.Nickname,
            myTurn : user.BattleNormalTurn,
            rivalTurn : rival.BattleNormalTurn,
            userScore : user.BattleScore,
            rivalScore : rival.BattleScore,
            endTimeLive : endTimeLive,
            startTime : require("SyncTimeControl").getIns().GetCurrentTimeServer(),
            turnModel : turnModel,
            betValue : betValue,
        };
        Global.dataBattle = dataBattle;
        if(Global.BattlePopup) {
            Global.BattlePopup.UpdateResult(user, rival, gameId, endTimeLive, turnModel);
        } else {
            require("ScreenManager").getIns().roomType = gameId;
		    require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
        }
    },

    HandleBattleFieldGetConfig(packet) {
        cc.log(packet);
        let config = [];
        for(let i = 0; i < packet[1].length; i++) {
            config[i] = JSON.parse(packet[1][i]);
        }
        Global.LobbyView.battleShowLobby.UpdateConfig(config);
        if(Global.CreateRoomBatlePopup) {
            Global.CreateRoomBatlePopup.UpdateConfig(config);
        }
    },

    HandleBattleFieldGetPlayingMatch(packet) {
        cc.log(packet);
        let gameId = packet[1];
        let time = packet[2];
        let betReward = packet[3];
        Global.betRewardBattle = betReward;
        Global.UIManager.showTimeConfirmPopup(Global.MyLocalization.GetText("CONTINUE_BATTLE"), time, gameId, ()=>{
            let data = {};
            data[1] = gameId;
            require("SendRequest").getIns().MST_Client_Battle_Field_Continue_Battle_Match(data);
        }, ()=>{
            let data = {};
            data[1] = gameId;
            require("SendRequest").getIns().MST_Client_Battle_Field_Cancel_Battle_Match(data);
        });
    },

    HandleGetLoginGiftReward(packet) {
        cc.log(packet);
        let continuousLogin_Reward_List = packet[1];
        let login_Reward_List = packet[2];
        let beforeBonueValueBalance = packet[3];
        let continuousLoginRewardValue = packet[4];
        let afterAcceptContinuousLoginRewardBalance  = packet[5];
        let loginRewardValue  = packet[6];
        let afterAcceptLoginRewardBalance  = packet[7];
        let LoginDayCounter =  packet[8];
        let ContinuousLoginDayCounter =  packet[9];
        let bonusMoneyValue =  packet[10];
        let vipBonusModel =  packet[11];
        let EventGame_VipBonusConfig =  packet[12];
        Global.UIManager.showLoginGiftPopup(continuousLogin_Reward_List, login_Reward_List, beforeBonueValueBalance, continuousLoginRewardValue,
            afterAcceptContinuousLoginRewardBalance, loginRewardValue, afterAcceptLoginRewardBalance, LoginDayCounter, ContinuousLoginDayCounter,
            bonusMoneyValue, vipBonusModel, EventGame_VipBonusConfig);
    }
});
module.exports = OutGameLogicManager;