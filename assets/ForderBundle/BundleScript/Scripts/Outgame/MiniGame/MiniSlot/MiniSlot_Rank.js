cc.Class({
    extends: cc.Component,

    properties: {
        _listRank: [],
        srcListView: require("BaseScrollView")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.RankMiniSlot = this;
        require("SendRequest").getIns().MST_Client_MiniSlot_Get_Top_Winner();
        Global.UIManager.showMiniLoading();
    },

    responseServer(packet) {
        let dataJson = packet[1];
        cc.log(dataJson);
        let length = dataJson.length;
        this.srcListView.init(dataJson, (length * 50), 50);
        Global.UIManager.hideMiniLoading();
    },

    onClickClose() {
        Global.RankMiniSlot = null;
        this.node.destroy();
    },

    onDestroy() {
        Global.RankMiniSlot = null;
    },

    start() { },

    // update (dt) {},
});
