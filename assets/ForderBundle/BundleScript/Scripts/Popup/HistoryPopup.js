cc.Class({
    extends: cc.Component,
    ctor() {
    },

    properties: {
        srcView : require("BaseScrollView"),
    },

    show() {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        Global.UIManager.showMiniLoading();
        require("SendRequest").getIns().MST_Client_Account_History();
    },

    SetInfoHistoryPlay(data) {
        if (data.length == 0)
            return;
        this.srcView.init(data , data.length*55 , 55);
    },

    Hide() {
        this.node.active = false;
		Global.UIManager.hideMark();
    },

    onLoad() {
        Global.HistoryPopup = this;
    },

    onDestroy() {
        Global.HistoryPopup = null;
    },
});
