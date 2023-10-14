cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listEffect = [];
        this.listTodoListEffect = [];
    },

    properties: {
        freeTurn : cc.Animation,
        //effectChangeTurn : cc.Animation,
        animFree : cc.Animation,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue = 0, isTakeJackpot = false) {
        cc.log("ShowFree numberFree "+numberFree+" isNotify "+isNotify+" isFree "+this.slotView.isFree);
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //save số lượt
            this.ClearTotalWinCache();
            cc.sys.localStorage.setItem("Key_Free_TayDu" , numberFree);
            this.cacheTotalSpin = numberFree;

            this.toDoList.Wait(0.2);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.HideNotifyWinFree();
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
            }, false);
            
            if(winNormalValue > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, isTakeJackpot, this.toDoList, true),true);
            }
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.cacheTotalSpin = parseInt(cc.sys.localStorage.getItem("Key_Free_TayDu")) || this.numberFreeSpin;

            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
            }, false);
            this.toDoList.Wait(2);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.SetToTalWinValue(0);
                this.playAnimShowFree(false);
            }, false);
            this.toDoList.Wait(1.5);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimShowFree(isStart){
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
        }else{
            this.freeTurn.play("EffectShowFree");
        }
    },
    UpdateMoneyResult(winNormalValue, isTakeJackpot, toDoList, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotView.slotType)
        this.AddTotalWin(winNormalValue);
        if(!isTakeJackpot) {
            if(winNormalValue > 0) {
                let isBigWin = this.slotView.CheckBigWin(winNormalValue);
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
        }else{
            this.slotView.PlayJackpot();
            this.slotView.effectManager.ShowJackpot(totalValue, this.toDoList, true, true);
        }  
    },

});
