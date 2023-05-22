

cc.Class({
    extends: cc.Component,
    ctor() {
        this.mailObject = null;
    },

    properties: {
        headerText : cc.Label,
        senderText : cc.Label,
        timeText : cc.Label,
        colorRead : cc.Color,
        nodeRead : cc.Node,
        nodeDelete : cc.Node,
    },

    initItem(mailObject) {
        this.mailObject = mailObject;
        this.headerText.string = Global.Helper.formatMail(mailObject.MailHeader);
        this.timeText.string = this.formatTime(mailObject.SendTime);
        this.senderText.string = mailObject.SenderNickname;
        if (mailObject.IsReaded == 0) {
            this.headerText.node.color = cc.Color.YELLOW;
            this.timeText.node.color = cc.Color.WHITE;
            this.senderText.node.color = cc.Color.WHITE;
            this.nodeDelete.active = false;
        }
        else if(mailObject.IsReaded == 1) {
            this.headerText.node.color = this.colorRead;
            this.timeText.node.color = this.colorRead;
            this.senderText.node.color = this.colorRead;
            this.nodeDelete.active = true;
        }
    },

    ShowMess() {
        Global.MailPopup.ShowMailById (this.mailObject.MailId);
        if (this.mailObject.IsReaded == 0) {
            let msgData = {};
            msgData [1] = this.mailObject.MailId;
            require("SendRequest").getIns().MST_Client_Read_Mail (msgData);
            if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
                Global.LobbyView.UpdateMailStatus ();
            }
        }
        if (this.mailObject.IsReaded == 0) {
            this.mailObject.IsReaded = 1;
            this.headerText.string = Global.Helper.formatMail(this.mailObject.MailHeader);
            this.timeText.string = this.formatTime(this.mailObject.SendTime);
            this.senderText.string = this.mailObject.SenderNickname;
            this.headerText.node.color = this.colorRead;
            this.timeText.node.color = this.colorRead;
            this.senderText.node.color = this.colorRead;
            this.nodeDelete.active = true;
            Global.LobbyView.UpdateMailStatus();
        }
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString2((new Date(str)).getTime());
    },

    ClickDeleteMail() {
        Global.UIManager.showConfirmPopup(Global.MyLocalization.GetText ("DELETE_MAIL"),()=>{
            let msgData = {};
            msgData [1] = this.mailObject.MailId;
            require("SendRequest").getIns().MST_Client_Delete_Mail (msgData);
        },null);
    },
    
});
