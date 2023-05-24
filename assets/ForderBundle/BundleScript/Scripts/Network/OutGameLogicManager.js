
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
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponce(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalanceResponce(packet);
        }  else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JACKPOT_INFO) {
            this.HandleJackpotInfo(packet);
        }  else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_RANK) {
            this.HandleTakeJackpotRank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            this.HandleTopJackpotRank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_JOIN_CARD_PIECES) {
            this.HandleJoinCardFromPiece(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_PLAY_SPIN_HISTORY_RESPONSE) {
            this.HandleGetHistoryPlaySpin(packet);
        }  else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING){
            this.HandlePingTime (packet);
        } 
    },

    HandleLoginResponse(packet) {
        Global.UIManager.hideLoading();
       
        Global.MainPlayerInfo.SetUpInfo(JSON.parse(packet[1]));
       
        Global.LobbyView.CheckShowMiniGame();
        
        let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_SLOT || lastScreenCode == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS)
                require("ScreenManager").getIns().LoadScene(lastScreenCode);
        }
    },


  
    
    
    HandleUpdateBalanceResponce(packet) {
      
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



    HandlePingTime(packet) {
        require("SyncTimeControl").getIns().HandlePing(packet);
        Global.LobbyView.UpdateTime();
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



 

});
module.exports = OutGameLogicManager;