cc.Class({
    extends: cc.Component,

    properties: {
        notifyObj : cc.Node,
        _isTouch: false,
        _isMove: false,
        _v2OffsetChange: null,
        _vecStart: null,

    },

    start() {
        if(Global.isTutorial > 0 || require("ScreenManager").getIns().roomType == 1001) {
            this.node.active = false;
            return;
        }
        if(Global.isChallenge == 0 && Global.dataBattle == null && Global.RpgConfig == null) {
            require("SendRequest").getIns().MST_Client_Get_My_Collection();
        } else {
            this.node.active = false;
        }
        this.node.x = cc.winSize.width/2-this.node.width/2-20;
    },

    onClick() {
        // let data = {};
        // data[1] = this.input.string;
        // require("SendRequest").getIns().MST_Client_Event_Take_Not_Enought_Money_Reward(data);
        // return;
        Global.UIManager.showCollectionPopup();
        if(Global.SlotNetWork.slotView.isAuto) {
            Global.SlotNetWork.slotView.menuView.toggleAuto.isChecked = false;
            Global.SlotNetWork.slotView.isAuto = false;
        }
    },

    UpdateInfo(infoItem, rewardList, missionList) {
        let isHasReward = false;
        for(let i = 0; i < rewardList.length; i++) {
            let reward = JSON.parse(rewardList[i]);
            if(!reward.IsReaded) {
                isHasReward = true;
            }
        }
        this.notifyObj.active = isHasReward;
    },

    onLoad() {
        Global.ButtonCollection = this;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMove = false;
            this._isTouch = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            if (this._isTouch) {
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
                this.node.position = target.addSelf(this._v2OffsetChange);
                this._isMove = true;
            }
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            this._isTouch = false;
            if (!this._isMove) this.onClick();
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));


            if (target.subSelf(this._vecStart).mag() < 15) {
                this.onClick();
            }
        })

    },

    onDestroy() {
        Global.ButtonCollection = null;
    },

    
});
