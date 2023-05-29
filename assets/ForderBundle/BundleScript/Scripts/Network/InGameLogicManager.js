var InGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new InGameLogicManager();
            return this.self;
        }
    },

    InGameHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING) {
            this.HandlePingTime(packet);
            // if(require("FishNetworkManager").getIns().gamelogic) {
			// 	require("FishNetworkManager").getIns().gamelogic.CheckIce();
			// 	require("FishCollection").getIns().UpdateCurrentMoveTime();
			// }
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponce(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_NOTIFICATION) {
            this.HandleNotifyInGame(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalance(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            this.HandleNotifyCashOut(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            this.HandleTopJackpotRank(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ACCOUNT_INFO) {
            this.HandleLeaveRoomFish(packet);
        } 
    },

    HandleNotifyInGame(packet) {
        let notifyfString = packet[1];
        let notifyData = JSON.parse(notifyfString);
        require("FishNetworkManager").getIns().gamelogic.NotifyInGame (notifyData);   
    },

    HandlePingTime(packet) {
        require("SyncTimeControl").getIns().HandlePing(packet);
        
    },

    HandleUpdateBalance(packet) {
        let playerId = packet[1];
        let money = packet[2];
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            require("FishNetworkManager").getIns().gamelogic.UpdateBalane (playerId, money, 0);
        } else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
            require("WalletController").getIns().UpdateWallet (money);
        }
    },

  

    HandleTopJackpotRank(packet) {
        let listDataTopJackpotString = packet[1];
        let listDataTopJackpot = [];
        for (let i = 0; i < listDataTopJackpotString.length; i++) {
            listDataTopJackpot[i] = JSON.parse(listDataTopJackpotString[i]);
        }

        let listDataBigWin = [];
        if(packet[2]) {
            let listDataBigWinString = packet[2];
            for (let i = 0; i < listDataBigWinString.length; i++) {
                listDataBigWin[i] = JSON.parse(listDataBigWinString[i]);
            }
        }
       

        Global.InGameView.btnVinhDanh.InitInfo(listDataTopJackpot, listDataBigWin);
    },

    HandleLeaveRoomFish(packet) {
        let accountBalance = JSON.parse(packet[1]).IngameBalance;
        Global.GameLogic.LeaveRoom(accountBalance);
    },

   
});
module.exports = InGameLogicManager;