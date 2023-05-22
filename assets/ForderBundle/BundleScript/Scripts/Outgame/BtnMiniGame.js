cc.Class({
    extends: cc.Component,
    ctor() {
        this.timeType1 = 0;
        this.timeType2 = 0;
        this.currentTypeTimeTx = 1;
        this.currentTimeTx = 0;
        this.isLoading = false;
        this.isLoadingTX = false;
        this.isShow = false;
    },
    properties: {
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _listShowed: [],
        _v2OffsetChange: null,
        _vecStart: null,
        anim: cc.Animation,
        lbTimeTx:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.BtnMiniGame = this;
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
            if (!this._isMoveBtnMiniGame) this.node.getComponent("BtnMiniGame").onClick();
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));

            this.checkPosition()

            if (target.subSelf(this._vecStart).mag() < 15) {
                this.node.getComponent("BtnMiniGame").onClick();
            }
        })
        this.poolMoney = new cc.NodePool();
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

    clickMiniSlot(pos = cc.v2(0,0)) {
        if (this.isLoading) return;
        this.isLoading = true;
        if (Global.MiniSlot == null) {
            Global.UIManager.initMiniSlot(() => {
                this.isLoading = false;
                if (!Global.UIManager.checkShowMiniGame(Global.MiniSlot.node, false))
                    Global.UIManager.showMiniSlot(pos);
            })
        } else {
            this.isLoading = false;
            if (!Global.UIManager.checkShowMiniGame(Global.MiniSlot.node, false))
                Global.UIManager.showMiniSlot(pos);
            else Global.MiniSlot.onClickClose();

        }
    },

    clickMiniPoker() {
        if (this.isLoading) return;
        this.isLoading = true;
        if (Global.MiniPoker == null) {
            Global.UIManager.initMiniPoker(() => {
                this.isLoading = false;
                if (!Global.UIManager.checkShowMiniGame(Global.MiniPoker, false))
                    Global.UIManager.showMiniPoker();
            })
        } else {
            this.isLoading = false;
            if (!Global.UIManager.checkShowMiniGame(Global.MiniPoker, false)) {
                Global.UIManager.showMiniPoker();
            } else {
                Global.MiniPoker.ForceStop();
            }

        }
    },

    clickMiniMiner() {
        if (this.isLoading) return;
        this.isLoading = true;
        if (Global.MiniMiner == null) {
            Global.UIManager.MinerPoker(() => {
                this.isLoading = false;
                if (!Global.UIManager.checkShowMiniGame(Global.MiniMiner, false))
                    Global.UIManager.showMiniMiner();
            })
        } else {
            this.isLoading = false;
            if (!Global.UIManager.checkShowMiniGame(Global.MiniMiner, false)) {
                Global.UIManager.showMiniMiner();
            } else {
                Global.MiniMiner.ForceStop();
            }

        }
    },

    clickTaiXiu(pos = cc.v2(0,0)) {
        if (this.isLoadingTX) return;
        this.isLoadingTX = true;
        if (Global.TaiXiu == null) {
            Global.UIManager.iniTaiXiu(() => {
                this.isLoadingTX = false;
                if (!Global.UIManager.checkShowMiniGame(Global.TaiXiu.node, false))
                    Global.UIManager.showTaiXiu(pos);
            })
        } else {
            this.isLoadingTX = false;
            if (!Global.UIManager.checkShowMiniGame(Global.TaiXiu.node, false))
                Global.UIManager.showTaiXiu(pos);
            else Global.TaiXiu.onClickClose();
        }
    },

    clickSpin() {
        if (this.isLoading) return;
        Global.UIManager.showLuckySpinPopup (Global.listResult, Global.currentSpin);
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

    initTimeTaiXiu(type, time) {
        // this.lbTimeTx.node.parent.active = true;
        this.currentTypeTimeTx = type;
        if (this.currentTypeTimeTx == 1) {
            this.lbTimeTx.node.color = cc.Color.WHITE;
        } else {
            this.lbTimeTx.node.color = cc.Color.YELLOW;
        }
        this.currentTimeTx = time;
        if (time < 10) {
            this.lbTimeTx.string = "00:0" + time;
        } else {
            this.lbTimeTx.string = "00:" + time;
        }
        if(Global.LobbyView) {
            Global.LobbyView.textTimeTaiXiu.string = this.lbTimeTx.string;
        }

        this.unschedule(this.funSche);
        this.schedule(this.funSche = () => {
            this.currentTimeTx--;
            if (this.currentTimeTx < 10) {
                this.lbTimeTx.string = "00:0" + this.currentTimeTx;
            } else {
                this.lbTimeTx.string = "00:" + this.currentTimeTx;
            }
            if (this.currentTimeTx < 1) {
                if (this.currentTypeTimeTx == 1) {
                    this.currentTypeTimeTx = 2;
                    this.currentTimeTx = this.timeType2;
                    this.lbTimeTx.node.color = cc.Color.YELLOW;
                } else {
                    this.currentTypeTimeTx = 1;
                    this.currentTimeTx = this.timeType1;
                    this.lbTimeTx.node.color = cc.Color.WHITE;
                }
            }
            if(Global.LobbyView) {
                Global.LobbyView.textTimeTaiXiu.string = this.lbTimeTx.string;
                Global.LobbyView.textTimeTaiXiu.node.color = this.lbTimeTx.node.color;
            }
    
        }, 1)
    },

    onDestroy() {
        Global.BtnMiniGame  = null;
    },

    // update (dt) {},
});
