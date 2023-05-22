cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listEffect = [];
        this.cacheNumQueen = 0;
        this.listTodoListEffect = [];
        this.cacheTotalSpin = 0;
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        //effectChangeBgFree : cc.Animation,
        flyLeaf : dragonBones.ArmatureDisplay,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue = 0, totalWin = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //save số lượt
            this.ClearTotalWinCache();
            cc.sys.localStorage.setItem("Key_Free_Alice" , numberFree);
            this.cacheTotalSpin = numberFree;

            this.toDoList.Wait(0.2);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowNotifyFree(numberFree);
                this.slotView.ClearWildEndFree();
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.effectChangeTurn.play();
            }, false);
            
            if(winNormalValue > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
            }
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            if(numberFree == 8)//fake tru turn dau nhan duoc
                cc.sys.localStorage.setItem("Key_Free_Alice" , numberFree);
            this.cacheTotalSpin = parseInt(cc.sys.localStorage.getItem("Key_Free_Alice")) || this.numberFreeSpin;

            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.playAnimShowGift(true);
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
                this.playAnimShowGift(false);
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
        this.flyLeaf.playAnimation("animtion0", 1);
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
            this.slotView.ClearWildEndFree();
            this.slotView.drawLineManager.StopDraw();
            //this.effectChangeBgFree.play("EffectHideBgFree");
        }else{
            this.freeTurn.play("EffectShowFree");
            //this.effectChangeBgFree.play("EffectShowBgFree");
        }
    },

    playAnimShowGift(isShow){
        this.slotView.playAnimShowGift(isShow);
    },

    
    UpdateNumberFreeDrop(num){
        this.numberFreeSpin += parseInt(num);
        this.cacheTotalSpin += parseInt(num);
        cc.sys.localStorage.setItem("Key_Free_Alice" , this.cacheTotalSpin);

        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
        this.effectChangeTurn.play();
    },

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
    },

    SetLastPrizeDrop(winNormalValue){
        this.AddTotalWin(winNormalValue);
        this.slotView.menuView.UpdateWinValue(winNormalValue);
    },
});
