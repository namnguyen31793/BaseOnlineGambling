cc.Class({
    extends: cc.Component,

    ctor() {
        this.isShow = false;
    },
    properties: {
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _listShowed: [],
        _v2OffsetChange: null,
        _vecStart: null,
        anim: cc.Animation,
        nodeButton : cc.Node,
    },

    onLoad() {
        Global.BtnMiniGame = this;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;
        this.nodeButton.on(cc.Node.EventType.TOUCH_START, (touch) => {
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
        })

        this.nodeButton.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            if (this._isTouch) {
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
                this.node.position = target.addSelf(this._v2OffsetChange);
                this._isMoveBtnMiniGame = true;
            }
        })

        this.nodeButton.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            this._isTouch = false;
            this.checkPosition();
            if (!this._isMoveBtnMiniGame) this.node.getComponent("ButtonMiniGame").onClick();
        })

        this.nodeButton.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));

            this.checkPosition()

            if (target.subSelf(this._vecStart).mag() < 15) {
                this.node.getComponent("ButtonMiniGame").onClick();
            }
        })
    },

    start() {
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
    },

    onClick(event, data) {
        if (this.isShow) {
            this.isShow = false;
            this.anim.play("HideMiniGame");
        } else {
            this.isShow = true;
            this.anim.play("ShowMiniGame");
        }
    },

    hideGame(component, gameType) {
        component.node.setPosition(this.getPositionInView(component.node));
        component.node.parent = this.node;
        let action1 = cc.scaleTo(0.2, 0);
        let action2 = cc.moveTo(0.2, 0, 0);
        component.node.runAction(cc.sequence(cc.spawn(action1, action2), cc.place(100000, 100000)));
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

    Init() {
        this.node.setPosition(cc.v2(cc.winSize.width/2 - 100, 150));
        this.node.active = Global.isLogin;
    },

    ClickBtnMinipoker() {
		Global.UIManager.showMiniPoker();
	},

    ClickBtnMiniSlot() {
		Global.UIManager.showMiniSlot();
	},

    ClickBtnMiniMiner() {
		Global.UIManager.showMiniMiner();
	},

    onDestroy() {
        Global.BtnMiniGame  = null;
    },

    
});
