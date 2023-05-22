var SkillNetworkManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new SkillNetworkManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        cc.log("HandleResponse "+responseCode);
        switch (responseCode) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_PLINKO_BASE_GET_ACCOUNT_INFO:
                this.HandlePlinkoGetAccountInfo(packet);
                break;
            case  Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_PLINKO_BASE_GET_ROOM_CONFIG:
                this.HandlePlinkoGetRoomInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_PLINKO_BASE_PLAY:
                this.HandlePlinkoPlay(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_BASE_CHECK_ADS:
                this.HandlePlinkoCheckAds(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_MINE_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_MINE_GET_ROOM_CONFIG:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_MINE_PLAY:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_MINE_STARTGAME:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_SKILLGAME_MINE_CASHOUT:
                if (Global.MiniMiner != null) {
                    Global.MiniMiner.responseServer(responseCode, packet);
                }
                break;
            default:
                break;
        }
    },

    HandlePlinkoGetAccountInfo(packet) {
        cc.log(packet);
    },

    HandlePlinkoGetRoomInfo(packet) {
        cc.log(packet);
        let config = [];
        for(let i = 0; i < packet[1].length; i++) {
            config[i] = JSON.parse(packet[1][i]);
        }
        Global.PlinkoBaseView.InitRoomConfig(config);
    },

    HandlePlinkoPlay(packet) {
        cc.log(packet);
        let accountBalance = packet[1];
        let spinId = packet[2];
        let id = packet[3];
        let matrix = packet[4];
        let multi = packet[5];
        let reward = packet[6];
        let rewardId = packet[9];
        let turnType = packet[10];
        let betValue = packet[11];
        Global.PlinkoBaseView.PlayGame(accountBalance, id, matrix, multi, reward, rewardId, turnType, betValue);
        // msgData[DATA_NUMBER.DATA_3] = _RewardId;
        // msgData[DATA_NUMBER.DATA_7] = _Jackpot;
        // msgData[DATA_NUMBER.DATA_8] = _ModelFreeString;
    },

    HandlePlinkoCheckAds(packet) {
        cc.log(packet);
        let isShow = packet[1];
        let privateKey = packet[2];
        Global.PlinkoBaseView.GetPrivateKey(privateKey);
    },
    
});
module.exports = SkillNetworkManager;