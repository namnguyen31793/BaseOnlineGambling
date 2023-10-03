cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },
    
    Init(slotView) {
        this.slotView = slotView;
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
    },

    QuitGame(){
        this.slotView.RequestLeaveRoom();
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
    },
});
