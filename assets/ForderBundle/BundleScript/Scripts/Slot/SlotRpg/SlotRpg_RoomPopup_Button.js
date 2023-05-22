cc.Class({
    extends: cc.Component,

    ctor() {
        this.gameId = 0;
    },
    properties: {
    },

    Init(data){
        this.gameId = data.Id;
    },

    ClickRegisRpg(){
        if(this.gameId <= 0)
        return;
        Global.UIManager.showMiniLoading();
        let msg = {};
        msg[1] = this.gameId;
        msg[40] = 27;
        require("SendRequest").getIns().MST_Client_Rpg_Battle_Register(msg);
    },
});
