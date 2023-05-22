cc.Class({
    extends: require("SlotFreeManager"),

    properties: {

        lbMoney : cc.Label,
        lbJackpot : cc.Label,
        lbWin : require("LbMonneyChange"),

        animBg : cc.Animation,

        contentTong : cc.Node,
        contentBan : cc.Node,
        contentNormal : cc.Node,
        contentMenu : cc.Node,
        contentFree : cc.Node,
        menuNormal : cc.Node,
        titleFree : cc.Node,
        nen : cc.Node,
    },

    ctor() {
        this.isShake = false;
    },

    SetTextFree()
    {
        if(this.numberFreeSpin >0 && this.numberFreeSpin < 10)
            this.lbFreeTurn.string = "0"+this.numberFreeSpin.toString();
        else this.lbFreeTurn.string = this.numberFreeSpin.toString();
    },

    HideFreeSpin() {
        this._super();
        this.totalWin = 0;
        this.lbTotalWin.string = "+0";
    },

    ShowFreeUI() {
        if(!this.freeObj.active) {
            
        }
    },

    ActionShowFreeUI() {
        this.contentBan.parent = this.contentTong;
        this.contentNormal.parent = this.contentTong;
        this.contentMenu.parent = this.contentTong;
        this.contentFree.active = false;
        this.titleFree.active = false;
        let actionZoom = cc.callFunc(() => {
            
            this.animBg.play("ZoomInFree");
            this.scheduleOnce(()=>{
                for(let i = 0; i < this.contentTong.children.length; i++) {
                    this.contentTong.children[i].active = false;
                }
                this.freeObj.active = true;
                this.contentTong.y = 0;
                this.contentNormal.active = true;
                this.contentMenu.active = true;
                this.menuNormal.active = false;
                this.contentFree.active = true;
                this.contentFree.parent = this.contentTong;
                this.contentNormal.setSiblingIndex(this.contentNormal.parent.children.length-1);
                this.contentMenu.setSiblingIndex(this.contentNormal.parent.children.length-1);
                this.contentTong.y = 850;
                this.contentTong.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
                this.scheduleOnce(()=>{
                    this.titleFree.active = true;
                    this.titleFree.scale = 4;
                    this.titleFree.runAction(cc.scaleTo(0.3, 1));
                    this.scheduleOnce(()=>{
                        this.VibrateScreen();
                    } , 0.3);  
                } , 0.5);  
            } , 1.5);  
        });
        this.contentTong.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, -850)), cc.delayTime(0.3), actionZoom));
    },

    ActionHideFreeUI() {
        this.contentTong.runAction(cc.moveTo(0.5, cc.v2(0, 850)));
        this.scheduleOnce(()=>{
            this.animBg.play("ZoomOutFree");
            this.scheduleOnce(()=>{
                this.contentTong.y = 0;
                this.contentFree.active = false;
                this.contentBan.active = true;
                this.menuNormal.active = true;
                this.nen.active = true;
                this.contentTong.y = -850;
                this.freeObj.active = false;
                this.slotView.normalManager.resetWild();
                this.contentTong.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
            } , 1.5);
        } , 0.3);
        
    },

    VibrateScreen() {
        this.isShake = true;
        this.scheduleOnce(()=>{
            this.isShake = false;
            this.slotView.node.setPosition(0,0);
        }, 0.2)
    },

    EndFreeGame() {
        this.slotView.ShowNotify(this.totalWin, ()=> this.ActionHideFreeUI());
    },

    UpdateJackpotValue(jackpotValue) {
        this.lbJackpot.string = Global.Helper.formatMoney(jackpotValue);
    },

    UpdateMoney(gold) {
        this.lbMoney.string = Global.Helper.formatMoney(gold);
    },

    ShowFree(numberFree, isNotify, winNormal) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        let firstTurn = false;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            // this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                firstTurn = true;
                this.lbNotifyTurn.string = numberFree + "LƯỢT";
                this.notifyFree.active = true;
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                // this.effectChangeTurn.play();
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.ActionShowFreeUI();
                this.SetTextFree();
                this.slotView.isFree = true;
            }, false);
            this.toDoList.Wait(2);
        }
        if(numberFree > 0 || this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.normalManager.SetJumpItem(this.toDoList);
            }, true);
            if(!firstTurn) {
                this.toDoList.AddWork(()=>{
                    if(winNormal > 0) {
                        this.AddTotalWinFree(winNormal);
                        this.slotView.UpdateLineWinData(this.slotView.listLineWinData);
                    }
                }, false);
                this.toDoList.AddWork(()=>{
                    this.UpdateMoneyResult(winNormal, this.toDoList, true);
                }, true);
            }
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.slotView.isFree = false;
            this.toDoList.AddWork(()=>{
                this.slotView.ShowNotify(this.totalWin, null);
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotify();
                this.SetToTalWinValue(0);
                this.ActionHideFreeUI();
            }, false);
            this.toDoList.Wait(1);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    AddTotalWin(winMoney) {
        
    },

   

    AddTotalWinFree(winMoney) {
        if(this.freeObj.active) {
            this.SetToTalWinValue(this.totalWin + winMoney);
            if(winMoney > 0) {
                for(let i = 0; i < 5; i++) {
                    this.scheduleOnce(()=>{
                        cc.resources.load("Coin" , cc.Prefab , (err , pre)=>{
                            let node = cc.instantiate(pre);
                            node.parent = this.freeObj;
                            node.setPosition(this.startCoinPos.getPosition());
                            let action1 = cc.moveTo(0.3 , this.endCoinPos.getPosition());
                            let action2 = cc.callFunc(()=>{ node.destroy()});
                            node.runAction(cc.sequence(action1 , action2));
                        });
                    } , 0.15 * i);
                }
                this.scheduleOnce(()=>{
                    this.lbTotalWin.string = "+"+Global.Helper.formatMoney(this.totalWin);
                } , 1);
            }
        }
    },

    update (dt) {
        if(this.isShake ){
            this.slotView.node.x = (Global.RandomNumber(-5 , 6));
            this.slotView.node.y = (Global.RandomNumber(-5 , 6));
        }
    },
});
