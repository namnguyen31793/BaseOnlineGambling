cc.Class({
    extends: cc.Component,
    ctor() {
        this.timeType1 = 0;
        this.timeType2 = 0;
        this.currentTypeTimeTx = 1;
        this.currentTimeTx = 0;
        this.isLoading = false;
        this.isShow = false;
    },
    properties: {
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _listShowed: [],
        _v2OffsetChange: null,
        _vecStart: null,
        itemOnline: require("ItemOnlineView"),
        isMove : true,
        isShow : false,
        inScene : false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(this.inScene) {
            this.node.x = cc.winSize.width/2-this.node.width/2-20;
        }
        Global.BtnOnline = this;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            cc.log("chay vao click roi")
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
        })
        if(this.isMove) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
                if (this._isTouch) {
                    let v2Touch = cc.v2(touch.getLocation());
                    let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
                    this.node.position = target.addSelf(this._v2OffsetChange);
                    this._isMoveBtnMiniGame = true;
                }
            })
    
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
                this._isTouch = false;
                this.checkPosition();
                if (!this._isMoveBtnMiniGame) this.node.getComponent("BtnOnline").onClick();
            })
    
            this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
                this._isTouch = false;
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
    
                this.checkPosition()
    
                if (target.subSelf(this._vecStart).mag() < 15) {
                    this.node.getComponent("BtnOnline").onClick();
                }
            })
        }
        
    },

    start() {
        if(this.isMove) {
            let fxScale_01 = cc.tween().to(0.1, { scale: 0.8 });
            let fxScale_02 = cc.tween().to(0.1, { scale: 1 });
            let fxScale = cc.tween().then(fxScale_01).then(fxScale_02);

            let actionX = cc.tween()
                .repeat(3, fxScale)
                .delay(2);

            cc.tween(this.node)
                .then(actionX)
                .repeatForever()
                .start();
        }
        if(!this.isShow) {
            if(Global.isTutorial == 0) {
                this.node.active = true;
            } else {
                this.node.active = false;
            }
        }

        this.MissionOnlineAccountInfo();
    },

    MissionOnlineAccountInfo(){
        let msgData = {};
        cc.log("mission online send");
        require("SendRequest").getIns().MST_Client_Event_Mission_Online_Account_Info (msgData);
        
	},

    onClick(event, data) {
        if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
        if(this.itemOnline.type != 2) {
            if(Global.LuckyCardPopup == null || !Global.LuckyCardPopup.node.activeInHierarchy) {
                Global.Helper.LogAction("Click show lucky card");
                Global.UIManager.showLuckyCardPopup();
            }
        }
           
        else {
            Global.Helper.LogAction("Click Nhan thuong Online");
            this.itemOnline.ClickMissionOnlineTakeReward();
        }
    },

    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    checkPosition() {
        let offsetX = cc.winSize.width / 2;
        let offsetY = cc.winSize.height / 2;
        if (this.node.position.x > (offsetX - this.node.width / 2) ||
            this.node.position.x < -(offsetX - this.node.width / 2)
        ) {
            if (this.node.x > 0) {
                this.node.x = offsetX - this.node.width / 2 + 5;
            } else {
                this.node.x = -offsetX + this.node.width / 2 - 5;
            }
        }


        if (this.node.position.y > (offsetY - this.node.height / 2) ||
            this.node.position.y < -(offsetY - this.node.height / 2)
        ) {
            if (this.node.y > 0) {
                this.node.y = offsetY - this.node.height / 2 + 5;
            } else {
                this.node.y = -offsetY + this.node.height / 2 - 5;
            }
        }
    },

    ShowViewMissionOnline(type, count){
		this.itemOnline.ShowViewOnline(type, count);
	},

 
    onDestroy() {
        Global.BtnOnline  = null;
    },

    // update (dt) {},
});
