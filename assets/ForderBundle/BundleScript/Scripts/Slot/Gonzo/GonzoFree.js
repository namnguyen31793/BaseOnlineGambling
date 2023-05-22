cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.cacheValueMulti = 0;
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
    },

    ShowFree(numberFree, isNotify, winNormalValue = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;

        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.ClearTotalWinCache();
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                //this.notifyFree.active = false;
                this.slotView.HideNotifyWinFree();
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.effectChangeTurn.play();
            }, false);
            //wait anim item Spec destroy
            
            if(winNormalValue > 0)
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                //this.animFree.play("HoaRong");
            }, false);
            this.toDoList.Wait(0.5);
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
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.playAnimStartFree(false);
            }, false);
            this.toDoList.Wait(1);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimStartFree(isStart){
        this.slotView.ShowBoxMulti(isStart);
        if(isStart){
            this.freeTurn.play("EffectShowBoxFree");
            this.slotView.effectManager.PlayStartFreeCharacter();
        }else{
            this.freeTurn.play("EffectHideBoxFree");
            this.slotView.effectManager.PlayEndFreeCharacter();
        }
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
    
    UpdateMoneyResult(winNormalValue, toDoList, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotView.slotType)
        this.AddTotalWin(winNormalValue);
        let isBigWin = this.slotView.CheckBigWin(winNormalValue);
        if(winNormalValue > 0) {
            if(!isBigWin) {
                this.slotView.PlayWinMoney();
                //this.slotView.effectManager.ShowWinMoney(winNormalValue);
                if(isWaitRunMoneyWin) {
                    this.slotView.scheduleOnce(()=>{
                        toDoList.DoWork();
                    } , 2);  
                }else{
                    toDoList.DoWork();
                }
            } else {
                //this.slotView.menuView.ResetValueCacheWin();
                this.slotView.menuView.HideWinValueCache();
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(winNormalValue, toDoList, false, false, false);
            }
        } else {
            this.slotView.menuView.UpdateWinValue(winNormalValue);
            toDoList.DoWork();
        }
    },
    
});
