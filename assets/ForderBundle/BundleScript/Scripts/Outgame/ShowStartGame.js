cc.Class({
    extends: cc.Component,
    ctor() {
        this.listAction = [];
        this.index = 0;
        this.isShowBanner = false;
    },

    properties: {
        
    },

    onLoad() {
        if(CONFIG.MERCHANT == "2" || CONFIG.MERCHANT == "3") {
            if(!Global.isShowStart) {
                this.listAction.push(()=>{
                    if(Global.registerTime) {
                        let currentTime = require("SyncTimeControl").getIns().GetCurrentTimeServer();
                        if(currentTime-Global.registerTime.getTime() < 60000) {
                            Global.UIManager.ShowSetNamePopup(Global.MainPlayerInfo.nickName, ()=>{
                                this.Action();
                            });
                        } else {
                            this.Action();
                        }
                    } else {
                        this.Action();
                    }
                    
                });
                // this.listAction.push(()=>{
                //     Global.UIManager.ShowNewsPopup();
                // });
                // this.listAction.push(()=>{
                //     Global.LobbyView.OnCheckMail();
                //     Global.LobbyView.showStartGame.Action();
                // });
                // this.listAction.push(()=>{
                //     require("SendRequest").getIns().MST_Client_FreeReward_Show_Banner();
                // });
            }
        } else {
        }
    },


    Action() {
        // return;
        Global.isShowStart = true;
        cc.log(this.index+"    "+this.listAction.length);
        if(this.index < this.listAction.length)
            this.listAction[this.index++]();
    },
});
