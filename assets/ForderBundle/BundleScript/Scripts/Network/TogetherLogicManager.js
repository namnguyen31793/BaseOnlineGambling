var OutGameLogicManager = require("OutGameLogicManager");
var InGameLogicManager = require("InGameLogicManager");
var ScreenManager = require("ScreenManager");
var TogetherLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new TogetherLogicManager();
            return this.self;
        }
    },

    TogetherHandleResponse(operationResponse) {
        var data = operationResponse;
        
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        cc.log("lobby:"+responseCode);
        if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponse(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalance(operationResponse);
        }         
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            this.HandleNotify(packet);
        }    
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            this.HandleGunInfo(packet);
        }   
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_REWARD) {
            this.HandleTakeReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_REWARD) {
            this.HandleRecediveReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_DETAIL_HISTORY) {
            this.HandleHistoryGameSlot(operationResponse);
        }        
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(operationResponse);
        }       
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING) {
            this.HandlePingTime(operationResponse);
        }     
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_LIST_REWARD_ACCOUNT){
            this.HandleEventMissionDailyGetListRewardAccount(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_TAKE_ACCOUNT_REWARD){
            this.HandleEventMissionDailyGetTakeAccountReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_MISSION_CONFIG){
            this.HandleEventMissionDailyGetMissionConfig(packet);
        }

        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_GET_ACCOUNT_REWARD){
            this.HandleGetTournamentReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_TAKE_ACCOUNT_REWARD){
            this.HandleTakeTournamentReward(packet);
        }        
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_RETURN_REQUEST){
            this.HandleCheckReturnRequest(packet);
        }     
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_VIP_INFO){
            this.HandleGetVipInfo(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_SET_NICKNAME){
            this.HandleChangeDisplayName(packet);
        }
    },

    HandleLoginResponse(packet) {
        let infoUser = JSON.parse(packet[1]);
        Global.RegisterDate = new Date(infoUser.RegisterDate);
        Global.Helper.LogAction("login success");
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.CheckLoadSuccess();
           
            Global.MainPlayerInfo.SetUpInfo(infoUser);
            console.log(Global.GameId);
            Global.LobbyView.CheckShowMiniGame();
            Global.LobbyView.Handle_JoinSlot(Global.GameId)
        } 
        let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_SLOT || lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS)
                require("ScreenManager").getIns().LoadScene(lastScreenCode);
        }
        if(Global.CommandPopup && Global.CommandPopup.node && Global.CommandPopup.node.active) {
            Global.CommandPopup.Hide();
        }
    },



    HandleUpdateBalance(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY || ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandlePingTime(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

 
    HandleConfirmResponse (packet) {
        cc.log(packet);
        Global.UIManager.hideMiniLoading();
        let multiLanguageConfiges = packet[1];
        let confirmCode = packet[2];
        Global.UIManager.ShowTogetherConfirmMessenge (multiLanguageConfiges, confirmCode);
    },

    HandleGunInfo(packet) {
        cc.log(packet);
        let gunRoom1 = packet[1];
        let gunRoom2 = packet[2];
        let gunConfigByVip;
        let listGunByVip = [];

        let listGunModelRoom1 = [];
        for (let i = 0; i < gunRoom1.length; i++) {
            listGunModelRoom1[i] = JSON.parse(gunRoom1[i]);
        }
        let listGunModelRoom2 = [];
        for (let i = 0; i < gunRoom2.length; i++) {
            listGunModelRoom2[i] = JSON.parse(gunRoom2[i]);
        }
        if(CONFIG.MERCHANT == 3)
        {
            gunConfigByVip = packet[4];
            for (let i = 0; i < gunConfigByVip.length; i++) {
                listGunByVip[i] = JSON.parse(gunConfigByVip[i]);
            }
            Global.gunConfigByVip = listGunByVip;
        }
        Global.gunConfigModelRoom1 = listGunModelRoom1;
        Global.gunConfigModelRoom2 = listGunModelRoom2;
    },

    HandleRecediveReward(packet) {
        let rewardSpinString = packet[1];
        let listReward = [];
        for (let i = 0; i < rewardSpinString.length; i++) {
            listReward [i] = JSON.parse (rewardSpinString[i]);
        }
        Global.listReward[Global.listReward.length] = listReward;
        let content = packet[2];
        let accountBalance = packet[3];
        Global.MainPlayerInfo.ingameBalance = accountBalance;
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateInfoView ();
        }
        Global.UIManager.showRewardPopup (Global.Enum.STATUS_GIFT_POPUP.REWARD, content);
    },


    HandleTakeReward(packet) {
        let content = packet[1];
        let rewardBalance = packet[2];
        let rewardSpin = packet[3];
        let currentAccountBalance = packet[4];
        let currentSpin = packet[5];

        Global.currentSpin = currentSpin;
        Global.MainPlayerInfo.SetupMoney (currentAccountBalance);
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateInfoView ();
        }
        Global.UIManager.showServerRewardPopup (content, rewardSpin, rewardBalance);
    },


    //notify
    HandleNotify(packet) {
        let content = packet[1];
        let speed = packet[2];
        let repeat = packet[3];
        let type = packet[4];
        if(type == 5) {
            if(Global.NotifyVertically) {
                Global.NotifyVertically.AddNotify(content);
            }
        }
        
    },

  

    

    //top
    HandleGetTopPlayerWorld(packet) {
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerWorld(data);
        }
        
    },

    HandleGetTopPlayerGame(packet) {
        cc.log(packet);
        let gameType = packet[1];
        let data = [];
        for(let i = 0; i < packet[2].length; i++) {
            data[i] = JSON.parse(packet[2][i]);
        }
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerGame(gameType, data);
        }
        
    },

    //tournament
    HandleGetTournamentReward(packet) {
        cc.log(packet);
        let tournamentId = packet[1];
        let rankId = packet[2];
        let reward = packet[3];
        Global.UIManager.showRewardTournamentPopup(tournamentId, rankId, reward, 20);
    },

    HandleTakeTournamentReward(packet) {
        let accountBalance = packet[1];
        Global.RewardTourPopup.ShowEffect(accountBalance);
    },

   
   
    //check
    HandleCheckReturnRequest(packet) {
        cc.log("check return request");
        cc.log(packet);
        let code = packet[1];
        if(code == Global.Enum.REQUEST_CODE.MSG_CLIENT_CHECK_LOGIN_REWARD || code == Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_MISSION_GET_CONFIG) {
            Global.LobbyView.showStartGame.Action();
        }
    },
   

   

    //vip
    HandleGetVipInfo(packet) {
        let currentVipId = packet[1];
        let currentVipPoint = packet[2];
        Global.MainPlayerInfo.vip = currentVipId;
        cc.log("vip:"+currentVipId);
        Global.LobbyView.txtVip.string = "VIP" + currentVipId;
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Vip/Vip"+currentVipId, (pre)=>{
            if(Global.LobbyView.iconVip != null&& Global.LobbyView.iconVip.materials != null)
                Global.LobbyView.iconVip.spriteFrame = pre;
        });
        if(Global.ProfilePopup) {
            Global.ProfilePopup.SetInfoProfile();
        }
        if(Global.MainPlayerInfo.accountId == 9203) {
			Global.GameConfig.TextNotifiAlterLogin = "";
			Global.GameConfig.FeatureConfig.CashOutFeature = Global.Enum.EFeatureStatus.Close;
			Global.GameConfig.FeatureConfig.CashInPaypal = Global.Enum.EFeatureStatus.Close;
			Global.GameConfig.FeatureConfig.CashInWeChat = Global.Enum.EFeatureStatus.Close;
			Global.GameConfig.FeatureConfig.CashInByMomoFeature = Global.Enum.EFeatureStatus.Close;
			Global.GameConfig.FeatureConfig.CashInByBankFeature = Global.Enum.EFeatureStatus.Close;
			Global.GameConfig.FeatureConfig.CashInByCardFeature = Global.Enum.EFeatureStatus.Close;
		}
    },

    //nickname
    HandleChangeDisplayName(packet) {
        cc.log("------------------");
        cc.log(packet);
        let defaultDisplayName = packet[1];
        let messageError = packet[2];
        let isResult = packet[3];
        if(Global.SetNamePopup) {
            Global.SetNamePopup.GetResult(defaultDisplayName, messageError, isResult);
        }
    },
});
module.exports = TogetherLogicManager;