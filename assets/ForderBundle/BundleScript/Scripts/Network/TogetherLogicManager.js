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
        // else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_RESPONSE) {
        //     this.HandleResultSpinMiniPoker(operationResponse);
        // }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_NEW_MAIL) {
            this.HandleNewMail(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_ACCEPT_MONEY_MAIL) {
            this.HandleAcceptMoneyMail(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            this.HandlePlayDailySpin(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            this.HandleNotify(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOPUP_INFO) {
            this.HandleTopupInfoShop(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            this.HandleGunInfo(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_DELETE_MAIL_RESPONSE) {
            this.HandleDeleteMail(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PHONENUMBER) {
            this.HandleUpdatePhoneNumber(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_TAKE_JACKPOT_PERCENT_INFO) {
            this.HandleTakeJackpotPercent(operationResponse);
        }     
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_BONUS) {
            this.HandleGetDailySpinBonus(operationResponse);
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
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_SHOP_CONFIG) {
            this.HandleGetShopConfig(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            this.HandleReceiveDiamond(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            this.HandleUpdateDiamond(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_BUY_SHOP_PACKAGE_RESPONSE) {
            this.HandleBuyShopPackage(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_TELCO_SPIN) {
            this.HandleGetDailyTelcoSpin(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING) {
            this.HandlePingTime(operationResponse);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_MOMO_ORDER_REQUEST) {
            this.HandleMomoOderRequest(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            this.HandleTopTakeJackpotRank(operationResponse);
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
            if(Global.LevelManager)
                Global.LevelManager.GetLevelInfo();
            Global.MainPlayerInfo.SetUpInfo(infoUser);
           
            Global.LobbyView.CheckShowMiniGame();
            Global.LobbyView.Handle_JoinSlot(19)
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

    HandleTopupInfoShop(packet) {
        let cardTopupInfosInString = packet[1];
        let cardTopupInfosIn = [];
        for (let i = 0; i < cardTopupInfosInString.length; i++) {
            cardTopupInfosIn[i] = JSON.parse (cardTopupInfosInString[i]);
        }
        Global.cardTopupInfosIn = cardTopupInfosIn;

        let cardTopupInfosOutString = packet[2];
        let cardTopupInfosOut = [];
        for (let i = 0; i < cardTopupInfosOutString.length; i++) {
            cardTopupInfosOut [i] = JSON.parse (cardTopupInfosOutString [i]);
        }
        Global.cardTopupInfosOut = cardTopupInfosOut;

        let bankInfosOutString = packet[3];
        let bankInfosOut = [];
        for (let i = 0; i < bankInfosOutString.length; i++) {
            bankInfosOut [i] = JSON.parse (bankInfosOutString [i]);
        }
        Global.bankInfosOut = bankInfosOut;

        let rateCashOutBank = packet[4];
        Global.rateCashOutBank = rateCashOutBank;
    },

    HandleUpdateBalance(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY || ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandleReceiveDiamond(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandleUpdateDiamond(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandlePingTime(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY ||
            ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandleBuyShopPackage(operationResponse) {
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

    HandlePlayDailySpin(packet) {
        let indexReward = packet[1];
        let numberSpin = packet[2];
        let accountBalance = packet[3];
        Global.currentSpin = numberSpin;
        if(Global.LuckySpinPopup != null) {
            Global.LuckySpinPopup.PlaySpin (indexReward, numberSpin, () => {
                Global.MainPlayerInfo.ingameBalance  = accountBalance;
                if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
                    Global.LobbyView.UpdateInfoView();
                }
               
            });
        }
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

    HandleUpdatePhoneNumber(packet) {
        let number = packet[1];
        Global.MainPlayerInfo.phoneNumber = number;
        Global.ProfilePopup.SetInfoProfile();
        Global.UIManager.showCommandPopup (Global.MyLocalization.GetText ("SUCCESS"));
    },

    HandleNewMail(packet) {
        if (Global.GameConfig.FeatureConfig.MailFeature != Global.Enum.EFeatureStatus.Open)
            return;
        let mail = packet[1];
        let mailObj = JSON.parse (mail);
        Global.MainPlayerInfo.UpdateNewMail (mailObj);
        cc.log(require("ScreenManager").getIns().currentScreen+"    "+(require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY));
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateMailStatus ();
            Global.LobbyView.RequestGetVipConfig();
            Global.UIManager.showConfirmPopup(Global.MyLocalization.GetText("NEW_MAIL_OPEN"),()=>{
                Global.UIManager.showMailPopup();
            },null);
        } else {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEW_MAIL_CLOSE"),null);
        }
    },

    HandleAcceptMoneyMail(packet){
        cc.log("HandleAcceptMoneyMail");
        cc.log(packet);
        if (Global.GameConfig.FeatureConfig.MailFeature != Global.Enum.EFeatureStatus.Open)
            return;
        let mailMoney = packet[1];
        let currentAccountBalance = packet[2];
        let rewardBonusDescription = packet[3];
        let fishingShooting_AccountBag_Model = packet[4];       

        Global.UIManager.showNotifyRewardPopup(mailMoney, rewardBonusDescription, currentAccountBalance);

        //Global.UIManager.showCommandPopup(Global.Helper.formatString( Global.MyLocalization.GetText("ACCEPT_MONEY_MAIL"), [Global.Helper.formatNumber(mailMoney)]));
        // if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
        //     Global.LobbyView.UpdateInfoView ();
        // } else {
        //     Global.MainPlayerInfo.ingameBalance = currentAccountBalance;
        // }
        //bag
        let listData = [];
        for (let i = 0; i < fishingShooting_AccountBag_Model.length; i++) {
            listData[i] = JSON.parse(fishingShooting_AccountBag_Model[i]);
        }   
        require("BagController").getIns().UpdateBagInfo(listData);
        
        let currentScreen = require("ScreenManager").getIns().currentScreen;
        if(currentScreen != 0 && currentScreen) 
            if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                require("WalletController").getIns().UpdateWallet(currentAccountBalance);
                if(Global.LobbyView)
                    Global.LobbyView.OnUpdateDiamonView();
                if(Global.LobbyFish)
                    Global.LobbyFish.OnUpdateDiamonView();
            }
    },

    HandleDeleteMail(packet) {
        let data = packet[1];
        let listMailObj =[];
        let numMailNotRead = 0;
        for (let i = 0; i < data.length; i++) {
            listMailObj [i] = JSON.parse (data [i]);
            if (listMailObj [i].IsReaded == 0)
                numMailNotRead += 1;
        }

        Global.MainPlayerInfo.SetUpMail (listMailObj, numMailNotRead);
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateMailStatus ();
        }
        Global.MailPopup.SetInfoMail ();
    },

    HandleGetDailyTelcoSpin(packet) {
        let index = packet[1];
        let reward = packet[2];
        if(Global.LuckySpinPopup != null) {
            Global.LuckySpinPopup.UpdateResultBonus(index, reward);
        }
    },

    HandleTopTakeJackpotRank(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        }
    },

    //shop

    HandleMomoOderRequest(packet) {
        if(Global.ShopPopup != null && Global.ShopPopup.node.active) {
            let mobile = packet[1];
            let description = packet[2];
            let account = packet[3];
            let rate = packet[4];
            Global.ShopPopup.momoInObj.getComponent("ShopTabMomoIn").UpdateInfo(mobile, account, description, rate);
        }
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

    //daily
    HandleEventMissionDailyGetListRewardAccount(packet) {
        if(Global.QuestPopup) {
            let data = [];
            for(let i = 0; i < packet[1].length; i++) {
                data[i] = JSON.parse(packet[1][i]);
            }
            Global.QuestPopup.SetStateQuestInfo(data);
        }
    },

    HandleEventMissionDailyGetTakeAccountReward(packet) {
        let goldValue = packet[1];
        let accountBalance = packet[2];
        if(Global.QuestPopup) {
            Global.QuestPopup.ShowEffect(accountBalance);
        }
    },

    HandleEventMissionDailyGetMissionConfig(packet) {
        if(Global.QuestPopup) {
            let data = [];
            for(let i = 0; i < packet[1].length; i++) {
                data[i] = JSON.parse(packet[1][i]);
            }
            Global.QuestPopup.UpdateQuestInfo(data);
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