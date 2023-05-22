var CityNetworkManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new CityNetworkManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];

        switch (responseCode) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CITY_GAME_CHATROOM_GET_CHAT:
                this.HandleCityGetChat(packet);
                break;
            case  Global.Enum.RESPONSE_CODE.MSG_SERVER_CITYGAME_HOUSE_ACCOUNT_HOUSE_INFO:
                this.HandleCityHomeAccountHouseInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CITYGAME_HOUSE_ITEM_GET_INFO:
                this.HandleCityHouseItemGetInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CITYGAME_HOUSE_ITEM_CONFIRM_BUY:
                this.HandleCityHouseItemConfirmBuy(packet);
                break;
            default:
                break;
        }
    },

    HandleCityGetChat(packet) {
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        Global.CityView.GetChat(listData);
    },

    //home
    HandleCityHomeAccountHouseInfo(packet){
        cc.log(packet);
        Global.HomeView.handleResponInfo(packet);
    },
    HandleCityHouseItemGetInfo(packet){
        cc.log(packet);
        Global.HomeView.handleHouseItemGetInfo(packet);
    },
    HandleCityHouseItemConfirmBuy(packet){
        cc.log(packet);
        Global.HomeView.handleHouseItemConfirmBuy(packet);
    },

});
module.exports = CityNetworkManager;