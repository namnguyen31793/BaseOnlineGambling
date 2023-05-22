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
        txtImgFreeEnd : cc.Node,
        effectBackground : cc.Animation,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue = 0, totalWin = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //save số lượt
            this.ClearTotalWinCache();
            cc.sys.localStorage.setItem("Key_Free_Thai" , numberFree);
            this.cacheTotalSpin = numberFree;
            this.toDoList.AddWork(()=>{
                this.txtImgFreeEnd.active = true;
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(1.2);
            this.toDoList.AddWork(()=>{
                this.txtImgFreeEnd.active = false;
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
                cc.sys.localStorage.setItem("Key_Free_Thai" , numberFree);
            this.cacheTotalSpin = parseInt(cc.sys.localStorage.getItem("Key_Free_Thai")) || this.numberFreeSpin;

            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
            }, false);
            this.toDoList.Wait(1.5);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
                this.slotView.ClearWildEndFree();
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.SetToTalWinValue(0);
                this.playAnimShowFree(false);
            }, false);
            this.toDoList.Wait(0.6);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimShowFree(isStart){
        
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
            this.slotView.drawLineManager.StopDraw();
            this.effectBackground.play("animStartDay");
        }else{
            this.freeTurn.play("EffectShowFree");
            this.effectBackground.play("animStartNight");
        }
    },
    
    UpdateNumberFreeDrop(num){
        this.numberFreeSpin += parseInt(num);
        this.cacheTotalSpin += parseInt(num);
        cc.sys.localStorage.setItem("Key_Free_Thai" , this.cacheTotalSpin);

        this.lbFreeTurn.string = this.numberFreeSpin.toString();
        this.effectChangeTurn.play();
    },

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString();
    },

    SetLastPrizeDrop(winNormalValue){
        this.AddTotalWin(winNormalValue);
        this.slotView.menuView.UpdateWinValue(winNormalValue);
    },
});
