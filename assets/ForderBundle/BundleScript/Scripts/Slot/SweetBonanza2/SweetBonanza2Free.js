cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.cacheValueMulti = 0;
        this.listEffect = [];
        this.listFireBall = [];
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
            this.toDoList.Wait(2.5);
            this.toDoList.AddWork(()=>{
                //this.notifyFree.active = false;
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
                if(listPosExtend.length > 0) {
                    this.MultiFly(listPosExtend); 
                } 
                this.toDoList.Wait(1.0);
                this.toDoList.AddWork(()=>{
                    for(let i = 0; i < this.listEffect.length; i++) {
                        this.listEffect[i].destroy();
                    }
                    this.listEffect = [];
                }, false);
                this.toDoList.Wait(2.5);
                this.toDoList.AddWork(()=>{
                    this.HideWinMoneyWithMutl();
                }, false);
            } 
            if(winNormalValue > 0)
                this.toDoList.AddWork(()=>this.UpdateMoneyResultFree(winNormalValue - winNormalValue/extend, winNormalValue, this.toDoList, false),true);
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
        this.slotView.ShowBoxMulti(isStart);
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
    
    UpdateMoneyResultFree(winNormalValue, totalWin, toDoList, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotView.slotType)
        this.AddTotalWin(winNormalValue);
        let isBigWin = this.slotView.CheckBigWin(winNormalValue);
        if(winNormalValue > 0) {
            if(!isBigWin) {
                this.slotView.PlayWinMoney();
                //this.slotView.effectManager.ShowWinMoney(winNormalValue);
                if(isWaitRunMoneyWin) {
                    this.slotView.scheduleOnce(()=>{
                        this.slotView.UpdateWinValue(winNormalValue);
                        toDoList.DoWork();
                    } , 2);  
                }else{
                    this.slotView.UpdateWinValue(winNormalValue);
                    toDoList.DoWork();
                }
            } else {
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(winNormalValue, toDoList);
            }
        } else {
            this.slotView.UpdateWinValue(winNormalValue);
            toDoList.DoWork();
        }
    },

    CreateWinMoneyWithMutl(value, total, multi){
        this.effectShowMoneyStep.active = true;

        this.effectShowMoneyStep.getChildByName("money").getComponent(cc.Label).string =  Global.Helper.formatNumber(value);
        this.effectShowMoneyStep.getChildByName("total").getComponent(cc.Label).string =  Global.Helper.formatNumber(total);
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "x"+ multi;
        this.effectShowMoneyStep.getComponent(cc.Animation).play("WinMoneyStep");
    },

    HideWinMoneyWithMutl(){
        this.effectShowMoneyStep.active = false;
        this.effectShowMoneyStep.getChildByName("money").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("total").getComponent(cc.Label).string = "";
        this.effectShowMoneyStep.getChildByName("multi").getComponent(cc.Label).string = "";
    },

    MultiFly(listHaveWild) {
        cc.log(listHaveWild)
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listHaveWild.length; i++) {
            if(listHaveWild[i] != null){
                cc.log("i "+i)
                for(let j = 0; j < 30; j++) {
                    if(listHaveWild[i][j] != null){
                        cc.log(listHaveWild[i][j])
                        this.CreateEffectFlyItem(listItem[j].node.getPosition(), listHaveWild[i][j]);
                    }
                }
            }
        }
    },

    CreateEffectFlyItem(pos, value){
        let eff = cc.instantiate(this.posFlyMulti);
        var target = this.effectShowMoneyStep.getPosition();
        eff.parent = this.posFlyMulti.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getChildByName("value").getComponent(cc.Label).string = "x"+ Global.Helper.formatNumber(value);
        eff.runAction(cc.moveTo(0.5, cc.v2(target.x+100, target.y)).easing(cc.easeSineOut()));    
        this.listEffect[this.listEffect.length] = eff;
    },
    
});
