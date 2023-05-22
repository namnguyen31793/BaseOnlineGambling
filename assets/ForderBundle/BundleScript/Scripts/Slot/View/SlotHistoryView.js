
cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        _listHistory: [],
        srcListView: require("BaseScrollView"),
    },

    Init(slotView) {
        this.slotView = slotView;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.currentPage = 1;
        this.sendGetData(this.currentPage);
        this.isScr = false;
    },

    responseServer(packe) {
        Global.UIManager.hideMiniLoading();
        let Page = 1;//packe[2];
        let dataJson = packe[1];//JSON.parse(packe[1]);
        let lengthRequire = 50;//packe[3];
        let lengHienCo = dataJson.length;//packe[4];

        if (Page == 1) {
            let length = dataJson.length;
            this.srcListView.init(dataJson, (length * 40), 40);
        } else {
            this.srcListView.addListItem(dataJson, dataJson.length * 40);
        }
        if (Page == this.currentPage) {
            this.currentPage++
        }

        if (lengthRequire > lengHienCo) {
            this.isScr = false;
        } else {
            this.isScr = true;
        }
    },

    sendGetData(page) {
        let msg = {};
        msg[1] = page;
        msg[2] = 50;
        msg[3] = this.slotView.slotType;
        msg[40] = this.slotView.slotType;
        require("SendRequest").getIns().MST_Client_Slot_Get_Game_Detail_History(msg);
        Global.UIManager.showMiniLoading();
    },
    onClickClose() {
        this.slotView.PlayClick();
        actionEffectClose(this.node, () => {
            this.node.destroy();
        })
    },

    update(dt) {
        if (!this.isScr) return;
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;
        let y1 = this.srcListView.scrollView.getScrollOffset().y;
        let y2 = this.srcListView.scrollView.getMaxScrollOffset().y;
        if (y2 - y1 < 100) {
            this.sendGetData(this.currentPage);
            this.isScr = false;
        }
    },
});
