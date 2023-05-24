
var EventLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new EventLogicManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        //console.log("event:"+responseCode);
        // cc.log(packet);
        switch (responseCode) {
         
           
            //top
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SCORE_GET_TOP_PLAYER_BY_GAME:  
                this.HandleGetTopPlayerGame(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SCORE_GET_TOP_PLAYER:
                this.HandleGetTopPlayerWorld(packet);
                break;
            //not enought money
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_POPUP_NOT_ENOUGHT_MONEY_REWARD:
                this.HandleNotEnoughMoney(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_POPUP_TAKE_ENOUGHT_MONEY_REWARD:
                this.HandleTakeNotEnoughMoney(packet);
                break;
       
            //event
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_GET_ACCOUNT_INFO:
                this.HandleEventGetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_PLAYGAME:
                this.HandleEventPlayGame(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_GET_HIGH_SCORE:
                this.HandleEventGetHighScore(packet);
                break;
            
            default:
                break;
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

    //not enought money
    HandleNotEnoughMoney(packet) {
        cc.log(packet);
        let rewardId = packet[1];
        let rewardMoney = packet[2];
    },

    HandleTakeNotEnoughMoney(packet) {
        cc.log(packet);
        let rewardMoney = packet[1];
        let accountBalance = packet[2];
    },

    


    //event
    HandleEventGetAccountInfo(packet) {
        cc.log(packet);
        let smallSpin = packet[1];
        let bigSpin = packet[2];
        if(smallSpin > 0 || bigSpin > 0) {
            Global.InGameView.objGacha.active = true;
        } else {
            Global.InGameView.objGacha.active = false;
        }
        if(Global.GachaEvent) {
            Global.GachaEvent.UpdateAmount(smallSpin, bigSpin);
        }
    },

    HandleEventPlayGame(packet) {
        cc.log(packet);
        // let rewardType = packet[1];
        let total = packet[3];
        let extendDescription = packet[4];
        let ingameBalance = packet[5];
        let accountBagList = packet[6];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = ingameBalance;
        }
        Global.GachaEvent.ShowSpinGacha(total, extendDescription, ingameBalance, accountBagList);
    },

    HandleEventGetHighScore(packet) {
        cc.log(packet);
        let listData1 = [];
        let listData2 = [];
        for(let i = 0; i < packet[1].length; i++) {
            listData1.push(JSON.parse(packet[1][i]));
        }
        for(let i = 0; i < packet[2].length; i++) {
            listData2.push(JSON.parse(packet[2][i]));
        }
        cc.log(listData1);
        cc.log(listData2);
        if(Global.GachaEvent) {
            Global.GachaEvent.InitInfoTop(listData1, listData2);
        }
    },

    

});
module.exports = EventLogicManager;
