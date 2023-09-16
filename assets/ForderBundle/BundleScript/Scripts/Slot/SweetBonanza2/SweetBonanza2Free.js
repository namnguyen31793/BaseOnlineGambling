cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.cacheValueMulti = 0;
        this.listEffect = [];
        this.listFireBall = [];
        this.cacheMulti = 0;
    },

    properties: {
        effectShowMoneyStep : cc.Node,
        posFlyMulti : cc.Node,
    },

    ShowFree(numberFree, isNotify, winNormalValue = 0, extend = 1, listPosExtend = []) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;

        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.ClearTotalWinCache();
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(1.8);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.playAnimStartFree(true);
            }, false);
            
            if(winNormalValue > 0 && extend > 1){
                this.toDoList.AddWork(()=>{
                    this.CreateWinMoneyWithMutl(winNormalValue/extend, winNormalValue, extend);
                },false);
                this.MultiFly(listPosExtend, extend, winNormalValue, this.toDoList); 
                this.toDoList.Wait(5);
                this.toDoList.AddWork(()=>{
                    this.HideWinMoneyWithMutl();
                }, false);
            } 
            if(winNormalValue > 0)
                this.toDoList.AddWork(()=>this.UpdateMoneyResultFree( winNormalValue, this.toDoList, false),true);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimStartFree(true);
            }, false);
            this.toDoList.Wait(0.5);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
            }, false);
            this.toDoList.Wait(3);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.playAnimStartFree(false);
            }, false);
            this.toDoList.Wait(0.5);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimStartFree(isStart){
        //this.slotView.ShowBoxMulti(isStart);
        this.slotView.normalManager.showBGFree(isStart);
    },

    CheckItemWild() {

    },

    UpdateNumberMulti(num){
        if(this.cacheValueMulti != num)
            this.cacheValueMulti = parseInt(num);
        else
            return;
    },
    
    UpdateNumberMultiDrop(){
        this.cacheValueMulti += 1;
    },
    
    UpdateMoneyResultFree(totalWin, toDoList, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotView.slotType)
        this.AddTotalWin(totalWin);
        let isBigWin = this.slotView.CheckBigWin(totalWin);
        cc.log("UpdateMoneyResultFree "+totalWin+" - isBigWin "+isBigWin);
        if(totalWin > 0) {
            if(!isBigWin) {
                this.slotView.PlayWinMoney();
                //this.slotView.effectManager.ShowWinMoney(winNormalValue);
                if(isWaitRunMoneyWin) {
                    this.slotView.scheduleOnce(()=>{
                        this.slotView.UpdateWinValue(totalWin);
                        toDoList.DoWork();
                    } , 2);  
                }else{
                    this.slotView.UpdateWinValue(totalWin);
                    toDoList.DoWork();
                }
            } else {
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(totalWin, toDoList);
                this.slotView.UpdateWinValue(totalWin);
            }
        } else {
            this.slotView.UpdateWinValue(totalWin);
            toDoList.DoWork();
        }
    },

    CreateWinMoneyWithMutl(value, total, multi){
        this.effectShowMoneyStep.active = true;

        this.effectShowMoneyStep.getChildByName("money").getComponent("LbMonneyChange").reset();
        this.effectShowMoneyStep.getChildByName("money").getComponent("LbMonneyChange").setMoney(value);
        this.effectShowMoneyStep.getChildByName("total").getComponent("LbMonneyChange").reset();
        this.effectShowMoneyStep.getChildByName("total").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "";
        // this.effectShowMoneyStep.getComponent(cc.Animation).play("WinMoneyStep");
        this.cacheMulti = 0;
    },

    UpdateWinMoneyMutil(multi, isEnd = false){
        if(!isEnd)
            this.cacheMulti += multi;
        else
            this.cacheMulti = multi;
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "x"+this.cacheMulti;
    },

    EndWinMoneyWithMutl(total){
        this.effectShowMoneyStep.getChildByName("money").getComponent("LbMonneyChange").reset();
        this.effectShowMoneyStep.getChildByName("money").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("total").getComponent("LbMonneyChange").reset();
        this.effectShowMoneyStep.getChildByName("total").getComponent("LbMonneyChange").setMoney(total);
    },

    HideWinMoneyWithMutl(){
        this.effectShowMoneyStep.active = false;
        this.effectShowMoneyStep.getChildByName("money").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("total").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "";
    },

    MultiFly(listHaveWild, multi, total, toDoList) {
        cc.log(listHaveWild)
        if(listHaveWild.length == 0)
            return;
        let listItem = this.slotView.spinManager.listItem;
        if(listHaveWild[listHaveWild.length-1] != null){
            toDoList.Wait(0.5);
            for(let j = 0; j < 30; j++) {
                if(listHaveWild[listHaveWild.length-1][j] != null){
                    cc.log(listHaveWild[listHaveWild.length-1][j])
                    toDoList.AddWork(()=>{
                        listItem[j].ShowEffectBoom();
                    }, false);
                    toDoList.Wait(0.6);
                    toDoList.AddWork(()=>{
                        this.CreateEffectFlyItem(listItem[j].node.getPosition(), listHaveWild[listHaveWild.length-1][j]);
                    }, false);
                    toDoList.Wait(0.6);
                    toDoList.AddWork(()=>{
                        for(let i = 0; i < this.listEffect.length; i++) {
                            this.listEffect[i].destroy();
                        }
                        this.listEffect = [];
                    }, false);
                    toDoList.AddWork(()=>{
                        this.UpdateWinMoneyMutil(parseInt(listHaveWild[listHaveWild.length-1][j]));
                    }, false);
                }
            }
        }

        toDoList.AddWork(()=>{
            this.UpdateWinMoneyMutil(multi, true);
        }, false);
        toDoList.Wait(1);
        toDoList.AddWork(()=>{
            this.EndWinMoneyWithMutl(total);
        }, false);
    },

    CreateEffectFlyItem(pos, value){
        let eff = cc.instantiate(this.posFlyMulti);
        eff.parent = this.posFlyMulti.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getChildByName("value").getComponent(cc.Label).string = "x"+ Global.Helper.formatNumber(value);
        eff.runAction(cc.moveTo(0.5, cc.v2(30, 240)).easing(cc.easeSineOut()));    
        this.listEffect[this.listEffect.length] = eff;
    },
    
});
