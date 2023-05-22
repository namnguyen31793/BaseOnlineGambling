cc.Class({
    extends: cc.Component,
    ctor() {
       this.cachePosition = null;
    },
    properties: {
        btnZoomIn : cc.Node,
        btnZoomOut : cc.Node,
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _listShowed: [],
        _v2OffsetChange: null,
        _vecStart: null,
        posZoomOut : {
            default: cc.v2(-16,54),
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;
        this.cachePosition = this.node.getPosition();
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            if (this._isTouch) {
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
                this.node.position = target.addSelf(this._v2OffsetChange);
                this._isMoveBtnMiniGame = true;
                this.cachePosition = this.node.getPosition();
            }
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            this._isTouch = false;
            this.checkPosition();
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));

            this.checkPosition()
        })
    },

    onClickZoomOut() {
        this.btnZoomOut.active = false;
        this.cachePosition = this.node.getPosition();
        this.node.setPosition(this.posZoomOut);
        this.node.runAction(cc.scaleTo(0.3,1));
        this.scheduleOnce(() => {
            this.btnZoomIn.active = true;
        },0.3)
    },

    onClickZoomIn() {
        this.btnZoomIn.active = false;
        this.node.setPosition(this.cachePosition);
        this.node.runAction(cc.scaleTo(0.3,0.3));
        this.scheduleOnce(() => {
            this.btnZoomOut.active = true;
        },0.3)
    },

    checkPosition() {
        let offsetX = cc.winSize.width / 2;
        let offsetY = cc.winSize.height / 2;
        // if (this.node.position.x > (offsetX - this.node.width / 2) ||
        //     this.node.position.x < -(offsetX - this.node.width / 2)
        // ) {
        //     if (this.node.x > 0) {
        //         this.node.x = offsetX - this.node.width / 2 + 5;
        //     } else {
        //         this.node.x = -offsetX + this.node.width / 2 - 5;
        //     }
        // }


        // if (this.node.position.y > (offsetY - this.node.height / 2) ||
        //     this.node.position.y < -(offsetY - this.node.height / 2)
        // ) {
        //     if (this.node.y > 0) {
        //         this.node.y = offsetY - this.node.height / 2 + 5;
        //     } else {
        //         this.node.y = -offsetY + this.node.height / 2 - 5;
        //     }
        // }
    },

    // update (dt) {},
});
