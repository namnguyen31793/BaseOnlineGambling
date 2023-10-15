cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        jackpotRoom1 : cc.Label,
        jackpotRoom2 : cc.Label,
        jackpotRoom3 : cc.Label,
    },
    
    Init(slotView) {
        this.slotView = slotView;
        this.ShowSelectRoom();
    },


    SelectRoom(event, index){
        this.slotView.PlayClick();
        this.slotView.roomID = index;
        // this.UpdateBetValue();
        this.slotView.RequestGetAccountInfo();
        this.slotView.RequestGetJackpotInfo();
        this.node.active = false;
    },

    ShowSelectRoom(){
        this.node.active = true;
        ApiController.RequestGetJackpotLobby( 1, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                console.log("ShowSelectRoom 1 "+data);
                this.jackpotRoom1.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 2, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                console.log("ShowSelectRoom 2 "+data);
                this.jackpotRoom2.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 3, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                console.log("ShowSelectRoom 3 "+data);
                this.jackpotRoom3.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
    },

    QuitGame(){
        this.slotView.RequestLeaveRoom();
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
    },

    ErrorCallBack(errorCode, message) {
    },
});
