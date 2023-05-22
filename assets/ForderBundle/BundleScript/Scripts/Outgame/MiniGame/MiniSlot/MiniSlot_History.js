cc.Class({
    extends: cc.Component,

    properties: {
        _listHistory: [],
        srcListView: require("BaseScrollView")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.HistoryMiniSlot = this;
        let msg = {};
        msg[1] = 1;
        msg[2] = 100;
        msg[3] = GAME_TYPE.MINI_SLOT;

        require("SendRequest").getIns().MST_Client_Slot_Get_Game_Detail_History(msg);
        Global.UIManager.showMiniLoading();
    },
    responseServer(packet) {
        let dataJson = JSON.parse(packet[1]);
        let length = dataJson.length;
        this.srcListView.init(dataJson, (length * 50), 50);
        Global.UIManager.hideMiniLoading();
    },
    onClickClose() {
        Global.HistoryMiniSlot = null;
        this.node.destroy();
    },

    onDestroy() {
        Global.HistoryMiniSlot = null;
    }

    // update (dt) {},
});
