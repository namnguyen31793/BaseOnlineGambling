cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        _listRank: [],
        srcListView: require("BaseScrollView"),
    },

    Init(slotView) {
        this.slotView = slotView;
        let msg = {};
        msg[1] = 1;
        msg[40] = this.slotView.slotType;
        require("SendRequest").getIns().MST_Client_Slot_Get_Top_Jackpot(msg);
        Global.UIManager.showMiniLoading();
    },

    responseServer(packet) {
        let dataJson = packet[1];
        let length = dataJson.length;
        this.srcListView.init(dataJson, (length * 69), 69);
        Global.UIManager.hideMiniLoading();
    },

    onClickClose() {
        this.slotView.PlayClick();
        actionEffectClose(this.node, () => {
            this.node.destroy();
        })

    },

    // update (dt) {},
});
